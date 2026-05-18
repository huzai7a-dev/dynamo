import { validateIPNSignature, generateIPNResponseHash } from '~~/shared/utils';

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const db = useDb();

    // 2Checkout sends IPN as application/x-www-form-urlencoded POST
    const body = await readBody(event);

    console.log('[2Checkout IPN] Received:', JSON.stringify(body, null, 2));

    // ─── 1. Verify signature using the Secret Key (NOT the Buy-Link Secret Word) ───
    const secretKey = config.twoCheckoutSecretKey as string;

    if (!validateIPNSignature(body, secretKey)) {
        console.error('[2Checkout IPN] Signature validation failed');
        throw createError({ statusCode: 401, statusMessage: 'Invalid IPN Signature' });
    }

    // ─── 2. Skip test orders in production (allow in sandbox mode) ───────────
    const isSandbox = config.twoCheckoutSandbox === 'true';
    if (!isSandbox && body.TEST_ORDER === '1') {
        console.log('[2Checkout IPN] Ignoring test order in production mode');
        // Still send read receipt
    } else {
        // ─── 3. Process only successful payment statuses ──────────────────────
        const successStatuses = ['COMPLETE', 'PAYMENT_AUTHORIZED', 'AUTHRECEIVED'];
        const orderStatus = body.ORDERSTATUS;

        if (successStatuses.includes(orderStatus)) {
            // REFNOEXT = the REF parameter we passed in the buy link = our transactionRef
            const transactionRef = body.REFNOEXT;

            if (!transactionRef) {
                console.error('[2Checkout IPN] REFNOEXT missing — cannot match transaction');
            } else {
                try {
                    // Fetch the transaction to get the items
                    const [transaction] = await db`
            SELECT id, user_id as "userId", status, items
            FROM payment_transactions
            WHERE transaction_ref = ${transactionRef}
          `;

                    if (!transaction) {
                        console.error(`[2Checkout IPN] Transaction not found: ${transactionRef}`);
                    } else if (transaction.status === 'paid') {
                        console.log(`[2Checkout IPN] Transaction ${transactionRef} already marked paid, skipping`);
                    } else {
                        // Parse items to update individual orders/vectors
                        const items = transaction.items as Array<{ type: 'order' | 'vector'; id: number }>;
                        const orderIds = items.filter(i => i.type === 'order').map(i => i.id);
                        const vectorIds = items.filter(i => i.type === 'vector').map(i => i.id);

                        // Mark the transaction as paid
                        await db`
              UPDATE payment_transactions
              SET status = 'paid', updated_at = NOW()
              WHERE transaction_ref = ${transactionRef}
            `;

                        // Mark orders as paid
                        if (orderIds.length > 0) {
                            await db`
                UPDATE orders
                SET payment_status = 'paid', updated_at = NOW()
                WHERE id = ANY(${orderIds}) AND user_id = ${transaction.userId}
              `;
                        }

                        // Mark vectors as paid
                        if (vectorIds.length > 0) {
                            await db`
                UPDATE vectors
                SET payment_status = 'paid', updated_at = NOW()
                WHERE id = ANY(${vectorIds}) AND user_id = ${transaction.userId}
              `;
                        }

                        console.log(`[2Checkout IPN] ✅ Transaction ${transactionRef} marked as PAID`);
                        console.log(`[2Checkout IPN]    Orders: [${orderIds}]  Vectors: [${vectorIds}]`);
                    }
                } catch (err) {
                    console.error('[2Checkout IPN] DB update error:', err);
                    // Do not throw — we still need to send the read receipt
                }
            }
        } else if (orderStatus === 'REFUND' || orderStatus === 'REVERSED') {
            // Handle refunds: reset back to pending
            const transactionRef = body.REFNOEXT;
            if (transactionRef) {
                await db`
          UPDATE payment_transactions
          SET status = 'refunded', updated_at = NOW()
          WHERE transaction_ref = ${transactionRef}
        `;
                console.log(`[2Checkout IPN] Transaction ${transactionRef} marked as REFUNDED`);
            }
        } else {
            console.log(`[2Checkout IPN] Unhandled status: ${orderStatus} — no action taken`);
        }
    }

    // ─── 4. Send the mandatory read receipt ───────────────────────────────────
    // 2Checkout will keep retrying the IPN until it receives this exact format.
    // Format: EPAYMENT|{IPN_PID[0]}|{IPN_PNAME[0]}|{IPN_DATE}|{DATE_NOW}|{HASH}
    const dateNow = new Date().toISOString().replace('T', ' ').replace(/\..+/, '');
    const pid = Array.isArray(body.IPN_PID) ? body.IPN_PID[0] : (body.IPN_PID || '');
    const pname = Array.isArray(body.IPN_PNAME) ? body.IPN_PNAME[0] : (body.IPN_PNAME || '');
    const ipnDate = body.IPN_DATE || '';

    const responseHash = generateIPNResponseHash(body, secretKey);
    const readReceipt = `EPAYMENT|${pid}|${pname}|${ipnDate}|${dateNow}|${responseHash}`;

    setResponseHeader(event, 'Content-Type', 'text/plain');
    return readReceipt;
});
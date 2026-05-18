import { generateBuyLinkSignature } from '~~/shared/utils';

export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event);
    const userId = session.user.id;
    const transactionRef = getRouterParam(event, 'ref');
    const db = useDb();
    const config = useRuntimeConfig();

    if (!transactionRef) {
        throw createError({ statusCode: 400, message: 'Transaction reference is required' });
    }

    // Fetch the transaction and verify ownership
    const [transaction] = await db`
    SELECT
      id,
      transaction_ref as "transactionRef",
      amount,
      currency,
      status
    FROM payment_transactions
    WHERE transaction_ref = ${transactionRef} AND user_id = ${userId}
  `;

    if (!transaction) {
        throw createError({ statusCode: 404, message: 'Invoice not found' });
    }

    if (transaction.status === 'paid') {
        throw createError({ statusCode: 400, message: 'This invoice has already been paid' });
    }

    // Fetch user details for pre-filling the 2Checkout checkout page
    const [user] = await db`
    SELECT
      primary_email as email,
      contact_name as "contactName",
      company_name as "companyName"
    FROM users
    WHERE id = ${userId}
  `;

    // ─── Build buy link parameters ────────────────────────────────────────────
    const merchantCode = config.twoCheckoutMerchantCode as string;
    const secretWord = config.twoCheckoutSecretWord as string;
    const isSandbox = config.twoCheckoutSandbox === 'true';
    const appUrl = config.appUrl as string;

    // Product name shown on the 2Checkout checkout page (no spaces allowed)
    const productName = `Invoice-No-${transactionRef}`;
    // Price must be a plain number string (no trailing zeroes beyond 2 decimals)
    const price = Number(transaction.amount).toFixed(2);
    const currency = (transaction.currency || 'USD').toLowerCase();

    // Return URL: where the user lands after payment (success)
    const returnUrl = `${appUrl}/invoices/unpaid?payment=success&ref=${transactionRef}`;

    // Parameters that are included in the signature
    // IMPORTANT: 'return-url' must use the raw, unencoded URL for signature generation
    const signedParams = {
        currency,
        price,
        prod: productName,
        qty: '1',
        type: 'digital',
        'return-url': returnUrl,
        'return-type': 'redirect',
        'order-ext-ref': transactionRef,
    };

    const signature = generateBuyLinkSignature(signedParams, secretWord);

    // Build the full checkout URL
    const checkoutParams = new URLSearchParams({
        merchant: merchantCode,
        dynamic: '1',
        currency,
        prod: productName,
        price,
        type: 'digital',
        qty: '1',
        tpl: 'default',
        // Pre-fill user details
        email: user?.email || '',
        name: user?.contactName || '',
        'company-name': user?.companyName || '',
        // Pass our internal ref so IPN can match the payment back to the transaction
        'order-ext-ref': transactionRef,
        // Return configuration
        'return-url': returnUrl,
        'return-type': 'redirect',
        // Sandbox / live toggle
        test: isSandbox ? '1' : '0',
        // Signature (must be last — not part of the signed string, just appended)
        signature,
    });

    const checkoutUrl = `https://secure.2checkout.com/checkout/buy/?${checkoutParams.toString()}`;

    return { checkoutUrl };
});

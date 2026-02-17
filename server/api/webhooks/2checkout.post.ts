// server/api/webhooks/2checkout.post.ts
import { generateResponseHash, validateTCOSignature } from '~~/shared/utils';

export default defineEventHandler(async (event) => {
    const { twoCheckoutSecretWord } = useRuntimeConfig()
    const body = await readBody(event);


    // 1. Validate Hash (Essential for security)
    if (!validateTCOSignature(body, twoCheckoutSecretWord)) {
        throw createError({ statusCode: 401, statusMessage: 'Invalid Signature' });
    }

    // 2. Check Payment Status
    if (body.ORDERSTATUS === 'COMPLETE' || body.ORDERSTATUS === 'AUTHRECEIVED') {
        const orderId = body.REFNO;

        console.log('Update database')

        // Update your database here
        // await db.orders.update({ where: { id: body.EXTERNAL_REFERENCE }, data: { status: 'paid' } });
    }

    // 3. Respond with 2Checkout's required format (EPAYMENT response)
    const date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    return `EPAYMENT|${body.IPN_PID[0]}|${body.IPN_PNAME[0]}|${date}|${generateResponseHash(body, twoCheckoutSecretWord)}`;
});
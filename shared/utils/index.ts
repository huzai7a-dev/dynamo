export const formateDate = (date: string) => {
  const formatted = new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    // hour: "2-digit",
    // minute: "2-digit",
    // hour12: true,
  });

  return formatted
}


import crypto from 'crypto';

/**
 * Validates the incoming IPN signature from 2Checkout
 */
export function validateTCOSignature(body: any, secretWord: string): boolean {
  const receivedHash = body.HASH;

  // 1. Remove the HASH field from the object to calculate the signature
  const { HASH, ...data } = body;

  // 2. 2Checkout IPN hash calculation:
  // For each field, you must concatenate: [length of value] + [value]
  let result = "";
  Object.keys(data).forEach((key) => {
    const value = data[key];
    // If the value is an array (common in IPNs), iterate through it
    if (Array.isArray(value)) {
      value.forEach((val) => {
        result += val.length + val;
      });
    } else {
      result += String(value).length + String(value);
    }
  });

  const expectedHash = crypto
    .createHmac('md5', secretWord) // Use 'sha256' if configured in your dashboard
    .update(result)
    .digest('hex');

  return expectedHash === receivedHash;
}

/**
 * Generates the mandatory response hash to confirm receipt of IPN
 */
export function generateResponseHash(body: any, secretWord: string): string {
  // 2Checkout requires a specific confirmation string:
  // IPN_PID (Product ID) + IPN_PNAME (Product Name) + IPN_DATE + DATE_NOW
  // This is then hashed with the Secret Word.

  const pid = body.IPN_PID[0];
  const pname = body.IPN_PNAME[0];
  const ipnDate = body.IPN_DATE;
  const dateNow = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

  const dataString =
    pid.length + pid +
    pname.length + pname +
    ipnDate.length + ipnDate +
    dateNow.length + dateNow;

  return crypto
    .createHmac('md5', secretWord)
    .update(dataString)
    .digest('hex');
}
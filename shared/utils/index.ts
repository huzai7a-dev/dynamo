import crypto from 'crypto';

export const formateDate = (date: string) => {
  const formatted = new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return formatted
}

// ─────────────────────────────────────────────────────────────────────────────
// BUY LINK SIGNATURE (uses Buy-Link Secret Word)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates the HMAC-SHA256 signature for a 2Checkout dynamic buy link.
 *
 * Algorithm (from official docs):
 *  1. Select signed params: currency, price, prod, qty, type (alphabetical order).
 *     NOTE: `merchant` is explicitly excluded.
 *  2. Serialize each value: prepend the raw string length to the value.
 *     e.g. "usd" → "3usd", "115.00" → "6115.00"
 *  3. Concatenate all serialized values.
 *  4. HMAC-SHA256 using the Buy-Link Secret Word as the key.
 */
export function generateBuyLinkSignature(
  params: Record<string, string>,
  secretWord: string
): string {
  // Alphabetical order — 'merchant' and other non-signed params should NOT be in 'params'
  const orderedKeys = Object.keys(params).sort();

  const serialized = orderedKeys
    .map(key => {
      const val = params[key];
      return `${val.length}${val}`;
    })
    .join('');

  return crypto
    .createHmac('sha256', secretWord)
    .update(serialized)
    .digest('hex');
}

// ─────────────────────────────────────────────────────────────────────────────
// IPN VERIFICATION (uses Secret Key — different from Buy-Link Secret Word)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validates the incoming IPN request from 2Checkout.
 *
 * Uses SIGNATURE_SHA2_256 (SHA-256). MD5 is deprecated by 2Checkout.
 *
 * Algorithm:
 *  1. Collect all POST fields, excluding SIGNATURE_SHA2_256 and SIGNATURE_SHA3_256.
 *  2. For each field value (sorted by key alphabetically), serialize: length+value.
 *     Arrays are iterated and each element is serialized separately.
 *  3. HMAC-SHA256 with the Secret Key.
 *  4. Compare against SIGNATURE_SHA2_256 from the POST body.
 */
export function validateIPNSignature(body: Record<string, any>, secretKey: string): boolean {
  const received = body.SIGNATURE_SHA2_256;
  if (!received) return false;

  // Exclude signature fields
  const excluded = new Set(['HASH', 'SIGNATURE_SHA2_256', 'SIGNATURE_SHA3_256']);

  // IMPORTANT: Maintain the order of the fields as they appear in the POST body.
  // Do NOT sort alphabetically — that's only for buy-link signatures.
  let serialized = '';
  for (const key of Object.keys(body)) {
    if (excluded.has(key)) continue;

    const value = body[key];
    if (Array.isArray(value)) {
      for (const v of value) {
        const str = String(v);
        // Use byte-length for proper UTF-8 handling (matches PHP strlen)
        serialized += `${Buffer.byteLength(str, 'utf8')}${str}`;
      }
    } else {
      const str = String(value);
      serialized += `${Buffer.byteLength(str, 'utf8')}${str}`;
    }
  }

  const expected = crypto
    .createHmac('sha256', secretKey)
    .update(serialized)
    .digest('hex');

  return expected === received;
}

/**
 * Generates the mandatory EPAYMENT read-receipt hash.
 *
 * 2Checkout requires this confirmation so it stops retrying the IPN.
 * Format: EPAYMENT|{IPN_PID[0]}|{IPN_PNAME[0]}|{IPN_DATE}|{DATE_NOW}|{HASH}
 *
 * Uses SHA-256 (matching validateIPNSignature above).
 */
export function generateIPNResponseHash(body: Record<string, any>, secretKey: string): string {
  const pid = Array.isArray(body.IPN_PID) ? body.IPN_PID[0] : body.IPN_PID;
  const pname = Array.isArray(body.IPN_PNAME) ? body.IPN_PNAME[0] : body.IPN_PNAME;
  const ipnDate = body.IPN_DATE;
  const dateNow = new Date().toISOString().replace('T', ' ').replace(/\..+/, '');

  const parts = [pid, pname, ipnDate, dateNow];
  const dataString = parts.map(v => `${String(v).length}${v}`).join('');

  return crypto
    .createHmac('sha256', secretKey)
    .update(dataString)
    .digest('hex');
}

// ─────────────────────────────────────────────────────────────────────────────
// LEGACY EXPORTS (kept for backward compat, prefer the new functions above)
// ─────────────────────────────────────────────────────────────────────────────

/** @deprecated Use validateIPNSignature instead */
export function validateTCOSignature(body: any, secretKey: string): boolean {
  return validateIPNSignature(body, secretKey);
}

/** @deprecated Use generateIPNResponseHash instead */
export function generateResponseHash(body: any, secretKey: string): string {
  return generateIPNResponseHash(body, secretKey);
}
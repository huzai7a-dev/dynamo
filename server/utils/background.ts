import { waitUntil } from "@vercel/functions";

export function runInBackground(promise: Promise<unknown>) {
    waitUntil(promise);
}

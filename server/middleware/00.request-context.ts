import { randomUUID } from "node:crypto";

export default defineEventHandler((event) => {
    const requestId = randomUUID();
    event.context.requestId = requestId;
    event.context.requestStart = Date.now();
    event.context.logger = useLogger().withTag(requestId);

    event.context.logger.info(`--> ${event.method} ${getRequestURL(event).pathname}`);
});

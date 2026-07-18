export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook("beforeResponse", (event) => {
        setResponseHeader(event, "x-request-id", event.context.requestId);
    });

    nitroApp.hooks.hook("afterResponse", (event) => {
        const duration = Date.now() - event.context.requestStart;
        const status = event.node.res.statusCode;
        (event.context.logger || useLogger()).info(
            `<-- ${event.method} ${getRequestURL(event).pathname} ${status} (${duration}ms)`
        );
    });

    nitroApp.hooks.hook("error", (error, { event }) => {
        (event?.context.logger || useLogger()).error("Unhandled error:", error);
    });
});

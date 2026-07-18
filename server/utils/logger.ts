import { consola } from "consola";

const baseLogger = consola.withTag("dynamo");

export function useLogger() {
    const event = useEvent();
    return (event?.context.logger as typeof baseLogger) || baseLogger;
}

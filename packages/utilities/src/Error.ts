import type { AxiosError } from "axios";

/** A function to determine whether an error is an `AxiosError` */
export function isAxiosError(error: unknown): error is AxiosError {
    return (error as AxiosError)?.isAxiosError;
}

/** Serializes an error into an object that can be easily stored (e.g. in logs) */
export function serializeError(error: unknown): Record<string, unknown> {
    if (isAxiosError(error)) {
        return {
            message: `AjaxError ${error.code}: ${error.message}`,
            statusCode: error.code,
            stack: error.stack,
        };
    }

    if (error instanceof Error) {
        const errorAsJSON: string = JSON.stringify(error, Object.getOwnPropertyNames(error));
        return JSON.parse(errorAsJSON) as Record<string, unknown>;
    }

    // Anything else, we log the value as some kind of unknown error.  Hopefully this never happens.
    return {
        message: "Unknown error",
        value: error,
    };
}

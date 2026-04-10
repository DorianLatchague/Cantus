import { useConst } from "@fluentui/react-hooks";
import { useState } from "react";
import type { DeepPartial } from "@gray/utilities";
import { cloneAndPatch } from "@gray/utilities";

/**
 * A hook to update the Object states with [DeepPartial](../Utils/Object.ts)
 *
 * @param initialState The initial state of the object
 * @returns {[T, (update: DeepPartial<T> | ((oldObject: T) => DeepPartial<T>)) => void]} the state and a function to patch the state using [DeepPartial](../Utils/Object.ts)
 */
export function useObjectState<T extends object>(initialState: T | (() => T)): [T, (update: DeepPartial<T> | ((oldObject: T) => DeepPartial<T>)) => void] {
    const [state, setState] = useState<T>(initialState);

    const patch = useConst(
        () =>
            (update: DeepPartial<T> | ((oldObject: T) => DeepPartial<T>)): void =>
                setState((oldVal) => cloneAndPatch(oldVal, update)),
    );

    return [state, patch];
}

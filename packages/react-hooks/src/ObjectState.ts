import { useConst } from "@fluentui/react-hooks";
import { useState } from "react";
import type { DeepPartial } from "@cantus/utilities";
import { patch as cantusPatch } from "@cantus/utilities";

/**
 * A hook to update the Object states with [DeepPartial](../Utils/Object.ts)
 *
 * @param initialState The initial state of the object
 * @returns {[T, (patch: DeepPartial<T> | ((oldObject: T) => DeepPartial<T>)) => void]} the state and a function to patch the state using [DeepPartial](../Utils/Object.ts)
 */
export function useObjectState<T extends object>(initialState: T | (() => T)): [T, (patch: DeepPartial<T> | ((oldObject: T) => DeepPartial<T>)) => void] {
    const [state, setState] = useState<T>(initialState);

    return [
        state,
        useConst(
            () =>
                (patch: DeepPartial<T> | ((oldObject: T) => DeepPartial<T>)): void =>
                    setState((oldVal) => cantusPatch(oldVal, patch)),
        ),
    ];
}

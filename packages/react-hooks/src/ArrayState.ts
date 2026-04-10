import { useConst } from "@fluentui/react-hooks";
import { clone, findLastIndex, isEmpty, remove } from "lodash";
import * as React from "react";
import { removeFirst, replaceInArray, upsertToEnd, upsertToStart } from "@gray/utilities";

/** Updater callbacks returned by `useArrayState` */
export interface ArrayState<T> {
    /** The value of the array state */
    current: T[];

    /** Removes all elements from the state array, leaving only an empty array. If already empty, the state will not change */
    empty: (onEmpty?: (removedItems: T[]) => void) => void;

    /** A function to keep only the items within the state array matching the provided predicate. */
    filter: (predicate: (item: T) => boolean, onFilter?: (removedItems: T[]) => void) => void;

    /** Removes the last item from the state array. If the array is empty, the state is not updated */
    pop: (onPop?: (removedItem: T) => void) => void;

    /** Appends new elements to the end of the state array */
    push: (...newItems: T[]) => void;

    /** A function to remove ALL the items within the state array matching the provided predicate. If no items match the predicate, the state will not change */
    remove: (predicate: (item: T) => boolean, onRemove?: (removedItems: T[]) => void) => void;

    /** A function to remove the first item within the state array matching the provided predicate. If no items match the predicate, the state will not change  */
    removeFirst: (predicate: (item: T) => boolean, onRemove?: (removedItem: T) => void) => void;

    /** A function to remove the last item within the state array matching the provided predicate. If no items match the predicate, the state will not change */
    removeLast: (predicate: (item: T) => boolean, onRemove?: (removedItem: T) => void) => void;

    /**
     * A function to update a single item within the state array. If no items match the predicate, the state will not change
     */
    replace: (update: T | ((oldItem: T) => T), predicate: (item: T) => boolean) => void;

    /** Reverses the elements of the state array */
    reverse: () => void;

    /** A function to update the entire array, i.e. the `setState` function returned by `React.useState` */
    setArrayState: (value: React.SetStateAction<T[]>) => void;

    /** Removes the first element from the state array. If the array is empty, the state is not updated */
    shift: (onShift?: (shiftedItem: T) => void) => void;

    /**
     * Sorts the state array.
     * @param compareFn Function used to determine the order of the elements. It is expected to return a negative value if the first argument is less than the second argument, zero if they're equal, and a positive value otherwise. If omitted, the elements are sorted in ascending, ASCII character order.
     */
    sort: (compareFn?: (a: T, b: T) => number) => void;

    /** Inserts new elements at the start of the state array */
    unshift: (...newItem: T[]) => void;

    /** A function to update a single item within the state array. If no items match the predicate, the item will be inserted at the end */
    upsertToEnd: (newItem: T, predicate: (item: T) => boolean) => void;

    /** A function to update a single item within the state array. If no items match the predicate, the item will be inserted at the beginning */
    upsertToStart: (newItem: T, predicate: (item: T) => boolean) => void;
}

/**
 * Hook to store a state array and generate callbacks for updating its value.
 * The identity of the callbacks will always stay the same.
 *
 * @template T The type of an individual item in the array state
 * @param initialState The initial state, if not provided will default to an empty array
 * @returns {[T[], ArrayState<T>]} the state and an object full of callbacks to manipulate the state
 */
export function useArrayState<T>(initialState?: T[] | (() => T[])): ArrayState<T> {
    const [state, setState] = React.useState<T[]>(initialState ?? []);

    const updateFunctions: Omit<ArrayState<T>, "current"> = useConst({
        empty: (onEmpty?: (removedItems: T[]) => void) =>
            setState((oldState) => {
                if (isEmpty(oldState)) {
                    return oldState;
                }

                onEmpty?.([...oldState]);
                return [];
            }),
        filter: (predicate: (item: T) => boolean, onFilter?: (removedItems: T[]) => void) =>
            setState((oldState) => {
                if (isEmpty(oldState)) {
                    return oldState;
                }
                const newState = [...oldState];
                const removedItems = remove(newState, (item: T) => !predicate(item));
                if (isEmpty(removedItems)) {
                    return oldState;
                }

                onFilter?.(removedItems);
                return newState;
            }),
        pop: (onPop?: (poppedItem: T) => void) =>
            setState((oldState) => {
                if (isEmpty(oldState)) {
                    return oldState;
                }
                const newState = [...oldState];
                const poppedItem = newState.pop();
                if (poppedItem) {
                    onPop?.(poppedItem);
                }
                return newState;
            }),
        push: (...newItems: T[]) => setState((oldState) => [...oldState, ...newItems]),
        remove: (predicate: (item: T) => boolean, onRemove?: (removedItems: T[]) => void) =>
            setState((oldState) => {
                if (isEmpty(oldState)) {
                    return oldState;
                }
                const newState = [...oldState];
                const removedItems = remove(newState, predicate);
                if (isEmpty(removedItems)) {
                    onRemove?.(removedItems);
                    return oldState;
                }
                return newState;
            }),
        removeFirst: (predicate: (item: T) => boolean, onRemove?: (removedItem: T) => void) => setState((oldState) => removeFirst(oldState, predicate, onRemove)),
        removeLast: (predicate: (item: T) => boolean, onRemove?: (removedItem: T) => void) =>
            setState((oldState) => {
                if (isEmpty(oldState)) {
                    return oldState;
                }

                const index = findLastIndex(oldState, predicate);

                if (index > -1) {
                    const removedItem = oldState[index];
                    const newItems: T[] = [...oldState];
                    newItems.splice(index, 1);
                    onRemove?.(removedItem);
                    return newItems;
                }

                return oldState;
            }),
        replace: (update: T | ((oldItem: T) => T), predicate: (item: T) => boolean) => setState((oldState) => replaceInArray(oldState, update, predicate)),
        reverse: () =>
            setState((oldState) => {
                if (isEmpty(oldState)) {
                    return oldState;
                }
                return clone(oldState).reverse();
            }),
        setArrayState: setState,
        shift: (onShift?: (shiftedItem: T) => void) =>
            setState((oldState) => {
                if (isEmpty(oldState)) {
                    return oldState;
                }
                const newState = [...oldState];
                const shiftedItem = newState.shift();
                if (shiftedItem) {
                    onShift?.(shiftedItem);
                }
                return newState;
            }),
        sort: (compareFn?: (a: T, b: T) => number) =>
            setState((oldState) => {
                if (isEmpty(oldState)) {
                    return oldState;
                }
                return clone(oldState).sort(compareFn);
            }),
        unshift: (...newItems: T[]) => setState((oldState) => [...newItems, ...oldState]),
        upsertToEnd: (newItem: T, predicate: (item: T) => boolean) => setState((oldState) => upsertToEnd(oldState, newItem, predicate)),
        upsertToStart: (newItem: T, predicate: (item: T) => boolean) => setState((oldState) => upsertToStart(oldState, newItem, predicate)),
    });

    return {
        current: state,
        ...updateFunctions,
    };
}

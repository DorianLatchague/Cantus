import { isEmpty } from "lodash";

/**
 * Returns a shallow copy of an array, and replaces the first item that matches the given predicate.
 *
 * @template T the type of the items in the array
 * @param {T[]} items The items.
 * @param {T | ((item: T) => T)} update The update to apply.
 * @param {(item: T) => boolean)} predicate The predicate to find the item that needs updating.
 * @returns {T[]} A shallow copy of items with the updated item if an item was updated, or the original items.
 */
export const replaceInArray = <T>(items: T[], update: T | ((item: T) => T), predicate: (item: T) => boolean): T[] => {
    if (isEmpty(items)) {
        return items;
    }

    const newItems: T[] = [...items];
    const index: number = newItems.findIndex(predicate);

    if (index > -1) {
        newItems[index] = typeof update === "function" ? (update as (item: T) => T)(newItems[index]) : update;
        return newItems;
    }
    return items;
};

/**
 * Returns a shallow copy of an array, and removes the first item that matches the given predicate
 *
 * @template T the type of the items in the array
 * @param {T[]} items The items.
 * @param {(item: T) => boolean)} predicate The predicate to find the item that needs to be removed
 * @param {(removedItem: T) => void)} onRemove A callback that runs when an item is removed
 * @returns {T[]} A shallow copy of items with the item removed if one matched the predicate.
 */
export const removeFirst = <T>(items: T[], predicate: (item: T) => boolean, onRemove?: (removedItem: T) => void): T[] => {
    if (isEmpty(items)) {
        return items;
    }

    const index: number = items.findIndex(predicate);

    if (index > -1) {
        const removedItem = items[index];
        const newItems: T[] = [...items];
        newItems.splice(index, 1);
        onRemove?.(removedItem);
        return newItems;
    }

    return items;
};

/**
 * Returns a shallow copy of an array, and replaces the first item that matches the given predicate or adds it to the array.
 *
 * @template T the type of the items in the array
 * @param {T[]} items The items.
 * @param {T} item The updated/new item.
 * @param {(item: T) => boolean} predicate The predicate to find the item that needs updating.
 * @returns A shallow copy of items with the updated/new item.
 */
export const upsertToEnd = <T>(items: T[], item: T, predicate: (item: T) => boolean): T[] => {
    if (isEmpty(items)) {
        return [item];
    }

    const newItems: T[] = [...items];
    const index: number = newItems.findIndex(predicate);

    if (index > -1) {
        newItems[index] = item;
    } else {
        newItems.push(item);
    }

    return newItems;
};

/**
 * Returns a shallow copy of an array, and replaces the first item that matches the given predicate or unshifts it to the array.
 *
 * @template T the type of the items in the array
 * @param {T[]} items The items.
 * @param {T} item The updated/new item.
 * @param {(item: T) => boolean} predicate The predicate to find the item that needs updating.
 * @returns A shallow copy of items with the updated/new item.
 */
export const upsertToStart = <T>(items: T[], item: T, predicate: (item: T) => boolean): T[] => {
    if (isEmpty(items)) {
        return [item];
    }

    const newItems: T[] = [...items];
    const index: number = newItems.findIndex(predicate);

    if (index > -1) {
        newItems[index] = item;
    } else {
        newItems.unshift(item);
    }

    return newItems;
};

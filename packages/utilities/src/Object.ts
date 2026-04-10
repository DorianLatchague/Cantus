import { cloneDeepWith, isBuffer, isTypedArray, mergeWith } from "lodash";

/**
 * DotNestedKeyofValue<T, V> defines a type that represents the keys of T, including nested ones whose values extends V.
 *
 * The nesting delimiter is a period. This pairs well with lodash get() which takes an object and a dot
 * delimited key, and returns the nested value.
 *
 * If you run into the following error, provide a smaller value for the D parameter:
 *
 *   >> Type instantiation is excessively deep and possibly infinite
 *
 * @param T The interface
 * @param D The maximum allowed depth of the key reference. Setting this too high may cause the compiler to struggle.
 *
 * @example
 * interface MyData {
 *     id: string;
 *     properties: {
 *         title: string;
 *         author: {
 *             name: string;
 *             date: Date;
 *         }
 *     }
 * }
 *
 * let key: DotNestedKeyofValue<MyData, string>;
 *
 * key = "id"                     // Allowed
 * key = "properties.title"       // Allowed
 * key = "properties.author.date" // Compilation error
 * key = "foo"                    // Compilation Error
 * key = "properties.bar"         // Compilation Error
 *
 *
 * @link https://stackoverflow.com/questions/58434389/typescript-deep-keyof-of-a-nested-object
 * @link https://lodash.com/docs/4#get
 *
 */
export type DotNestedKeyofValue<T, V, D extends number = 5> = D extends [never]
    ? never
    : T extends object
    ? {
          [K in keyof T]-?: K extends string | number ? (T[K] extends V ? `${K}` : never) | (DotNestedKeyofValue<T[K], V, Prev[D]> extends infer R ? Join<K, R> : never) : never;
      }[keyof T]
    : never;

/**
 * DotNestedKeyof<T> defines a type that represents the keys of T, including nested ones.
 *
 * The nesting delimiter is a period. This pairs well with lodash get() which takes an object and a dot
 * delimited key, and returns the nested value.
 *
 * If you run into the following error, provide a smaller value for the D parameter:
 *
 *   >> Type instantiation is excessively deep and possibly infinite
 *
 * @param T The interface
 * @param D The maximum allowed depth of the key reference. Setting this too high may cause the compiler to struggle.
 *
 * @example
 * interface MyData {
 *     id: string;
 *     properties: {
 *         title: string;
 *         author: {
 *             name: string;
 *             date: Date;
 *         }
 *     }
 * }
 *
 * let key: DotNestedKeyof<MyData>;
 *
 * key = "id"                     // Allowed
 * key = "properties.title"       // Allowed
 * key = "properties.author.date" // Allowed
 * key = "foo"                    // Compilation Error
 * key = "properties.bar"         // Compilation Error
 *
 *
 * @link https://stackoverflow.com/questions/58434389/typescript-deep-keyof-of-a-nested-object
 * @link https://lodash.com/docs/4#get
 *
 */
export type DotNestedKeyof<T, D extends number = 5> = DotNestedKeyofValue<T, unknown, D>;

type Join<K, P> = K extends string | number ? (P extends string | number ? `${K}${"" extends P ? "" : "."}${P}` : never) : never;

type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...0[]];

/** A deep `Partial` of an object where each nested property is optional */
export type DeepPartial<T> = T extends object
    ? {
          [P in keyof T]?: T[P] extends unknown[] ? T[P] : DeepPartial<T[P]>;
      }
    : T;

/**
 * A function to clone an object and apply some updates to some of its nested properties.
 * Particularly useful when working with objects in React states.
 *
 * @template T the type of the object
 * @param {T} originalObject The original object that will be cloned and updated
 * @param {...(DeepPartial<T> | ((originalObject: T) => DeepPartial<T>))[]} updates The DeepPartial updates containing the nested properties to replace in the `originalObject`
 * @returns {T} A new object combining the `originalObject` with the nested properties of the `updates`
 */
export function cloneAndPatch<T extends object>(originalObject: T, ...updates: (DeepPartial<T> | ((originalObject: T) => DeepPartial<T>))[]): T {
    const newObject: T = cloneDeepWith(originalObject, (val: T) => {
        if (isArrayLike(val)) {
            return val;
        }
        return undefined;
    }) as T;

    return updates.reduce(
        (finalObject, update) =>
            mergeWith(newObject, typeof update === "function" ? update(finalObject) : update, (_: never, newVal: T) => {
                if (newVal === null) {
                    return null;
                }

                if (isArrayLike(newVal)) {
                    return newVal;
                }

                return undefined;
            }),
        originalObject,
    );
}

function isArrayLike(value: unknown) {
    const isArr = Array.isArray(value);
    const isBuff = !isArr && isBuffer(value);
    const isTyped = !isArr && !isBuff && isTypedArray(value);

    return isArr || isBuff || isTyped;
}

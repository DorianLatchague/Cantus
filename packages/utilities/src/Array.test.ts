import { describe, expect, it, vi } from "vitest";
import { removeFirst, replaceInArray, upsertToEnd, upsertToStart } from "./Array";

describe("Utils/Array", () => {
    describe("replaceInArray", () => {
        interface TestObject {
            id: number;
            name: string;
        }

        it("An empty array should not be modified", () => {
            const array: TestObject[] = [];
            const newArray: TestObject[] = replaceInArray(array, { id: 2, name: "New Value" }, () => true);
            expect(newArray).toBe(array);
        });

        it("The array passed in should not be modified", () => {
            const array: TestObject[] = [
                { id: 1, name: "A" },
                { id: 2, name: "B" },
                { id: 3, name: "C" },
            ];

            replaceInArray(array, { id: 2, name: "New Value" }, (item) => item.id === 2);

            expect(array).toEqual([
                { id: 1, name: "A" },
                { id: 2, name: "B" },
                { id: 3, name: "C" },
            ]);
        });

        it("First match should be replaced", () => {
            const array: TestObject[] = [
                { id: 1, name: "A" },
                { id: 2, name: "B" },
                { id: 3, name: "C" },
            ];

            const newArray: TestObject[] = replaceInArray(array, { id: 2, name: "New Value" }, (item) => item.id === 2);

            expect(newArray).toEqual([
                { id: 1, name: "A" },
                { id: 2, name: "New Value" },
                { id: 3, name: "C" },
            ]);
        });

        it("Subsequent matches should not be replaced", () => {
            const array: TestObject[] = [
                { id: 1, name: "A" },
                { id: 2, name: "A" },
                { id: 3, name: "A" },
            ];

            const newArray: TestObject[] = replaceInArray(array, { id: 1, name: "New Value" }, (item) => item.name === "A");

            expect(newArray).toEqual([
                { id: 1, name: "New Value" },
                { id: 2, name: "A" },
                { id: 3, name: "A" },
            ]);
        });

        it("No matches should return the original array", () => {
            const array: TestObject[] = [
                { id: 1, name: "A" },
                { id: 2, name: "B" },
                { id: 3, name: "C" },
            ];

            const newArray: TestObject[] = replaceInArray(array, { id: 4, name: "New Value" }, (item) => item.id === 4);

            expect(newArray).toEqual(array);
        });

        it("Update function should be called", () => {
            const array: TestObject[] = [
                { id: 1, name: "A" },
                { id: 2, name: "B" },
                { id: 3, name: "C" },
            ];

            const updateFunction = (item: TestObject) => ({ ...item, name: `[${item.name}]` });
            const newArray: TestObject[] = replaceInArray(array, updateFunction, (item) => item.id === 2);

            expect(newArray).toEqual([
                { id: 1, name: "A" },
                { id: 2, name: "[B]" },
                { id: 3, name: "C" },
            ]);
        });
    });

    describe("removeFirst", () => {
        interface TestObject {
            id: number;
            name: string;
        }

        it("An empty array should not be updated", () => {
            const array: TestObject[] = [];
            const newArray: TestObject[] = removeFirst(array, () => true);
            expect(newArray).toEqual([]);
            expect(newArray).toBe(array);
        });

        it("The array passed in should not be modified", () => {
            const array: TestObject[] = [
                { id: 1, name: "A" },
                { id: 2, name: "B" },
                { id: 3, name: "C" },
            ];

            removeFirst(array, (item) => item.id === 2);

            expect(array).toEqual([
                { id: 1, name: "A" },
                { id: 2, name: "B" },
                { id: 3, name: "C" },
            ]);
        });

        it("First match should be removed", () => {
            const array: TestObject[] = [
                { id: 1, name: "A" },
                { id: 2, name: "B" },
                { id: 3, name: "C" },
            ];

            const newArray: TestObject[] = removeFirst(array, (item) => item.id === 2);

            expect(newArray).toEqual([
                { id: 1, name: "A" },
                { id: 3, name: "C" },
            ]);
        });

        it("Subsequent matches should not be removed", () => {
            const array: TestObject[] = [
                { id: 1, name: "A" },
                { id: 2, name: "A" },
                { id: 3, name: "A" },
            ];

            const newArray: TestObject[] = removeFirst(array, (item) => item.name === "A");

            expect(newArray).toEqual([
                { id: 2, name: "A" },
                { id: 3, name: "A" },
            ]);
        });

        it("No matches should not modify the array", () => {
            const array: TestObject[] = [
                { id: 1, name: "A" },
                { id: 2, name: "B" },
                { id: 3, name: "C" },
            ];

            const newArray: TestObject[] = removeFirst(array, (item) => item.id === 0);

            expect(newArray).toBe(array);
            expect(newArray).toEqual([
                { id: 1, name: "A" },
                { id: 2, name: "B" },
                { id: 3, name: "C" },
            ]);
        });

        it("Matches should trigger onRemove with the correct item", () => {
            const array: TestObject[] = [
                { id: 1, name: "A" },
                { id: 2, name: "B" },
                { id: 3, name: "C" },
            ];

            const onRemove = vi.fn();
            removeFirst(array, (item) => item.id === 2, onRemove);
            expect(onRemove).toHaveBeenCalledWith({ id: 2, name: "B" });
        });

        it("No matches should not trigger onRemove", () => {
            const array: TestObject[] = [
                { id: 1, name: "A" },
                { id: 2, name: "B" },
                { id: 3, name: "C" },
            ];

            const onRemove = vi.fn();
            removeFirst(array, (item) => item.id === 0, onRemove);
            expect(onRemove).not.toHaveBeenCalled();
        });
    });

    describe("upsertToEnd", () => {
        interface TestObject {
            id: number;
            name: string;
        }

        it("An empty array should only hold the new item", () => {
            const array: TestObject[] = [];
            const newArray: TestObject[] = upsertToEnd(array, { id: 2, name: "New Value" }, () => true);
            expect(newArray).toEqual([{ id: 2, name: "New Value" }]);
        });

        it("The array passed in should not be modified", () => {
            const array: TestObject[] = [
                { id: 1, name: "A" },
                { id: 2, name: "B" },
                { id: 3, name: "C" },
            ];

            upsertToEnd(array, { id: 2, name: "New Value" }, (item) => item.id === 2);

            expect(array).toEqual([
                { id: 1, name: "A" },
                { id: 2, name: "B" },
                { id: 3, name: "C" },
            ]);
        });

        it("First match should be replaced", () => {
            const array: TestObject[] = [
                { id: 1, name: "A" },
                { id: 2, name: "B" },
                { id: 3, name: "C" },
            ];

            const newArray: TestObject[] = upsertToEnd(array, { id: 2, name: "New Value" }, (item) => item.id === 2);

            expect(newArray).toEqual([
                { id: 1, name: "A" },
                { id: 2, name: "New Value" },
                { id: 3, name: "C" },
            ]);
        });

        it("Subsequent matches should not be replaced", () => {
            const array: TestObject[] = [
                { id: 1, name: "A" },
                { id: 2, name: "A" },
                { id: 3, name: "A" },
            ];

            const newArray: TestObject[] = upsertToEnd(array, { id: 1, name: "New Value" }, (item) => item.name === "A");

            expect(newArray).toEqual([
                { id: 1, name: "New Value" },
                { id: 2, name: "A" },
                { id: 3, name: "A" },
            ]);
        });

        it("No matches should add the item to the end", () => {
            const array: TestObject[] = [
                { id: 1, name: "A" },
                { id: 2, name: "B" },
                { id: 3, name: "C" },
            ];

            const newArray: TestObject[] = upsertToEnd(array, { id: 4, name: "New Value" }, (item) => item.id === 4);

            expect(newArray).toEqual([
                { id: 1, name: "A" },
                { id: 2, name: "B" },
                { id: 3, name: "C" },
                { id: 4, name: "New Value" },
            ]);
        });
    });

    describe("upsertToStart", () => {
        interface TestObject {
            id: number;
            name: string;
        }

        it("An empty array should only hold the new item", () => {
            const array: TestObject[] = [];
            const newArray: TestObject[] = upsertToStart(array, { id: 2, name: "New Value" }, () => true);
            expect(newArray).toEqual([{ id: 2, name: "New Value" }]);
        });

        it("The array passed in should not be modified", () => {
            const array: TestObject[] = [
                { id: 1, name: "A" },
                { id: 2, name: "B" },
                { id: 3, name: "C" },
            ];

            upsertToStart(array, { id: 2, name: "New Value" }, (item) => item.id === 2);

            expect(array).toEqual([
                { id: 1, name: "A" },
                { id: 2, name: "B" },
                { id: 3, name: "C" },
            ]);
        });

        it("First match should be replaced", () => {
            const array: TestObject[] = [
                { id: 1, name: "A" },
                { id: 2, name: "B" },
                { id: 3, name: "C" },
            ];

            const newArray: TestObject[] = upsertToStart(array, { id: 2, name: "New Value" }, (item) => item.id === 2);

            expect(newArray).toEqual([
                { id: 1, name: "A" },
                { id: 2, name: "New Value" },
                { id: 3, name: "C" },
            ]);
        });

        it("Subsequent matches should not be replaced", () => {
            const array: TestObject[] = [
                { id: 1, name: "A" },
                { id: 2, name: "A" },
                { id: 3, name: "A" },
            ];

            const newArray: TestObject[] = upsertToStart(array, { id: 1, name: "New Value" }, (item) => item.name === "A");

            expect(newArray).toEqual([
                { id: 1, name: "New Value" },
                { id: 2, name: "A" },
                { id: 3, name: "A" },
            ]);
        });

        it("No matches should add the item to the beginning", () => {
            const array: TestObject[] = [
                { id: 1, name: "A" },
                { id: 2, name: "B" },
                { id: 3, name: "C" },
            ];

            const newArray: TestObject[] = upsertToStart(array, { id: 0, name: "New Value" }, (item) => item.id === 0);

            expect(newArray).toEqual([
                { id: 0, name: "New Value" },
                { id: 1, name: "A" },
                { id: 2, name: "B" },
                { id: 3, name: "C" },
            ]);
        });
    });
});

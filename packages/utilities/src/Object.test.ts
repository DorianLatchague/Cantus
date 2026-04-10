import { describe, expect, it } from "vitest";
import type { DeepPartial } from "./Object";
import { patch } from "./Object";

describe("Utils/Object", () => {
    describe("patch", () => {
        it("should clone and patch a simple object", () => {
            interface TestObject {
                name: string;
                age: number;
                data: {
                    flag: boolean;
                };
            }

            const original: TestObject = {
                name: "John",
                age: 25,
                data: {
                    flag: true,
                },
            };

            const update: DeepPartial<TestObject> = {
                age: 26,
                data: {
                    flag: false,
                },
            };

            const result = patch(original, update);

            expect(result).toEqual({
                name: "John",
                age: 26,
                data: {
                    flag: false,
                },
            });
        });

        it("should clone and patch a simple object when the update provided is a function", () => {
            interface TestObject {
                name: string;
                age: number;
                data: {
                    flag: boolean;
                };
            }

            const original: TestObject = {
                name: "John",
                age: 25,
                data: {
                    flag: true,
                },
            };

            const update: (originalObject: TestObject) => DeepPartial<TestObject> = (originalObject: TestObject) => ({
                age: originalObject.age + 1,
                data: {
                    flag: !originalObject.data.flag,
                },
            });

            const result = patch(original, update);

            expect(result).toEqual({
                name: "John",
                age: 26,
                data: {
                    flag: false,
                },
            });

            const result2 = patch(result, update);

            expect(result2).toEqual({
                name: "John",
                age: 27,
                data: {
                    flag: true,
                },
            });
        });

        it("original object should not be modified", () => {
            interface TestObject {
                name: string;
                age: number;
                data: {
                    items: string[];
                    flag: boolean;
                };
            }

            const original: TestObject = {
                name: "John",
                age: 25,
                data: {
                    items: ["a", "b"],
                    flag: true,
                },
            };

            const update: DeepPartial<TestObject> = {
                data: {
                    items: ["c"],
                },
            };

            patch(original, update);

            expect(original).toEqual({
                name: "John",
                age: 25,
                data: {
                    items: ["a", "b"],
                    flag: true,
                },
            });
        });

        it("when arrays are present but not updated, their reference should remain the same", () => {
            interface TestObject {
                name: string;
                age: number;
                data: {
                    items: string[];
                    flag: boolean;
                };
            }

            const original: TestObject = {
                name: "John",
                age: 25,
                data: {
                    items: ["a", "b"],
                    flag: true,
                },
            };

            const update: DeepPartial<TestObject> = {
                data: {
                    flag: false,
                },
            };

            const result = patch(original, update);

            expect(result.data.items).toBe(original.data.items);
        });

        it("should handle arrays", () => {
            interface TestObject {
                name: string;
                age: number;
                data: {
                    items: string[];
                    flag: boolean;
                };
            }

            const original: TestObject = {
                name: "John",
                age: 25,
                data: {
                    items: ["a", "b"],
                    flag: true,
                },
            };

            const update: DeepPartial<TestObject> = {
                data: {
                    items: ["c"],
                },
            };

            const result = patch(original, update);

            expect(result).toEqual({
                name: "John",
                age: 25,
                data: {
                    items: ["c"],
                    flag: true,
                },
            });
        });

        it("should handle typed arrays", () => {
            interface TestObject {
                name: string;
                age: number;
                data: {
                    items: string[];
                    typedArray: Int32Array;
                };
            }

            const original: TestObject = {
                name: "John",
                age: 25,
                data: {
                    items: ["a", "b"],
                    typedArray: new Int32Array([0, 1, 2, 3]),
                },
            };

            const update: DeepPartial<TestObject> = {
                data: {
                    typedArray: new Int32Array([1, 2, 3]),
                },
            };

            const result = patch(original, update);

            expect(result).toEqual({
                name: "John",
                age: 25,
                data: {
                    items: ["a", "b"],
                    typedArray: new Int32Array([1, 2, 3]),
                },
            });
        });

        it("undefined updates should be skipped", () => {
            interface TestObject {
                name: string;
                age: number;
                data: {
                    items: string[];
                    flag: boolean;
                };
            }

            const original: TestObject = {
                name: "John",
                age: 25,
                data: {
                    items: ["a", "b"],
                    flag: true,
                },
            };

            const update: DeepPartial<TestObject> = {
                name: undefined,
            };

            const result = patch(original, update);

            expect(result).toEqual({
                name: "John",
                age: 25,
                data: {
                    items: ["a", "b"],
                    flag: true,
                },
            });
        });

        it("should handle Error objects", () => {
            interface TestObject {
                name: string;
                age: number;
                data: {
                    items: string[];
                    error: Error;
                };
            }

            const original: TestObject = {
                name: "John",
                age: 25,
                data: {
                    items: ["a", "b"],
                    error: new Error("Original Error"),
                },
            };

            const update: DeepPartial<TestObject> = {
                data: {
                    error: new Error("Updated Error"),
                },
            };

            const result = patch(original, update);

            expect(result).toEqual({
                name: "John",
                age: 25,
                data: {
                    items: ["a", "b"],
                    error: new Error("Updated Error"),
                },
            });
        });

        it("should handle Date objects", () => {
            interface TestObject {
                name: string;
                age: number;
                data: {
                    items: string[];
                    date: Date;
                };
            }

            const original: TestObject = {
                name: "John",
                age: 25,
                data: {
                    items: ["a", "b"],
                    date: new Date("2022-01-01"),
                },
            };

            const updatedDate = new Date("2023-01-01");
            const update: DeepPartial<TestObject> = {
                data: {
                    date: updatedDate,
                },
            };

            const result = patch(original, update);

            expect(result).toEqual({
                name: "John",
                age: 25,
                data: {
                    items: ["a", "b"],
                    date: new Date("2023-01-01"),
                },
            });
        });
    });
});

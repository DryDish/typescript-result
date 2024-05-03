import { Some, None, Option } from "../../src/option/option";
import { Ok, Err } from "../../src/result/result";

describe("Option method tests", () => {
	describe("Option.isSome()", () => {
		const someOption: Option<number> = Some(2);

		test("Some(2).isSome() should return true", () => {
			expect(someOption.isSome()).toBe(true);
		});
		test("Some(2).isNone() should return false", () => {
			expect(someOption.isNone()).toBe(false);
		});
	});

	describe("Option.isSomeAnd()", () => {
		const someOption: Option<number> = Some(2);

		test("Some(2).isSomeAnd((x) => x === 2) should return true", () => {
			expect(someOption.isSomeAnd((x) => x === 2)).toBe(true);
		});
		test("Some(2).isSomeAnd((x) => x > 2) should return false", () => {
			expect(someOption.isSomeAnd((x) => x > 2)).toBe(false);
		});
		test("Some(2).isSomeAnd((x) => x < 2) should return false", () => {
			expect(someOption.isSomeAnd((x) => x < 2)).toBe(false);
		});
	});

	describe("Option.isNone()", () => {
		const noneOption: Option<number> = None<number>();

		test("None().isSome() should return false", () => {
			expect(noneOption.isSome()).toBe(false);
		});
		test("None().isNone() should return true", () => {
			expect(noneOption.isNone()).toBe(true);
		});
	});

	describe("Option.expect()", () => {
		test('Some(2).expect("error") should return 2', () => {
			expect(Some(2).expect("error")).toBe(2);
		});
		test('None().expect("error") should throw an error', () => {
			expect(() => None().expect("error")).toThrowError("error");
		});
	});

	describe("Option.unwrap()", () => {
		test("Some(2).unwrap() should return 2", () => {
			expect(Some(2).unwrap()).toBe(2);
		});
		test("None().unwrap() should throw an error", () => {
			expect(() => None().unwrap()).toThrowError("Called Option.unwrap() on a 'None' value");
		});
	});

	describe("Option.unwrapOr()", () => {
		test("Some(2).unwrapOr(3) should return 2", () => {
			expect(Some(2).unwrapOr(3)).toBe(2);
		});
		test("None().unwrapOr(3) should return 3", () => {
			expect(None().unwrapOr(3)).toBe(3);
		});
	});

	describe("Option.unwrapOrElse()", () => {
		const DEFAULT = 3;

		test("Some(2).unwrapOrElse(() => DEFAULT * 2) should return 2", () => {
			expect(Some(2).unwrapOrElse(() => DEFAULT * 2)).toBe(2);
		});
		test("None().unwrapOrElse(() => DEFAULT * 2) should return 6", () => {
			expect(None().unwrapOrElse(() => DEFAULT * 2)).toBe(6);
		});
	});

	describe("Option.map()", () => {
		test("Some(2).map((x) => x * 2) should return Some(4)", () => {
			const option: Option<number> = Some("Hello, World!").map((x) => x.length);

			expect(option).toEqual(Some(13));
		});
		test("None().map((x) => x * 2) should return None()", () => {
			const option: Option<string> = None<number>()
				.map((x) => x * 2)
				.map((x) => x.toString());

			expect(option).toEqual(None());
		});
	});

	describe("Option.inspect()", () => {
		test("Some(2).inspect((x) => scopedNumber = x) should return Some(2) and set the scoped variable", () => {
			let scopedNumber = 1;
			const option: Option<number> = Some(2).inspect((x) => {
				scopedNumber = x;
			});

			expect(option).toEqual(Some(2));
			expect(scopedNumber).toBe(2);
		});

		test("None().inspect((x) => scopedNumber = x) should return None() and not alter the scoped variable", () => {
			let scopedNumber = 1;
			const option: Option<number> = None<number>().inspect((x) => {
				scopedNumber = x;
			});

			expect(option).toEqual(None());
			expect(scopedNumber).toBe(1);
		});
	});

	const three = (): number => 3;

	describe("Option.mapOr()", () => {
		test("Some(2).mapOr(3, (x) => x * 2) should return 4", () => {
			expect(Some(2).mapOr(3, (x) => x * 2)).toBe(4);
		});
		test("None().mapOr(3, (x) => x * 2) should return 3", () => {
			expect(None<number>().mapOr(3, (x) => x * 2)).toBe(3);
		});
	});

	describe("Option.mapOrElse()", () => {
		test("Some(2).mapOrElse(() => 3, (x) => x * 2) should return 4", () => {
			expect(Some(2).mapOrElse(three, (x) => x * 2)).toBe(4);
		});
		test("None().mapOrElse(() => 3, (x) => x * 2) should return 3", () => {
			expect(None<number>().mapOrElse(three, (x) => x * 2)).toBe(3);
		});
	});

	describe("Option.okOr()", () => {
		test("Some(2).okOr(-1) should return Some(2)", () => {
			expect(Some(2).okOr(-1)).toEqual(Ok(2));
		});

		test("None().okOr(-1) should return Some(-1)", () => {
			expect(None<number>().okOr(-1)).toEqual(Err(-1));
		});
		test("None().okOr({ error: 400, message: 'Bad Request' }) should return Err", () => {
			const result = None<number>().okOr("No number found in DB!");
			expect(result).toEqual(Err("No number found in DB!"));
		});
	});
});

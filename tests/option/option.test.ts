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


	describe("Option.mapOr()", () => {
		test("Some(2).mapOr(3, (x) => x * 2) should return 4", () => {
			expect(Some(2).mapOr(3, (x) => x * 2)).toBe(4);
		});
		test("None().mapOr(3, (x) => x * 2) should return 3", () => {
			expect(None<number>().mapOr(3, (x) => x * 2)).toBe(3);
		});
	});

	describe("Option.mapOrElse()", () => {
		const three = (): number => 3;

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
		test("None().okOr(-1) should return Err(-1)", () => {
			expect(None<number>().okOr(-1)).toEqual(Err(-1));
		});
		test("None().okOr('No number found!') should return Err('No number found!')", () => {
			const result = None<number>().okOr("No number found!");
			expect(result).toEqual(Err("No number found!"));
		});
	});

	describe("Option.okOrElse()", () => {
		test("Some(2).okOrElse(() => -1) should return Some(2)", () => {
			expect(Some(2).okOrElse(() => -1)).toEqual(Ok(2));
		});
		test("None().okOrElse(() => -1) should return Err(-1)", () => {
			expect(None<number>().okOrElse(() => -1)).toEqual(Err(-1));
		});
		test("None().okOrElse(() => 'No number found!') should return Err('No number found!')", () => {
			const result = None<number>().okOrElse(() => "No number found!");
			expect(result).toEqual(Err("No number found!"));
		});
	});

	describe("Option.and()", () => {
		test("Some(2).and(Some(3)) should return Some(3)", () => {
			expect(Some(2).and(Some(3))).toEqual(Some(3));
		});
		test("Some(2).and(None()) should return None()", () => {
			expect(Some(2).and(None())).toEqual(None());
		});
		test("None().and(Some(3)) should return None()", () => {
			expect(None<number>().and(Some(3))).toEqual(None());
		});
		test("None().and(None()) should return None()", () => {
			expect(None<number>().and(None())).toEqual(None());
		});
	});

	describe("Option.andThen()", () => {
		test("Some(2).andThen((x) => Some(x * 2)) should return Some(4)", () => {
			expect(Some(2).andThen((x) => Some(x * 2))).toEqual(Some(4));
		});
		test("Some(2).andThen((x) => None()) should return None()", () => {
			expect(Some(2).andThen((_) => None())).toEqual(None());
		});
		test("None().andThen((x) => Some(x * 2)) should return None()", () => {
			expect(None<number>().andThen((x) => Some(x * 2))).toEqual(None());
		});
		test("None().andThen((x) => None()) should return None()", () => {
			expect(None<number>().andThen((_) => None())).toEqual(None());
		});
	});

	describe("Option.filter()", () => {
		test("Some(2).filter((x) => x > 1) should return Some(2)", () => {
			expect(Some(2).filter((x) => x > 1)).toEqual(Some(2));
		});
		test("Some(1).filter((x) => x > 1) should return None()", () => {
			expect(Some(1).filter((x) => x > 1)).toEqual(None());
		});
		test("None().filter((x) => x > 1) should return None()", () => {
			expect(None<number>().filter((x) => x > 1)).toEqual(None());
		});
	});

	describe("Option.or()", () => {
		test("Some(2).or(Some(3)) should return Some(2)", () => {
			expect(Some(2).or(Some(3))).toEqual(Some(2));
		});
		test("Some(2).or(None()) should return Some(2)", () => {
			expect(Some(2).or(None())).toEqual(Some(2));
		});
		test("None().or(Some(3)) should return Some(3)", () => {
			expect(None<number>().or(Some(3))).toEqual(Some(3));
		});
		test("None().or(None()) should return None()", () => {
			expect(None<number>().or(None())).toEqual(None());
		});
	});

	describe("Option.orElse()", () => {
		test("Some(2).orElse(() => Some(3)) should return Some(2)", () => {
			expect(Some(2).orElse(() => Some(3))).toEqual(Some(2));
		});
		test("Some(2).orElse(() => None()) should return Some(2)", () => {
			expect(Some(2).orElse(() => None())).toEqual(Some(2));
		});
		test("None().orElse(() => Some(3)) should return Some(3)", () => {
			expect(None<number>().orElse(() => Some(3))).toEqual(Some(3));
		});
		test("None().orElse(() => None()) should return None()", () => {
			expect(None<number>().orElse(() => None())).toEqual(None());
		});
	});

	describe("Option.insert()", () => {
		test("Some(2).insert(5) should return 5", () => {
			const option = Some(1);
			const value = option.insert(5);

			expect(value).toEqual(5);
			expect(option).toEqual(Some(5));
		});
		test("None().insert(3) should return 3", () => {
			const option = None<number>();

			expect(option.isSome()).toBe(false);

			const value = option.insert(3);

			expect(value).toEqual(3);
			expect(option).toEqual(Some(3));
			expect(option.isSome()).toBe(true);
		});
	});

	describe("Option.getOrInsert()", () => {
		test("Some(2).getOrInsert(5) should return 2", () => {
			const option = Some(2);
			const value = option.getOrInsert(5);

			expect(value).toEqual(2);
			expect(option).toEqual(Some(2));
		});
		test("None().getOrInsert(3) should return 3", () => {
			const option = None<number>();

			expect(option.isSome()).toBe(false);

			const value = option.getOrInsert(3);

			expect(value).toEqual(3);
			expect(option).toEqual(Some(3));
			expect(option.isSome()).toBe(true);
		});
	});

	describe("Option.getOrInsertWith()", () => {
		test("Some(2).getOrInsertWith(() => 3) should return 2", () => {
			const option = Some(2);
			const value = option.getOrInsertWith(() => 2);

			expect(value).toEqual(2);
			expect(option).toEqual(Some(2));
		});
		test("None().getOrInsertWith(() => 3) should return 3", () => {
			const option = None<number>();

			expect(option.isSome()).toBe(false);

			const value = option.getOrInsertWith(() => 3);

			expect(value).toEqual(3);
			expect(option).toEqual(Some(3));
			expect(option.isSome()).toBe(true);
		});
	});

	describe("Option.take()", () => {
		test("Some(2).take() should return Some(2)", () => {
			const option = Some(2);
			const takenOption = option.take();

			expect(option.isSome()).toBe(false);
			expect(takenOption.isSome()).toBe(true);

			expect(option).toEqual(None());
			expect(takenOption).toEqual(Some(2));
		});
		test("None().take() should return None()", () => {
			const option = None<number>();
			const takenOption = option.take();

			expect(option.isSome()).toBe(false);
			expect(takenOption.isSome()).toBe(false);

			expect(option).toEqual(None());
			expect(takenOption).toEqual(None());
		});
	});

	describe("Option.takeIf()", () => {
		test("Some(2).takeIf((x) => x > 1) should return Some(2)", () => {
			const option = Some(2);
			const takenOption = option.takeIf((x) => x > 1);

			expect(option.isSome()).toBe(false);
			expect(takenOption.isSome()).toBe(true);

			expect(option).toEqual(None());
			expect(takenOption).toEqual(Some(2));
		});
		test("Some(2).takeIf((x) => x < 1) should return None()", () => {
			const option = Some(2);
			const takenOption = option.takeIf((x) => x < 1);

			expect(option.isSome()).toBe(true);
			expect(takenOption.isSome()).toBe(false);

			expect(option).toEqual(Some(2));
			expect(takenOption).toEqual(None());
		});
		test("None().takeIf((x) => x > 1) should return None()", () => {
			const option = None<number>();
			const takenOption = option.takeIf((x) => x > 1);

			expect(option.isSome()).toBe(false);
			expect(takenOption.isSome()).toBe(false);

			expect(option).toEqual(None());
			expect(takenOption).toEqual(None());
		});
	});

	describe("Option.replace()", () => {
		test("Some(2).replace(5) should return Some(2)", () => {
			const option = Some(2);
			const oldOption = option.replace(5);

			expect(option.isSome()).toBe(true);
			expect(oldOption.isSome()).toBe(true);

			expect(option).toEqual(Some(5));
			expect(oldOption).toEqual(Some(2));
		});
		test("None().replace(5) should return None()", () => {
			const option = None<number>();
			const oldOption = option.replace(5);

			expect(option.isSome()).toBe(true);
			expect(oldOption.isSome()).toBe(false);

			expect(option).toEqual(Some(5));
			expect(oldOption).toEqual(None());
		});
	});
});

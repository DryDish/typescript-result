import { Err, Ok, type Result } from "result/result";

enum OptionType {
	Some,
	None,
}

class UnwrapError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "UnwrapError";
	}
}

class ExpectError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ExpectError";
	}
}

class Option<T> {
	#type: OptionType;
	private _value: T;

	constructor(value: T, type: OptionType) {
		this.#type = type;
		this._value = value;
	}

	isSome(): boolean {
		return this.#type === OptionType.Some;
	}

	isSomeAnd(predicate: (value: T) => boolean): boolean {
		if (this.isSome()) {
			return predicate(this._value);
		} else {
			return false;
		}
	}

	isNone(): boolean {
		return this.#type === OptionType.None;
	}

	expect(message: string): T {
		if (this.isSome()) {
			return this._value;
		} else {
			throw new ExpectError(message);
		}
	}

	unwrap(): T {
		if (this.isSome()) {
			return this._value;
		} else {
			throw new UnwrapError("Called Option.unwrap() on a 'None' value");
		}
	}

	unwrapOr(defaultValue: T): T {
		if (this.isSome()) {
			return this._value;
		} else {
			return defaultValue;
		}
	}

	unwrapOrElse(func: () => T): T {
		if (this.isSome()) {
			return this._value;
		} else {
			return func();
		}
	}

	map<U>(executor: (value: T) => U): Option<U> {
		if (this.isSome()) {
			return Some(executor(this._value));
		} else {
			return None();
		}
	}

	inspect(inspectFn: (value: T) => void): Option<T> {
		if (this.isSome()) {
			// Cloning the value to prevent mutation of the original in inspectFn
			const clonedValue = structuredClone(this._value);
			inspectFn(structuredClone(clonedValue));
		}
		return this;
	}

	mapOr<U>(defaultValue: U, mapper: (value: T) => U): U {
		if (this.isSome()) {
			return mapper(this._value);
		} else {
			return defaultValue;
		}
	}

	mapOrElse<U>(defaultFn: () => U, mapper: (value: T) => U): U {
		if (this.isSome()) {
			return mapper(this._value);
		} else {
			return defaultFn();
		}
	}

	okOr<E>(err: E): Result<T, E> {
		if (this.isSome()) {
			return Ok(this._value);
		} else {
			return Err(err);
		}
	}

	okOrElse<E>(errFn: () => E): Result<T, E> {
		if (this.isSome()) {
			return Ok(this._value);
		} else {
			return Err(errFn());
		}
	}

	and<U>(otherOption: Option<U>): Option<U> {
		if (this.isSome() && otherOption.isSome()) {
			return otherOption;
		} else {
			return None();
		}
	}

	andThen<U>(func: (value: T) => Option<U>): Option<U> {
		if (this.isSome()) {
			return func(this._value);
		} else {
			return None();
		}
	}

	filter(predicate: (value: T) => boolean): Option<T> {
		if (this.isSome() && predicate(this._value)) {
			return this;
		} else {
			return None();
		}
	}

	or(otherOption: Option<T>): Option<T> {
		if (this.isSome()) {
			return this;
		} else {
			return otherOption;
		}
	}

	orElse(altFunction: () => Option<T>): Option<T> {
		if (this.isSome()) {
			return this;
		} else {
			return altFunction();
		}
	}

	insert(value: T): Option<T> {
		this._value = value;
		return this;
	}

	getOrInsert(altValue: T): T {
		if (this.isSome()) {
			return this._value;
		} else {
			this._value = altValue;
			this.#type = OptionType.Some;
			return this._value;
		}
	}

	getOrInsertWith(altFunction: () => T): T {
		if (this.isSome()) {
			return this._value;
		} else {
			this._value = altFunction();
			this.#type = OptionType.Some;
			return this._value;
		}
	}

	take(): Option<T> {
		if (this.isSome()) {
			const oldValue = structuredClone(this._value);
			this._value = undefined as T;
			this.#type = OptionType.None;
			return Some(oldValue);
		} else {
			return None();
		}
	}

	takeIf(predicate: (value: T) => boolean): Option<T> {
		if (this.isSome() && predicate(this._value)) {
			return this.take();
		} else {
			return None();
		}
	}

	replace(value: T): Option<T> {
		if (this.isSome()) {
			const oldOption = structuredClone(this);
			this._value = value;
			return oldOption;
		} else {
			this._value = value;
			this.#type = OptionType.Some;
			return None();
		}
	}

	zip<U>(other: Option<U>): Option<[T, U]> {
		if (this.isSome() && other.isSome()) {
			return Some([this._value, other._value]);
		} else {
			return None();
		}
	}

	zipWith<U, V>(other: Option<U>, zipFunction: (a: T, b: U) => V): Option<V> {
		if (this.isSome() && other.isSome()) {
			return Some(zipFunction(this._value, other._value));
		} else {
			return None();
		}
	}

	// TODO: figure out types
	unzip() {
		if (this.isSome() && Array.isArray(this._value) && this._value.length === 2) {
			return [Some(this._value[0]), this._value[1]];
		} else {
			return [None(), None()];
		}
	}
}

const Some = <T>(value: T): Option<T> => {
	return new Option(value, OptionType.Some);
};

const None = <T>(): Option<T> => {
	return new Option(undefined as T, OptionType.None);
};

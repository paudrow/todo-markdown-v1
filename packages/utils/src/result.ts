export type Result<T, E extends Error> =
  | {
      ok: true;
      value: T;
    }
  | {
      ok: false;
      error: E;
    };

export function isOk<T, E extends Error>(
  result: Result<T, E>,
): result is { ok: true; value: T } {
  return result.ok;
}

export function isError<T, E extends Error>(
  result: Result<T, E>,
): result is { ok: false; error: E } {
  return !result.ok;
}

export function Ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function Err<E extends Error | string>(error: E): Result<never, Error> {
  return {
    ok: false,
    error: typeof error === "string" ? new Error(error) : error,
  };
}

export function unwrap<T, E extends Error>(result: Result<T, E>): T {
  if (isOk(result)) {
    return result.value;
  }
  throw result.error;
}

export function unwrapError<T, E extends Error>(result: Result<T, E>): E {
  if (isError(result)) {
    return result.error;
  }
  throw new TypeError("Result is ok. Cannot unwrap error.");
}

export function unwrapOr<T, E extends Error>(
  result: Result<T, E>,
  defaultValue: T,
): T {
  if (isOk(result)) {
    return result.value;
  }
  return defaultValue;
}

import { suite, test } from "mocha";
import assert from "assert";
import {
  Ok,
  Err,
  isOk,
  isError,
  unwrap,
  unwrapError,
  unwrapOr,
} from "./result";

suite("Result", () => {
  test("Ok creates a success result", () => {
    const result = Ok(42);
    assert.strictEqual(isOk(result), true);
    assert.strictEqual(isError(result), false);
  });

  test("Error creates an error result", () => {
    const result = Err(new Error("failed"));
    assert.strictEqual(isOk(result), false);
    assert.strictEqual(isError(result), true);
  });

  test("unwrap returns the value for Ok", () => {
    const result = Ok(42);
    assert.strictEqual(unwrap(result), 42);
  });

  test("unwrap throws for Error", () => {
    const result = Err(new Error("failed"));
    assert.throws(() => unwrap(result), /failed/);
  });

  test("unwrapError returns the error for Error", () => {
    const result = Err(new Error("failed"));
    const error = unwrapError(result);
    assert.strictEqual(error.message, "failed");
  });

  test("unwrapError throws for Ok", () => {
    const result = Ok(42);
    assert.throws(() => unwrapError(result));
  });

  test("unwrapOr returns the value for Ok", () => {
    const result = Ok(42);
    assert.strictEqual(unwrapOr(result, 0), 42);
  });

  test("unwrapOr returns the default for Error", () => {
    const result = Err(new Error("failed"));
    assert.strictEqual(unwrapOr(result, 0), 0);
  });

  test("Ok can contain different types", () => {
    const numberResult = Ok(42);
    const stringResult = Ok("hello");
    const objectResult = Ok({ foo: "bar" });

    assert.strictEqual(unwrap(numberResult), 42);
    assert.strictEqual(unwrap(stringResult), "hello");
    assert.deepStrictEqual(unwrap(objectResult), { foo: "bar" });
  });
});

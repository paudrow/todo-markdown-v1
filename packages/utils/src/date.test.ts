import { suite, test } from "mocha";
import assert from "assert";
import { toPlainDate, isPast, isFuture, isToday } from "./date";
import { Temporal } from "@js-temporal/polyfill";
import { isOk, isError } from "./result";

suite("date utils", () => {
  suite("toPlainDate", () => {
    test("returns Ok with PlainDate", () => {
      const result = toPlainDate("2024-03-15");
      if (isOk(result)) {
        assert.strictEqual(result.value.year, 2024);
        assert.strictEqual(result.value.month, 3);
        assert.strictEqual(result.value.day, 15);
      } else {
        assert.fail("expected Ok");
      }
    });

    test("returns Err with invalid date string", () => {
      const result = toPlainDate("invalid-date");
      assert(isError(result));
    });
  });

  suite("isPast", () => {
    test("returns true for past dates", () => {
      const pastDate = Temporal.PlainDate.from("2020-01-01");
      assert.strictEqual(isPast(pastDate), true);
    });

    test("returns false for future dates", () => {
      const futureDate = Temporal.Now.plainDateISO().add({ days: 1 });
      assert.strictEqual(isPast(futureDate), false);
    });

    test("returns false for today", () => {
      const today = Temporal.Now.plainDateISO();
      assert.strictEqual(isPast(today), false);
    });
  });

  suite("isFuture", () => {
    test("returns true for future dates", () => {
      const futureDate = Temporal.Now.plainDateISO().add({ days: 1 });
      assert.strictEqual(isFuture(futureDate), true);
    });

    test("returns false for past dates", () => {
      const pastDate = Temporal.PlainDate.from("2020-01-01");
      assert.strictEqual(isFuture(pastDate), false);
    });

    test("returns false for today", () => {
      const today = Temporal.Now.plainDateISO();
      assert.strictEqual(isFuture(today), false);
    });
  });

  suite("isToday", () => {
    test("returns true for today", () => {
      const today = Temporal.Now.plainDateISO();
      assert.strictEqual(isToday(today), true);
    });

    test("returns false for past dates", () => {
      const pastDate = Temporal.PlainDate.from("2020-01-01");
      assert.strictEqual(isToday(pastDate), false);
    });

    test("returns false for future dates", () => {
      const futureDate = Temporal.Now.plainDateISO().add({ days: 1 });
      assert.strictEqual(isToday(futureDate), false);
    });
  });
});

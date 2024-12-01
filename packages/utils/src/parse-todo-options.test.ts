import { suite, test } from "mocha";
import assert from "assert";
import { parseTodoOptions } from "./parse-todo-options";
import { isOk, isError, unwrap } from "./result";
import { Temporal } from "@js-temporal/polyfill";

suite("parseTodoOptions", () => {
  suite("check single due date", () => {
    test("no time", () => {
      const dateString = "2024-01-01";
      const result = parseTodoOptions(["due:2024-01-01"]);

      assert(isOk(result));
      const options = unwrap(result);
      assert.deepEqual(
        options.dueDate?.next,
        Temporal.PlainDate.from(dateString),
      );
    });

    test("check bad date errors", () => {
      for (const dateString of ["invalid", "2024-99-01"]) {
        const result = parseTodoOptions(["due:" + dateString]);
        assert(isError(result), `expected error for date string ${dateString}`);
      }
    });
  });

  suite("check daily repeat", () => {
    test("check valid", () => {
      const dateString = "2024-01-01";
      const result = parseTodoOptions(["next:" + dateString, "repeat:daily"]);
      assert(isOk(result));
      const options = unwrap(result);
      assert.deepEqual(options.dueDate?.repeat, "daily");
      assert.deepEqual(
        options.dueDate?.next,
        Temporal.PlainDate.from(dateString),
      );
    });

    test("every 2 days", () => {
      const dateString = "2024-01-01";
      const result = parseTodoOptions([
        "next:" + dateString,
        "repeat:daily",
        "every:2",
      ]);
      assert(isOk(result));
      const options = unwrap(result);
      assert.deepEqual(options.dueDate?.repeat, "daily");
      assert.deepEqual(
        options.dueDate?.next,
        Temporal.PlainDate.from(dateString),
      );
      assert.deepEqual(options.dueDate?.every, 2);
    });
  });

  suite("check weekly repeat", () => {
    test("check valid", () => {
      const dateString = "2024-01-01";
      const result = parseTodoOptions(["next:" + dateString, "repeat:weekly"]);
      assert(isOk(result));
      const options = unwrap(result);
      assert.deepEqual(options.dueDate?.repeat, "weekly");
      assert.deepEqual(
        options.dueDate?.next,
        Temporal.PlainDate.from(dateString),
      );
    });

    test("every 2 weeks", () => {
      const dateString = "2024-01-01";
      const result = parseTodoOptions([
        "next:" + dateString,
        "repeat:weekly",
        "every:2",
      ]);
      assert(isOk(result));
      const options = unwrap(result);
      assert.deepEqual(options.dueDate?.repeat, "weekly");
      assert.deepEqual(
        options.dueDate?.next,
        Temporal.PlainDate.from(dateString),
      );
      assert.deepEqual(options.dueDate?.every, 2);
    });

    test("on day of week", () => {
      const dateString = "2024-01-01";
      const result = parseTodoOptions([
        "next:" + dateString,
        "repeat:weekly",
        "dayOfWeek:1",
      ]);
      assert(isOk(result));
      const options = unwrap(result);
      assert.deepEqual(options.dueDate?.repeat, "weekly");
      assert.deepEqual(
        options.dueDate?.next,
        Temporal.PlainDate.from(dateString),
      );
      assert.deepEqual(options.dueDate?.dayOfWeek, 1);
    });
  });

  suite("check monthly repeat", () => {
    test("check valid", () => {
      const dateString = "2024-01-01";
      const result = parseTodoOptions(["next:" + dateString, "repeat:monthly"]);
      assert(isOk(result));
      const options = unwrap(result);
      assert.deepEqual(options.dueDate?.repeat, "monthly");
      assert.deepEqual(
        options.dueDate?.next,
        Temporal.PlainDate.from(dateString),
      );
    });

    test("on day of month", () => {
      const dateString = "2024-01-01";
      const result = parseTodoOptions([
        "next:" + dateString,
        "repeat:monthly",
        "dayOfMonth:15",
      ]);
      assert(isOk(result));
      const options = unwrap(result);
      assert.deepEqual(options.dueDate?.repeat, "monthly");
      assert.deepEqual(
        options.dueDate?.next,
        Temporal.PlainDate.from(dateString),
      );
      assert.deepEqual(options.dueDate?.dayOfMonth, 15);
    });

    test("on week of month", () => {
      const dateString = "2024-01-01";
      const result = parseTodoOptions([
        "next:" + dateString,
        "repeat:monthly",
        "weekOfMonth:2",
      ]);
      assert(isOk(result));
      const options = unwrap(result);
      assert.deepEqual(options.dueDate?.repeat, "monthly");
      assert.deepEqual(
        options.dueDate?.next,
        Temporal.PlainDate.from(dateString),
      );
    });
  });

  suite("check yearly repeat", () => {
    test("check valid", () => {
      const dateString = "2024-01-01";
      const result = parseTodoOptions(["next:" + dateString, "repeat:yearly"]);
      assert(isOk(result));
      const options = unwrap(result);
      assert.deepEqual(options.dueDate?.repeat, "yearly");
      assert.deepEqual(
        options.dueDate?.next,
        Temporal.PlainDate.from(dateString),
      );
    });

    test("on day of year", () => {
      const dateString = "2024-01-01";
      const result = parseTodoOptions([
        "next:" + dateString,
        "repeat:yearly",
        "dayOfYear:15",
      ]);
      assert(isOk(result));
      const options = unwrap(result);
      assert.deepEqual(options.dueDate?.repeat, "yearly");
      assert.deepEqual(
        options.dueDate?.next,
        Temporal.PlainDate.from(dateString),
      );
      assert.deepEqual(options.dueDate?.dayOfYear, 15);
    });

    test("on week of year", () => {
      const dateString = "2024-01-01";
      const result = parseTodoOptions([
        "next:" + dateString,
        "repeat:yearly",
        "weekOfYear:2",
      ]);
      assert(isOk(result));
      const options = unwrap(result);
      assert.deepEqual(options.dueDate?.repeat, "yearly");
      assert.deepEqual(
        options.dueDate?.next,
        Temporal.PlainDate.from(dateString),
      );
    });

    test("on month of year", () => {
      const dateString = "2024-01-01";
      const result = parseTodoOptions([
        "next:" + dateString,
        "repeat:yearly",
        "monthOfYear:1",
      ]);
      assert(isOk(result));
      const options = unwrap(result);
      assert.deepEqual(options.dueDate?.repeat, "yearly");
      assert.deepEqual(
        options.dueDate?.next,
        Temporal.PlainDate.from(dateString),
      );
    });

    test("invalid weekOfYear", () => {
      const dateString = "2024-01-01";
      const result = parseTodoOptions([
        "next:" + dateString,
        "repeat:yearly",
        "weekOfYear:53", // Invalid - year has at most 52 weeks
      ]);
      assert(isError(result));
    });
  });

  suite("check invalid repeat values", () => {
    test("invalid repeat type", () => {
      const dateString = "2024-01-01";
      const result = parseTodoOptions(["next:" + dateString, "repeat:invalid"]);
      assert(isError(result));
    });

    test("invalid every value", () => {
      const dateString = "2024-01-01";
      const result = parseTodoOptions([
        "next:" + dateString,
        "repeat:daily",
        "every:invalid",
      ]);
      assert(isError(result));
    });
  });

  suite("check invalid day/week/month values", () => {
    test("invalid dayOfWeek", () => {
      const dateString = "2024-01-01";
      const result = parseTodoOptions([
        "next:" + dateString,
        "repeat:weekly",
        "dayOfWeek:8", // Invalid - days are 0-6
      ]);
      assert(isError(result));
    });

    test("invalid dayOfMonth", () => {
      const dateString = "2024-01-01";
      const result = parseTodoOptions([
        "next:" + dateString,
        "repeat:monthly",
        "dayOfMonth:32", // Invalid - no month has 32 days
      ]);
      assert(isError(result));
    });

    test("invalid weekOfMonth", () => {
      const dateString = "2024-01-01";
      const result = parseTodoOptions([
        "next:" + dateString,
        "repeat:monthly",
        "weekOfMonth:6", // Invalid - months have at most 5 weeks
      ]);
      assert(isError(result));
    });
  });

  suite("check incompatible options", () => {
    test("cannot combine daily with dayOfWeek", () => {
      const dateString = "2024-01-01";
      const result = parseTodoOptions([
        "next:" + dateString,
        "repeat:daily",
        "dayOfWeek:1",
      ]);
      assert(isError(result));
    });

    test("cannot combine weekly with dayOfMonth", () => {
      const dateString = "2024-01-01";
      const result = parseTodoOptions([
        "next:" + dateString,
        "repeat:weekly",
        "dayOfMonth:15",
      ]);
      assert(isError(result));
    });

    test("cannot combine monthly with dayOfYear", () => {
      const dateString = "2024-01-01";
      const result = parseTodoOptions([
        "next:" + dateString,
        "repeat:monthly",
        "dayOfYear:100",
      ]);
      assert(isError(result));
    });
  });
});

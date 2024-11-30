import { suite, test } from "mocha";
import assert from "assert";
import { parseTodoOptions } from "./parse-todo-options";
import { isOk, isError, unwrap } from "./result";

suite("parseTodoOptions", () => {
  suite("check single due date", () => {
    test("no time", () => {
      const dateString = "2024-01-01";
      const result = parseTodoOptions(["due:2024-01-01"]);

      assert(isOk(result));
      const options = unwrap(result);
      assert.deepEqual(options.dueDate?.next, new Date(dateString));
    });

    test("with time", () => {
      const dateString = "2024-01-01T12:31:00Z";
      const result = parseTodoOptions(["due:" + dateString]);
      assert(isOk(result));
      const options = unwrap(result);
      assert.deepEqual(options.dueDate?.next, new Date(dateString));
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
      assert.deepEqual(options.dueDate?.next, new Date(dateString));
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
      assert.deepEqual(options.dueDate?.next, new Date(dateString));
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
      assert.deepEqual(options.dueDate?.next, new Date(dateString));
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
      assert.deepEqual(options.dueDate?.next, new Date(dateString));
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
      assert.deepEqual(options.dueDate?.next, new Date(dateString));
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
      assert.deepEqual(options.dueDate?.next, new Date(dateString));
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
      assert.deepEqual(options.dueDate?.next, new Date(dateString));
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
      assert.deepEqual(options.dueDate?.next, new Date(dateString));
    });
  });

  suite("check yearly repeat", () => {
    test("check valid", () => {
      const dateString = "2024-01-01";
      const result = parseTodoOptions(["next:" + dateString, "repeat:yearly"]);
      assert(isOk(result));
      const options = unwrap(result);
      assert.deepEqual(options.dueDate?.repeat, "yearly");
      assert.deepEqual(options.dueDate?.next, new Date(dateString));
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
      assert.deepEqual(options.dueDate?.next, new Date(dateString));
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
      assert.deepEqual(options.dueDate?.next, new Date(dateString));
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
      assert.deepEqual(options.dueDate?.next, new Date(dateString));
    });
  });
});

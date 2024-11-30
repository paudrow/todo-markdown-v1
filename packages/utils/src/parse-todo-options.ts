import {
  DueDateOption,
  TodoOptions,
  DueDateRepeat,
} from "@todo-markdown/types";
import { Err, isOk, Ok, Result } from "./result";

type possibleDueDateKeys =
  | "due"
  | "next"
  | "repeat"
  | "every"
  | "dayOfWeek"
  | "dayOfMonth"
  | "weekOfMonth"
  | "dayOfYear"
  | "weekOfYear"
  | "monthOfYear";

function isKeyMatch(
  keys: string[],
  requiredKeys: string[],
  optionalKeys: string[],
) {
  // Check if all required keys are present
  for (const key of requiredKeys) {
    if (!keys.includes(key)) {
      return false;
    }
  }

  // Check if every key in the input is either required or optional
  for (const key of keys) {
    if (!requiredKeys.includes(key) && !optionalKeys.includes(key)) {
      return false;
    }
  }

  return true;
}

const requiredSingleDueDateKeys: possibleDueDateKeys[] = ["due"];
const optionalSingleDueDateKeys: possibleDueDateKeys[] = [];
type SingleDueDate = {
  due: string;
};
function isSingleDueDateType(
  obj: Record<string, unknown>,
): obj is SingleDueDate {
  return isKeyMatch(
    Object.keys(obj),
    requiredSingleDueDateKeys,
    optionalSingleDueDateKeys,
  );
}

const DAILY_REPEAT: DueDateRepeat = "daily";
const WEEKLY_REPEAT: DueDateRepeat = "weekly";
const MONTHLY_REPEAT: DueDateRepeat = "monthly";
const YEARLY_REPEAT: DueDateRepeat = "yearly";

const requiredDailyRepeatKeys: possibleDueDateKeys[] = ["next", "repeat"];
const optionalDailyRepeatKeys: possibleDueDateKeys[] = ["every"];
type DailyRepeat = {
  next: string;
  repeat: DueDateRepeat;
  every?: string;
};
function isDailyRepeatType(obj: Record<string, unknown>): obj is DailyRepeat {
  return isKeyMatch(
    Object.keys(obj),
    requiredDailyRepeatKeys,
    optionalDailyRepeatKeys,
  );
}
function isDailyRepeat(obj: Record<string, unknown>): obj is DailyRepeat {
  return isDailyRepeatType(obj) && obj.repeat === DAILY_REPEAT;
}

const requiredWeeklyRepeatKeys: possibleDueDateKeys[] = ["next", "repeat"];
const optionalWeeklyRepeatKeys: possibleDueDateKeys[] = ["every", "dayOfWeek"];
type WeeklyRepeat = {
  next: string;
  repeat: DueDateRepeat;
  every?: string;
  dayOfWeek?: string;
};
function isWeeklyRepeatType(obj: Record<string, unknown>): obj is WeeklyRepeat {
  return isKeyMatch(
    Object.keys(obj),
    requiredWeeklyRepeatKeys,
    optionalWeeklyRepeatKeys,
  );
}
function isWeeklyRepeat(obj: Record<string, unknown>): obj is WeeklyRepeat {
  return isWeeklyRepeatType(obj) && obj.repeat === WEEKLY_REPEAT;
}

const requiredMonthlyRepeatKeys: possibleDueDateKeys[] = ["next", "repeat"];
const optionalMonthlyRepeatKeys: possibleDueDateKeys[] = ["every"];
type MonthlyRepeat = {
  next: string;
  repeat: DueDateRepeat;
  every?: string;
};
function isMonthlyRepeatType(
  obj: Record<string, unknown>,
): obj is MonthlyRepeat {
  return isKeyMatch(
    Object.keys(obj),
    requiredMonthlyRepeatKeys,
    optionalMonthlyRepeatKeys,
  );
}
function isMonthlyRepeat(obj: Record<string, unknown>): obj is MonthlyRepeat {
  return isMonthlyRepeatType(obj) && obj.repeat === MONTHLY_REPEAT;
}

const requiredMonthlyOnDayRepeatKeys: possibleDueDateKeys[] = [
  "next",
  "repeat",
  "dayOfMonth",
];
const optionalMonthlyOnDayRepeatKeys: possibleDueDateKeys[] = ["every"];
type MonthlyOnDayRepeat = {
  next: string;
  repeat: DueDateRepeat;
  dayOfMonth: string;
  every?: string;
};
function isMonthlyOnDayRepeatType(
  obj: Record<string, unknown>,
): obj is MonthlyOnDayRepeat {
  return isKeyMatch(
    Object.keys(obj),
    requiredMonthlyOnDayRepeatKeys,
    optionalMonthlyOnDayRepeatKeys,
  );
}
function isMonthlyOnDayRepeat(
  obj: Record<string, unknown>,
): obj is MonthlyOnDayRepeat {
  return isMonthlyOnDayRepeatType(obj) && obj.repeat === MONTHLY_REPEAT;
}

const requiredMonthlyOnWeekRepeatKeys: possibleDueDateKeys[] = [
  "next",
  "repeat",
  "weekOfMonth",
];
const optionalMonthlyOnWeekRepeatKeys: possibleDueDateKeys[] = ["every"];
type MonthlyOnWeekRepeat = {
  next: string;
  repeat: DueDateRepeat;
  weekOfMonth: string;
  every?: string;
};
function isMonthlyOnWeekRepeatType(
  obj: Record<string, unknown>,
): obj is MonthlyOnWeekRepeat {
  return isKeyMatch(
    Object.keys(obj),
    requiredMonthlyOnWeekRepeatKeys,
    optionalMonthlyOnWeekRepeatKeys,
  );
}
function isMonthlyOnWeekRepeat(
  obj: Record<string, unknown>,
): obj is MonthlyOnWeekRepeat {
  return isMonthlyOnWeekRepeatType(obj) && obj.repeat === MONTHLY_REPEAT;
}

const requiredYearlyRepeatKeys: possibleDueDateKeys[] = ["next", "repeat"];
const optionalYearlyRepeatKeys: possibleDueDateKeys[] = ["every"];
type YearlyRepeat = {
  next: string;
  repeat: DueDateRepeat;
  every?: string;
};
function isYearlyRepeatType(obj: Record<string, unknown>): obj is YearlyRepeat {
  return isKeyMatch(
    Object.keys(obj),
    requiredYearlyRepeatKeys,
    optionalYearlyRepeatKeys,
  );
}
function isYearlyRepeat(obj: Record<string, unknown>): obj is YearlyRepeat {
  return isYearlyRepeatType(obj) && obj.repeat === YEARLY_REPEAT;
}

const requiredYearlyOnDayRepeatKeys: possibleDueDateKeys[] = [
  "next",
  "repeat",
  "dayOfYear",
];
const optionalYearlyOnDayRepeatKeys: possibleDueDateKeys[] = ["every"];
type YearlyOnDayRepeat = {
  next: string;
  repeat: DueDateRepeat;
  dayOfYear: string;
  every?: string;
};
function isYearlyOnDayRepeatType(
  obj: Record<string, unknown>,
): obj is YearlyOnDayRepeat {
  return isKeyMatch(
    Object.keys(obj),
    requiredYearlyOnDayRepeatKeys,
    optionalYearlyOnDayRepeatKeys,
  );
}
function isYearlyOnDayRepeat(
  obj: Record<string, unknown>,
): obj is YearlyOnDayRepeat {
  return isYearlyOnDayRepeatType(obj) && obj.repeat === YEARLY_REPEAT;
}

const requiredYearlyOnWeekRepeatKeys: possibleDueDateKeys[] = [
  "next",
  "repeat",
  "weekOfYear",
];
const optionalYearlyOnWeekRepeatKeys: possibleDueDateKeys[] = ["every"];
type YearlyOnWeekRepeat = {
  next: string;
  repeat: DueDateRepeat;
  weekOfYear: string;
  every?: string;
};
function isYearlyOnWeekRepeatType(
  obj: Record<string, unknown>,
): obj is YearlyOnWeekRepeat {
  return isKeyMatch(
    Object.keys(obj),
    requiredYearlyOnWeekRepeatKeys,
    optionalYearlyOnWeekRepeatKeys,
  );
}
function isYearlyOnWeekRepeat(
  obj: Record<string, unknown>,
): obj is YearlyOnWeekRepeat {
  return isYearlyOnWeekRepeatType(obj) && obj.repeat === YEARLY_REPEAT;
}

const requiredYearlyOnMonthRepeatKeys: possibleDueDateKeys[] = [
  "next",
  "repeat",
  "monthOfYear",
];
const optionalYearlyOnMonthRepeatKeys: possibleDueDateKeys[] = ["every"];
type YearlyOnMonthRepeat = {
  next: string;
  repeat: DueDateRepeat;
  monthOfYear: string;
  every?: string;
};
function isYearlyOnMonthRepeatType(
  obj: Record<string, unknown>,
): obj is YearlyOnMonthRepeat {
  return isKeyMatch(
    Object.keys(obj),
    requiredYearlyOnMonthRepeatKeys,
    optionalYearlyOnMonthRepeatKeys,
  );
}
function isYearlyOnMonthRepeat(
  obj: Record<string, unknown>,
): obj is YearlyOnMonthRepeat {
  return isYearlyOnMonthRepeatType(obj) && obj.repeat === YEARLY_REPEAT;
}

export function createDueDateOption(options: {
  next: string;
  repeat?: DueDateRepeat;
  every?: string;
  dayOfWeek?: string;
  dayOfMonth?: string;
  weekOfMonth?: string;
  dayOfYear?: string;
  weekOfYear?: string;
  monthOfYear?: string;
}): Result<DueDateOption, ParseTodoOptionsError> {
  const nextDate = new Date(options.next);
  if (isNaN(nextDate.getTime())) {
    return Err(new ParseTodoOptionsError("Invalid due date"));
  }

  return Ok({
    next: nextDate,
    repeat: options.repeat || null,
    every: options.every ? parseInt(options.every) : null,
    dayOfWeek: options.dayOfWeek ? parseInt(options.dayOfWeek) : null,
    dayOfMonth: options.dayOfMonth ? parseInt(options.dayOfMonth) : null,
    weekOfMonth: options.weekOfMonth ? parseInt(options.weekOfMonth) : null,
    dayOfYear: options.dayOfYear ? parseInt(options.dayOfYear) : null,
    weekOfYear: options.weekOfYear ? parseInt(options.weekOfYear) : null,
    monthOfYear: options.monthOfYear ? parseInt(options.monthOfYear) : null,
  });
}

class ParseTodoOptionsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ParseTodoOptionsError";
  }
}

export function parseTodoOptions(
  optionsText: string[],
): Result<TodoOptions, ParseTodoOptionsError> {
  let dueDate: DueDateOption | null = null;

  // Convert options text array into key-value pairs
  const optionsMap: Record<string, string> = {};

  for (const option of optionsText) {
    // Split on first colon to handle values that might contain colons
    const [key, ...valueParts] = option.split(":");
    const value = valueParts.join(":").trim();
    optionsMap[key.trim()] = value;
  }

  if (isSingleDueDateType(optionsMap)) {
    const result = createDueDateOption({ next: optionsMap.due });
    if (isOk(result)) {
      dueDate = result.value;
    } else {
      return result;
    }
  } else if (
    isDailyRepeat(optionsMap) ||
    isWeeklyRepeat(optionsMap) ||
    isMonthlyRepeat(optionsMap) ||
    isMonthlyOnDayRepeat(optionsMap) ||
    isMonthlyOnWeekRepeat(optionsMap) ||
    isYearlyRepeat(optionsMap) ||
    isYearlyOnDayRepeat(optionsMap) ||
    isYearlyOnWeekRepeat(optionsMap) ||
    isYearlyOnMonthRepeat(optionsMap)
  ) {
    const result = createDueDateOption(optionsMap);
    if (isOk(result)) {
      dueDate = result.value;
    } else {
      return result;
    }
  } else {
    return Err(new ParseTodoOptionsError("Invalid due date options"));
  }

  return Ok({
    dueDate,
  });
}

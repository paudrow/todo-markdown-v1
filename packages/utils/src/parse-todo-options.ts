import { DueDateOption, DueDateRepeat } from "@todo-markdown/types";
import { Err, isError, Ok, Result } from "./result";
import { toPlainDate } from "./date";

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

function validateEvery(
  every: string | undefined,
): Result<void, ParseTodoOptionsError> {
  if (!every) {
    return Ok(undefined);
  }
  const everyInt = parseInt(every);
  if (isNaN(everyInt)) {
    return Err(new ParseTodoOptionsError(`Invalid every value: ${every}`));
  }
  if (everyInt < 1) {
    return Err(
      new ParseTodoOptionsError(`every must be greater than 0: ${every}`),
    );
  }
  return Ok(undefined);
}

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
function validateDailyRepeat(
  options: DailyRepeat,
): Result<void, ParseTodoOptionsError> {
  const { every } = options;
  const everyValidationResult = validateEvery(every);
  if (isError(everyValidationResult)) {
    return everyValidationResult;
  }
  return Ok(undefined);
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
function validateWeeklyRepeat(
  options: WeeklyRepeat,
): Result<void, ParseTodoOptionsError> {
  const { dayOfWeek, every } = options;

  const everyValidationResult = validateEvery(every);
  if (isError(everyValidationResult)) {
    return everyValidationResult;
  }

  if (!dayOfWeek) {
    return Ok(undefined);
  }
  const dayOfWeekInt = parseInt(dayOfWeek);
  if (isNaN(dayOfWeekInt)) {
    return Err(
      new ParseTodoOptionsError(`Invalid dayOfWeek value: ${dayOfWeek}`),
    );
  }
  if (dayOfWeekInt < 1 || dayOfWeekInt > 7) {
    return Err(
      new ParseTodoOptionsError(
        `dayOfWeek must be between 1 and 7: ${dayOfWeek}`,
      ),
    );
  }
  return Ok(undefined);
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
function validateMonthlyRepeat(
  options: MonthlyRepeat,
): Result<void, ParseTodoOptionsError> {
  const { every } = options;
  const everyValidationResult = validateEvery(every);
  if (isError(everyValidationResult)) {
    return everyValidationResult;
  }
  return Ok(undefined);
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
function validateMonthlyOnDayRepeat(
  options: MonthlyOnDayRepeat,
): Result<void, ParseTodoOptionsError> {
  const { dayOfMonth, every } = options;
  const everyValidationResult = validateEvery(every);
  if (isError(everyValidationResult)) {
    return everyValidationResult;
  }
  if (!dayOfMonth) {
    return Ok(undefined);
  }

  const dayOfMonthInt = parseInt(dayOfMonth);
  if (isNaN(dayOfMonthInt)) {
    return Err(
      new ParseTodoOptionsError(`Invalid dayOfMonth value: ${dayOfMonth}`),
    );
  }
  if (dayOfMonthInt < 1 || dayOfMonthInt > 31) {
    return Err(
      new ParseTodoOptionsError(
        `dayOfMonth must be between 1 and 31: ${dayOfMonth}`,
      ),
    );
  }
  return Ok(undefined);
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
function validateMonthlyOnWeekRepeat(
  options: MonthlyOnWeekRepeat,
): Result<void, ParseTodoOptionsError> {
  const { weekOfMonth, every } = options;
  const everyValidationResult = validateEvery(every);
  if (isError(everyValidationResult)) {
    return everyValidationResult;
  }
  if (!weekOfMonth) {
    return Ok(undefined);
  }

  const weekOfMonthInt = parseInt(weekOfMonth);
  if (isNaN(weekOfMonthInt)) {
    return Err(
      new ParseTodoOptionsError(`Invalid weekOfMonth value: ${weekOfMonth}`),
    );
  }
  if (weekOfMonthInt < 1 || weekOfMonthInt > 5) {
    return Err(
      new ParseTodoOptionsError(
        `weekOfMonth must be between 1 and 5: ${weekOfMonth}`,
      ),
    );
  }
  return Ok(undefined);
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
function validateYearlyRepeat(
  options: YearlyRepeat,
): Result<void, ParseTodoOptionsError> {
  const { every } = options;
  const everyValidationResult = validateEvery(every);
  if (isError(everyValidationResult)) {
    return everyValidationResult;
  }
  return Ok(undefined);
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
function validateYearlyOnDayRepeat(
  options: YearlyOnDayRepeat,
): Result<void, ParseTodoOptionsError> {
  const { dayOfYear, every } = options;
  const everyValidationResult = validateEvery(every);
  if (isError(everyValidationResult)) {
    return everyValidationResult;
  }
  if (!dayOfYear) {
    return Ok(undefined);
  }

  const dayOfYearInt = parseInt(dayOfYear);
  if (isNaN(dayOfYearInt)) {
    return Err(
      new ParseTodoOptionsError(`Invalid dayOfYear value: ${dayOfYear}`),
    );
  }
  if (dayOfYearInt < 1 || dayOfYearInt > 366) {
    return Err(
      new ParseTodoOptionsError(
        `dayOfYear must be between 1 and 366: ${dayOfYear}`,
      ),
    );
  }
  return Ok(undefined);
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
function validateYearlyOnWeekRepeat(
  options: YearlyOnWeekRepeat,
): Result<void, ParseTodoOptionsError> {
  const { weekOfYear, every } = options;
  const everyValidationResult = validateEvery(every);
  if (isError(everyValidationResult)) {
    return everyValidationResult;
  }

  if (!weekOfYear) {
    return Ok(undefined);
  }
  const weekOfYearInt = parseInt(weekOfYear);
  if (isNaN(weekOfYearInt)) {
    return Err(
      new ParseTodoOptionsError(`Invalid weekOfYear value: ${weekOfYear}`),
    );
  }
  if (weekOfYearInt < 1 || weekOfYearInt > 4) {
    return Err(
      new ParseTodoOptionsError(
        `weekOfYear must be between 1 and 4: ${weekOfYear}`,
      ),
    );
  }
  return Ok(undefined);
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
function validateYearlyOnMonthRepeat(
  options: YearlyOnMonthRepeat,
): Result<void, ParseTodoOptionsError> {
  const { monthOfYear, every } = options;

  const everyValidationResult = validateEvery(every);
  if (isError(everyValidationResult)) {
    return everyValidationResult;
  }
  if (!monthOfYear) {
    return Ok(undefined);
  }

  const monthOfYearInt = parseInt(monthOfYear);
  if (isNaN(monthOfYearInt)) {
    return Err(
      new ParseTodoOptionsError(`Invalid monthOfYear value: ${monthOfYear}`),
    );
  }
  if (monthOfYearInt < 1 || monthOfYearInt > 12) {
    return Err(
      new ParseTodoOptionsError(
        `monthOfYear must be between 1 and 12: ${monthOfYear}`,
      ),
    );
  }
  return Ok(undefined);
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
  const result = toPlainDate(options.next);
  if (isError(result)) {
    return Err(
      new ParseTodoOptionsError(`Invalid next due date: ${options.next}`),
    );
  }

  return Ok({
    next: result.value,
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

export function parseDueDateOptions(
  optionsText: string[],
): Result<DueDateOption | null, ParseTodoOptionsError> {
  // Convert options text array into key-value pairs
  const optionsRecord: Record<string, string> = {};

  for (const option of optionsText) {
    // Split on first colon to handle values that might contain colons
    const [key, ...valueParts] = option.split(":");
    const value = valueParts.join(":").trim();
    optionsRecord[key.trim()] = value;
  }

  if (Object.keys(optionsRecord).length === 0) {
    return Ok(null);
  }

  // Check if required keys are present
  const hasNextAndRepeat = "next" in optionsRecord && "repeat" in optionsRecord;
  const hasDue = "due" in optionsRecord;

  if (!hasNextAndRepeat && !hasDue) {
    return Ok(null);
  }

  if (isSingleDueDateType(optionsRecord)) {
    return createDueDateOption({ next: optionsRecord.due });
  }

  let validationResult: Result<void, ParseTodoOptionsError> | null = null;
  let result: Result<DueDateOption, ParseTodoOptionsError> | null = null;
  if (isDailyRepeat(optionsRecord)) {
    validationResult = validateDailyRepeat(optionsRecord);
    result = createDueDateOption(optionsRecord);
  } else if (isWeeklyRepeat(optionsRecord)) {
    validationResult = validateWeeklyRepeat(optionsRecord);
    result = createDueDateOption(optionsRecord);
  } else if (isMonthlyRepeat(optionsRecord)) {
    validationResult = validateMonthlyRepeat(optionsRecord);
    result = createDueDateOption(optionsRecord);
  } else if (isMonthlyOnDayRepeat(optionsRecord)) {
    validationResult = validateMonthlyOnDayRepeat(optionsRecord);
    result = createDueDateOption(optionsRecord);
  } else if (isMonthlyOnWeekRepeat(optionsRecord)) {
    validationResult = validateMonthlyOnWeekRepeat(optionsRecord);
    result = createDueDateOption(optionsRecord);
  } else if (isYearlyRepeat(optionsRecord)) {
    validationResult = validateYearlyRepeat(optionsRecord);
    result = createDueDateOption(optionsRecord);
  } else if (isYearlyOnDayRepeat(optionsRecord)) {
    validationResult = validateYearlyOnDayRepeat(optionsRecord);
    result = createDueDateOption(optionsRecord);
  } else if (isYearlyOnWeekRepeat(optionsRecord)) {
    validationResult = validateYearlyOnWeekRepeat(optionsRecord);
    result = createDueDateOption(optionsRecord);
  } else if (isYearlyOnMonthRepeat(optionsRecord)) {
    validationResult = validateYearlyOnMonthRepeat(optionsRecord);
    result = createDueDateOption(optionsRecord);
  }

  if (validationResult && isError(validationResult)) {
    return validationResult;
  }

  if (result) {
    return result;
  }
  return Err(new ParseTodoOptionsError("No valid due date options found"));
}

import { Temporal } from "@js-temporal/polyfill";
import { Result, Err, Ok } from "./result";

/**
 * Converts a Date object or ISO string to a Temporal.PlainDate
 */
export function toPlainDate(date: string): Result<Temporal.PlainDate, Error> {
  try {
    return Ok(Temporal.PlainDate.from(date));
  } catch (e) {
    return Err(new Error(`Invalid date string: ${date}`));
  }
}

/**
 * Returns true if the date is in the past
 */
export function isPast(date: Temporal.PlainDate): boolean {
  const today = Temporal.Now.plainDateISO();
  return Temporal.PlainDate.compare(today, date) < 0;
}

/**
 * Returns true if the date is in the future
 */
export function isFuture(date: Temporal.PlainDate): boolean {
  const today = Temporal.Now.plainDateISO();
  return Temporal.PlainDate.compare(today, date) < 0;
}

/**
 * Returns true if the date is today
 */
export function isToday(date: Temporal.PlainDate): boolean {
  const today = Temporal.Now.plainDateISO();
  return Temporal.PlainDate.compare(today, date) === 0;
}

export interface Todo {
  priority:
    | "A"
    | "B"
    | "C"
    | "D"
    | "E"
    | "F"
    | "G"
    | "H"
    | "I"
    | "J"
    | "K"
    | "L"
    | "M"
    | "N"
    | "O"
    | "P"
    | "Q"
    | "R"
    | "S"
    | "T"
    | "U"
    | "V"
    | "W"
    | "X"
    | "Y"
    | "Z"
    | null;
  cleanedText: string;
  isDone: boolean;
  line: number;
  fileUri: string;
  projects: string[];
  contexts: string[];
  children: Todo[];
  indentLevel: number;
  options: TodoOptions;
  debug: {
    fullText: string;
    optionsText: string[];
  };
}

export interface TodoOptions {
  dueDate: DueDateOption | null;
}

export type DueDateRepeat = "daily" | "weekly" | "monthly" | "yearly";

export interface DueDateOption {
  next: Date;
  repeat: DueDateRepeat | null;
  every: number | null;
  dayOfWeek: number | null;
  dayOfMonth: number | null;
  weekOfMonth: number | null;
  dayOfYear: number | null;
  weekOfYear: number | null;
  monthOfYear: number | null;
}

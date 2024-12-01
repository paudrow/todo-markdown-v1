import * as vscode from "vscode";
import { Todo } from "@todo-markdown/types";
import { parseTodoOptions, unwrapOr } from "@todo-markdown/utils";
import { isError } from "@todo-markdown/utils";

interface ParseTodoResult {
  todo: Todo;
  indentLevel: number;
}

export class TodoLoader {
  static async loadFromWorkspace(): Promise<Todo[]> {
    const todos: Todo[] = [];

    const mdFiles = await vscode.workspace.findFiles("**/*.md");

    for (const fileUri of mdFiles) {
      try {
        const document = await vscode.workspace.openTextDocument(fileUri);
        const text = document.getText();

        const todoRegex = /^(\s*)-\s*\[([ x])\]\s*(.+)$/gm;
        let match;

        const todoStack: Todo[][] = [[]];
        let lastIndentLevel = 0;

        while ((match = todoRegex.exec(text)) !== null) {
          const result = parseTodoLine(match, document, fileUri);
          if (result) {
            const { todo, indentLevel } = result;

            if (indentLevel > lastIndentLevel) {
              todoStack.push([]);
            } else if (indentLevel < lastIndentLevel) {
              for (let i = 0; i < lastIndentLevel - indentLevel; i++) {
                const children = todoStack.pop() || [];
                const parent = todoStack[todoStack.length - 1];
                if (parent && parent.length > 0) {
                  parent[parent.length - 1].children = children;
                }
              }
            }

            todoStack[todoStack.length - 1].push(todo);
            lastIndentLevel = indentLevel;
          }
        }

        while (todoStack.length > 1) {
          const children = todoStack.pop() || [];
          const parent = todoStack[todoStack.length - 1];
          if (parent && parent.length > 0) {
            parent[parent.length - 1].children = children;
          }
        }

        todos.push(...todoStack[0]);
      } catch (error) {
        console.error(`Error loading todos from ${fileUri.fsPath}:`, error);
      }
    }

    todos.sort(compareTodos);

    return todos;
  }
}

function parseTodoLine(
  match: RegExpExecArray,
  document: vscode.TextDocument,
  fileUri: vscode.Uri,
): ParseTodoResult | null {
  const indentStr = match[1];
  const indentLevel = indentStr.length / 2;
  const todoText = match[3].trim();

  const projects: string[] = [];
  const contexts: string[] = [];
  const optionsText: string[] = [];

  // Extract projects and contexts
  const words = todoText.split(" ");
  const cleanedWords: string[] = [];

  for (const word of words) {
    if (word.startsWith("+")) {
      projects.push(word.substring(1));
      continue;
    }
    if (word.startsWith("@")) {
      contexts.push(word.substring(1));
      continue;
    }
    cleanedWords.push(word);
  }

  // Extract options from curly braces
  const optionsRegex = /{([^{}]+)}/g;
  let optionsMatch;
  while ((optionsMatch = optionsRegex.exec(todoText)) !== null) {
    optionsText.push(optionsMatch[1].trim());
  }

  // Extract priority
  const priorityMatch = todoText.match(/^\(([A-Z])\)\s+/);
  let priority = null;
  if (priorityMatch) {
    priority = priorityMatch[1] as Todo["priority"];
  }

  // Clean the text
  const cleanedText = todoText
    .replace(/^\([A-Z]\)\s+/, "")
    .replace(/\+\w+/g, "")
    .replace(/@\w+/g, "")
    .replace(/{[^{}]+}/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const result = parseTodoOptions(optionsText);
  if (isError(result)) {
    console.error(
      `Error parsing options for ${fileUri.fsPath}: ${result.error.message}`,
    );
    return null;
  }
  const options = unwrapOr(result, { dueDate: null });

  return {
    todo: {
      isDone: match[2] === "x",
      cleanedText,
      projects,
      contexts,
      line: document.positionAt(match.index).line + 1,
      fileUri: fileUri.fsPath,
      children: [],
      indentLevel,
      priority,
      options,
      debug: {
        fullText: todoText,
        optionsText,
      },
    },
    indentLevel,
  };
}

function compareTodos(a: Todo, b: Todo): number {
  // Compare due dates first
  const aDate = a.options.dueDate?.next;
  const bDate = b.options.dueDate?.next;

  if (aDate && bDate) {
    const dateComparison = aDate.getTime() - bDate.getTime();
    if (dateComparison !== 0) {
      return dateComparison;
    }
  } else if (aDate) {
    return -1; // a has date, b doesn't -> a comes first
  } else if (bDate) {
    return 1; // b has date, a doesn't -> b comes first
  }

  // If dates are equal or both null, compare priorities
  if (a.priority && b.priority) {
    const priorityComparison = a.priority.localeCompare(b.priority);
    if (priorityComparison !== 0) {
      return priorityComparison;
    }
  } else if (a.priority) {
    return -1; // a has priority, b doesn't -> a comes first
  } else if (b.priority) {
    return 1; // b has priority, a doesn't -> b comes first
  }

  // If priorities are equal or both null, compare text
  return a.cleanedText.localeCompare(b.cleanedText);
}

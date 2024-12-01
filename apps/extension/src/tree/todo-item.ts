import * as vscode from "vscode";
import { Todo } from "@todo-markdown/types";
import { isToday } from "@todo-markdown/utils";

export class TodoItem extends vscode.TreeItem {
  constructor(
    public readonly todo: Todo,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
  ) {
    const state =
      todo.children.length > 0
        ? vscode.TreeItemCollapsibleState.Expanded
        : vscode.TreeItemCollapsibleState.None;

    // Build display text with priority and completion status
    let displayText = todo.cleanedText;
    const displayParts: string[] = [];

    // Add due date if overdue
    if (
      todo.options.dueDate?.next &&
      !isToday(todo.options.dueDate.next) &&
      !todo.isDone
    ) {
      const date = todo.options.dueDate.next;
      displayParts.push(`(${date.toString()})`);
    }

    // Add done status for indented todos
    if (todo.isDone && todo.indentLevel >= 1) {
      displayParts.push("(done)");
    }

    // Combine all parts with the cleaned text
    if (displayParts.length > 0) {
      displayText = `${displayParts.join(" ")} ${displayText}`;
    }

    super(displayText, state);

    // Add decoration provider with error state
    this.resourceUri = vscode.Uri.parse(
      `todo-item:${todo.fileUri}?${JSON.stringify({
        priority: todo.priority,
        hasError: !!todo.debug.error,
      })}`,
    );

    this.contextValue = "todoItem";

    this.command = {
      command: "markdown-todos.jumpToLine",
      title: "Jump to Todo",
      arguments: [todo],
    };

    const fileName =
      vscode.Uri.parse(todo.fileUri).fsPath.split("/").pop() || "";
    this.description = `${fileName}:${todo.line}`;
    if (todo.debug.error) {
      this.tooltip = todo.debug.error.message;
    } else {
      this.tooltip = todo.debug.fullText;
    }

    // Set icon based on error state
    if (todo.debug.error) {
      this.iconPath = new vscode.ThemeIcon(
        "error",
        new vscode.ThemeColor("errorForeground"),
      );
    } else {
      this.iconPath = todo.isDone
        ? new vscode.ThemeIcon("check")
        : new vscode.ThemeIcon("dash");
    }
  }
}

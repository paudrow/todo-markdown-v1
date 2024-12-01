import * as vscode from "vscode";
import { Todo } from "@todo-markdown/types";
import { isPast } from "@todo-markdown/utils";

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
    if (todo.options.dueDate?.next && isPast(todo.options.dueDate.next)) {
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

    // Add decoration provider
    this.resourceUri = vscode.Uri.parse(
      `todo-item:${todo.fileUri}?${JSON.stringify({ priority: todo.priority })}`,
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
    this.tooltip = todo.debug.fullText;

    this.iconPath = todo.isDone
      ? new vscode.ThemeIcon("check")
      : new vscode.ThemeIcon("dash");
  }
}

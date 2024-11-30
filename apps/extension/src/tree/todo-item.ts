import * as vscode from "vscode";
import { Todo } from "@todo-markdown/types";

export class TodoItem extends vscode.TreeItem {
  public checkbox: vscode.ThemeIcon;

  constructor(
    public readonly todo: Todo,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    private readonly allTodos: Todo[],
  ) {
    const state =
      todo.children.length > 0
        ? vscode.TreeItemCollapsibleState.Expanded
        : vscode.TreeItemCollapsibleState.None;

    // Add "(done)" prefix for completed todos at level 2+
    let displayText = todo.cleanedText;
    if (todo.isDone && todo.indentLevel >= 1) {
      displayText = `(done) ${displayText}`;
    }

    super(displayText, state);

    this.checkbox = new vscode.ThemeIcon(
      todo.isDone ? "check-all" : "circle-outline",
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
  }
}

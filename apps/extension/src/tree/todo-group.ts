import * as vscode from "vscode";
import { TodoItem } from "./todo-item";

export class TodoGroup extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly todos: TodoItem[],
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
  ) {
    super(label, collapsibleState);
  }
}

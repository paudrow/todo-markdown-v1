import * as vscode from "vscode";
import { Todo } from "@todo-markdown/types";
import { TodoItem } from "./todo-item";
import { TodoGroup } from "./todo-group";
import { isPast, isToday } from "@todo-markdown/utils";

export class TodoProvider
  implements vscode.TreeDataProvider<TodoItem | TodoGroup>
{
  private _onDidChangeTreeData = new vscode.EventEmitter<
    TodoItem | TodoGroup | undefined
  >();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;
  private todos: Todo[];

  constructor(todos: Todo[]) {
    this.todos = todos;
  }

  updateTodos(newTodos: Todo[]) {
    this.todos = newTodos;
    this.refresh();
  }

  getTreeItem(element: TodoItem | TodoGroup): vscode.TreeItem {
    return element;
  }

  private isActiveTodo(todo: Todo): boolean {
    if (todo.isDone) {
      return false;
    }

    const parent = this.todos.find(
      (t) =>
        t.fileUri === todo.fileUri &&
        t.line < todo.line &&
        t.indentLevel === todo.indentLevel - 1,
    );

    if (!parent) {
      return true;
    }

    return this.isActiveTodo(parent);
  }

  getChildren(
    element?: TodoItem | TodoGroup,
  ): Thenable<(TodoItem | TodoGroup)[]> {
    if (!element) {
      return this.getRootGroups();
    }

    if (element instanceof TodoGroup) {
      return Promise.resolve(element.todos);
    }

    if (element instanceof TodoItem && element.todo.children.length > 0) {
      return this.getChildTodos(element);
    }

    return Promise.resolve([]);
  }

  private isOverdue(todo: Todo): boolean {
    if (!todo.options.dueDate?.next) {
      return false;
    }
    return isPast(todo.options.dueDate.next);
  }

  private isDueToday(todo: Todo): boolean {
    if (!todo.options.dueDate?.next) {
      return false;
    }
    return isToday(todo.options.dueDate.next);
  }

  private getRootGroups(): Thenable<TodoGroup[]> {
    const groups: TodoGroup[] = [];

    // Filter root-level todos
    const rootTodos = this.todos.filter((todo) => todo.indentLevel === 0);

    // Separate todos into categories
    const overdueTodos = rootTodos
      .filter((todo) => this.isActiveTodo(todo) && this.isOverdue(todo))
      .map((todo) => this.createTodoItem(todo));

    const todayTodos = rootTodos
      .filter((todo) => this.isActiveTodo(todo) && this.isDueToday(todo))
      .map((todo) => this.createTodoItem(todo));

    const activeTodos = rootTodos
      .filter(
        (todo) =>
          this.isActiveTodo(todo) &&
          !this.isOverdue(todo) &&
          !this.isDueToday(todo),
      )
      .map((todo) => this.createTodoItem(todo));

    const completedTodos = rootTodos
      .filter((todo) => !this.isActiveTodo(todo))
      .map((todo) => this.createTodoItem(todo));

    // Add groups if they have items
    if (overdueTodos.length > 0) {
      groups.push(
        new TodoGroup(
          "Overdue",
          overdueTodos,
          vscode.TreeItemCollapsibleState.Expanded,
        ),
      );
    }

    if (todayTodos.length > 0) {
      groups.push(
        new TodoGroup(
          "Today",
          todayTodos,
          vscode.TreeItemCollapsibleState.Expanded,
        ),
      );
    }

    groups.push(
      new TodoGroup(
        "Active",
        activeTodos,
        vscode.TreeItemCollapsibleState.Expanded,
      ),
    );

    if (completedTodos.length > 0) {
      groups.push(
        new TodoGroup(
          "Completed",
          completedTodos,
          vscode.TreeItemCollapsibleState.Collapsed,
        ),
      );
    }

    return Promise.resolve(groups);
  }

  private getChildTodos(element: TodoItem): Thenable<TodoItem[]> {
    return Promise.resolve(
      element.todo.children.map((child) => this.createTodoItem(child)),
    );
  }

  private createTodoItem(todo: Todo): TodoItem {
    return new TodoItem(
      todo,
      todo.children.length > 0
        ? vscode.TreeItemCollapsibleState.Collapsed
        : vscode.TreeItemCollapsibleState.None,
      this.todos,
    );
  }

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }
}

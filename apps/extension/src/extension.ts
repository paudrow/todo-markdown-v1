import * as vscode from "vscode";
import { TodoProvider } from "./tree/todo-provider";
import { TodoLoader } from "./utils/todo-loader";
import { TodoCommands } from "./commands/todo-commands";
import { TodoDecorationProvider } from "./tree/todo-decoration-provider";

export async function activate(context: vscode.ExtensionContext) {
  // Create the todo tree view with loaded todos
  const todos = await TodoLoader.loadFromWorkspace();
  const todoProvider = new TodoProvider(todos);
  const treeView = vscode.window.createTreeView("todoList", {
    treeDataProvider: todoProvider,
    showCollapseAll: true,
  });

  // Watch for changes to markdown files
  const watcher = vscode.workspace.createFileSystemWatcher("**/*.md");

  // When a file is changed, reload todos
  watcher.onDidChange(async () => {
    const updatedTodos = await TodoLoader.loadFromWorkspace();
    todoProvider.updateTodos(updatedTodos);
  });

  // When a file is created, reload todos
  watcher.onDidCreate(async () => {
    const updatedTodos = await TodoLoader.loadFromWorkspace();
    todoProvider.updateTodos(updatedTodos);
  });

  // When a file is deleted, reload todos
  watcher.onDidDelete(async () => {
    const updatedTodos = await TodoLoader.loadFromWorkspace();
    todoProvider.updateTodos(updatedTodos);
  });

  // Register commands with provider reference
  TodoCommands.registerCommands(context, todoProvider);

  const decorationProvider = new TodoDecorationProvider();
  context.subscriptions.push(
    vscode.window.registerFileDecorationProvider(decorationProvider),
  );

  context.subscriptions.push(treeView, watcher);
}

export function deactivate() {}

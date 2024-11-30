import * as vscode from "vscode";
import { TodoProvider } from "../tree/todo-provider";
import { Todo } from "@todo-markdown/types";

export class TodoCommands {
  static registerCommands(
    context: vscode.ExtensionContext,
    _todoProvider: TodoProvider, // eslint-disable-line @typescript-eslint/no-unused-vars
  ) {
    const jumpToLine = vscode.commands.registerCommand(
      "markdown-todos.jumpToLine",
      async (todo: Todo) => {
        try {
          const document = await vscode.workspace.openTextDocument(
            todo.fileUri,
          );
          const editor = await vscode.window.showTextDocument(document);

          // Get the line text
          const lineText = document.lineAt(todo.line - 1).text;

          // Find the position of the checkbox
          const checkboxMatch = lineText.match(/^(\s*)-\s*\[/);
          if (checkboxMatch) {
            const indentLength = checkboxMatch[1].length;
            const checkboxColumn = indentLength + 3; // 3 accounts for "- ["

            const position = new vscode.Position(todo.line - 1, checkboxColumn);
            editor.selection = new vscode.Selection(position, position);
            editor.revealRange(
              new vscode.Range(position, position),
              vscode.TextEditorRevealType.InCenter,
            );
          }
        } catch (error) {
          console.error("Error jumping to todo:", error);
          vscode.window.showErrorMessage("Unable to open todo location");
        }
      },
    );

    context.subscriptions.push(jumpToLine);
  }
}

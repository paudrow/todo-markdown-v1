import * as vscode from "vscode";

export class TodoDecorationProvider implements vscode.FileDecorationProvider {
  private _onDidChangeFileDecorations: vscode.EventEmitter<
    vscode.Uri | vscode.Uri[]
  > = new vscode.EventEmitter<vscode.Uri | vscode.Uri[]>();
  readonly onDidChangeFileDecorations: vscode.Event<vscode.Uri | vscode.Uri[]> =
    this._onDidChangeFileDecorations.event;

  provideFileDecoration(uri: vscode.Uri): vscode.FileDecoration | undefined {
    const todoItem =
      uri.scheme === "todo-item" ? JSON.parse(uri.query) : undefined;

    if (todoItem?.priority) {
      switch (todoItem.priority) {
        case "A":
          return { color: new vscode.ThemeColor("terminal.ansiRed") };
        case "B":
          return { color: new vscode.ThemeColor("terminal.ansiYellow") };
        case "C":
          return { color: new vscode.ThemeColor("terminal.ansiGreen") };
        case "D":
          return { color: new vscode.ThemeColor("terminal.ansiBlue") };
        case "E":
          return { color: new vscode.ThemeColor("terminal.ansiMagenta") };
        default:
          return { color: new vscode.ThemeColor("foreground") };
      }
    }
    return undefined;
  }
}

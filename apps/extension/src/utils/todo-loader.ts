import * as vscode from "vscode";
import { Todo } from "@todo-markdown/types";
import { parseTodoOptions } from "@todo-markdown/utils";
import { isError } from "@todo-markdown/utils";

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

          // Extract options from curly braces - each complete {...} is one option
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

          // Clean the text by removing the patterns
          const cleanedText = todoText
            .replace(/^\([A-Z]\)\s+/, "") // Remove priority
            .replace(/\+\w+/g, "") // Remove projects
            .replace(/@\w+/g, "") // Remove contexts
            .replace(/{[^{}]+}/g, "") // Remove options
            .replace(/\s+/g, " ") // Replace multiple spaces with single space
            .trim();

          const result = parseTodoOptions(optionsText);
          if (isError(result)) {
            throw result.error;
          }
          const options = result.value;

          const todo: Todo = {
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
          };

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

    return todos;
  }
}

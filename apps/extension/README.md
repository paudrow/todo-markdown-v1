# Todo Markdown

A VSCode extension that aggregates todos from your markdown files.

## Features

- View all todos from markdown files in a dedicated sidebar
- Organize todos by status (Overdue, Today, Future, Completed)
- Support for nested todos with collapsible tree view
- Priority levels (A-Z)
- Projects (+project) and contexts (@context) tags
- Due dates with flexible scheduling options
- Jump to todo location in source files

## Todo Syntax

Basic todo format:

- [ ] Uncompleted todo
- [x] Completed todo

### Advanced Features

1. **Priorities**

- [ ] (A) High priority task
- [ ] (B) Medium priority task
- [ ] (C) Lower priority task

2. **Projects and Contexts**

- [ ] Add documentation +work
- [ ] Call John @phone

3. **Due Dates**

> Repeating todos are a WIP

- [ ] Simple due date {due:2024-03-20}
- [ ] Repeating task {next:2024-03-20} {repeat:daily}
- [ ] Every other week {next:2024-03-20} {repeat:weekly} {every:2}

4. **Nested Todos**

- [ ] Main task
  - [ ] Subtask 1
  - [ ] Subtask 2
    - [ ] Sub-subtask

## Due Date Options

The extension supports various scheduling patterns:

> Repeating is WIP

- **Single Due Date**: {due:YYYY-MM-DD}
- **Daily**: {next:YYYY-MM-DD, repeat:daily}
- **Weekly**: {next:YYYY-MM-DD, repeat:weekly}
- **Monthly**: {next:YYYY-MM-DD, repeat:monthly}
- **Yearly**: {next:YYYY-MM-DD, repeat:yearly}

Additional modifiers:

- {every:N} - Repeat every N days/weeks/months/years
- {dayOfWeek:1-7} - Specific day of week (1=Monday, 7=Sunday)
- {dayOfMonth:1-31} - Specific day of month
- {weekOfMonth:1-5} - Specific week of month
- {dayOfYear:1-366} - Specific day of year
- {weekOfYear:1-52} - Specific week of year
- {monthOfYear:1-12} - Specific month of year

## Extension Settings

The extension contributes to the following VS Code settings:

- Adds a "Markdown Todos" view container to the activity bar
- Provides a tree view of todos organized by status

## Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Build the extension: `npm run build`
4. Launch the extension in debug mode using VS Code's Run and Debug view

## License

MIT

import type { Todo } from "./types";

// Shared in-memory storage
// In production, replace this with a database
class TodoStorage {
  private todos: Todo[] = [];
  private nextId = 1;

  getTodos(): Todo[] {
    return this.todos;
  }

  addTodo(todo: Omit<Todo, "id" | "createdAt" | "updatedAt">): Todo {
    const newTodo: Todo = {
      ...todo,
      id: this.nextId.toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.nextId++;
    this.todos.unshift(newTodo);
    return newTodo;
  }

  updateTodo(id: string, updates: Partial<Todo>): Todo | null {
    const index = this.todos.findIndex((t) => t.id === id);
    if (index === -1) return null;

    this.todos[index] = {
      ...this.todos[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.todos[index];
  }

  deleteTodo(id: string): boolean {
    const index = this.todos.findIndex((t) => t.id === id);
    if (index === -1) return false;

    this.todos.splice(index, 1);
    return true;
  }

  toggleTodo(id: string): Todo | null {
    const index = this.todos.findIndex((t) => t.id === id);
    if (index === -1) return null;

    this.todos[index] = {
      ...this.todos[index],
      completed: !this.todos[index].completed,
      updatedAt: new Date().toISOString(),
    };
    return this.todos[index];
  }

  deleteCompleted(): number {
    const initialLength = this.todos.length;
    this.todos = this.todos.filter((todo) => !todo.completed);
    return initialLength - this.todos.length;
  }

  markAllComplete(): Todo[] {
    this.todos = this.todos.map((todo) => ({
      ...todo,
      completed: true,
      updatedAt: new Date().toISOString(),
    }));
    return this.todos;
  }
}

export const todoStorage = new TodoStorage();

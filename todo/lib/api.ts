import type { Todo, CreateTodoRequest, UpdateTodoRequest, ApiResponse } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  // Todo API methods
  async getTodos(): Promise<ApiResponse<Todo[]>> {
    return this.request<Todo[]>("/todos")
  }

  async getTodo(id: string): Promise<ApiResponse<Todo>> {
    return this.request<Todo>(`/todos/${id}`)
  }

  async createTodo(todo: CreateTodoRequest): Promise<ApiResponse<Todo>> {
    return this.request<Todo>("/todos", {
      method: "POST",
      body: JSON.stringify(todo),
    })
  }

  async updateTodo(todo: UpdateTodoRequest): Promise<ApiResponse<Todo>> {
    return this.request<Todo>(`/todos/${todo.id}`, {
      method: "PUT",
      body: JSON.stringify(todo),
    })
  }

  async deleteTodo(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/todos/${id}`, {
      method: "DELETE",
    })
  }

  async toggleTodo(id: string): Promise<ApiResponse<Todo>> {
    return this.request<Todo>(`/todos/${id}/toggle`, {
      method: "PATCH",
    })
  }

  async deleteCompletedTodos(): Promise<ApiResponse<void>> {
    return this.request<void>("/todos/completed", {
      method: "DELETE",
    })
  }

  async markAllComplete(): Promise<ApiResponse<Todo[]>> {
    return this.request<Todo[]>("/todos/complete-all", {
      method: "PATCH",
    })
  }
}

export const api = new ApiClient()

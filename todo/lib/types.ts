export interface Todo {
  id: string
  title: string
  description?: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateTodoRequest {
  title: string
  description?: string
}

export interface UpdateTodoRequest {
  id: string
  title?: string
  description?: string
  completed?: boolean
}

export interface TodoFilters {
  search: string
  sortBy: "newest" | "oldest" | "alphabetical" | "completed"
  showCompleted: boolean
}

export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

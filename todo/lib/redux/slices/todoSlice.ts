import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { Todo, CreateTodoRequest, UpdateTodoRequest } from "@/lib/types"
import { api } from "@/lib/api"

interface TodoState {
  todos: Todo[]
  loading: boolean
  error: string | null
  lastUpdated: string | null
}

const initialState: TodoState = {
  todos: [],
  loading: false,
  error: null,
  lastUpdated: null,
}

// Async thunks
export const fetchTodos = createAsyncThunk("todos/fetchTodos", async (_, { rejectWithValue }) => {
  try {
    const response = await api.getTodos()
    return response.data
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch todos")
  }
})

export const createTodo = createAsyncThunk(
  "todos/createTodo",
  async (todoData: CreateTodoRequest, { rejectWithValue }) => {
    try {
      const response = await api.createTodo(todoData)
      return response.data
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to create todo")
    }
  },
)

export const updateTodo = createAsyncThunk(
  "todos/updateTodo",
  async (todoData: UpdateTodoRequest, { rejectWithValue }) => {
    try {
      const response = await api.updateTodo(todoData)
      return response.data
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to update todo")
    }
  },
)

export const deleteTodo = createAsyncThunk("todos/deleteTodo", async (id: string, { rejectWithValue }) => {
  try {
    await api.deleteTodo(id)
    return id
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to delete todo")
  }
})

export const toggleTodo = createAsyncThunk("todos/toggleTodo", async (id: string, { rejectWithValue }) => {
  try {
    const response = await api.toggleTodo(id)
    return response.data
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to toggle todo")
  }
})

export const deleteCompletedTodos = createAsyncThunk("todos/deleteCompletedTodos", async (_, { rejectWithValue }) => {
  try {
    await api.deleteCompletedTodos()
    return true
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to delete completed todos")
  }
})

export const markAllComplete = createAsyncThunk("todos/markAllComplete", async (_, { rejectWithValue }) => {
  try {
    const response = await api.markAllComplete()
    return response.data
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to mark all complete")
  }
})

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setTodos: (state, action: PayloadAction<Todo[]>) => {
      state.todos = action.payload
      state.lastUpdated = new Date().toISOString()
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch todos
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false
        state.todos = action.payload
        state.lastUpdated = new Date().toISOString()
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Create todo
      .addCase(createTodo.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.loading = false
        state.todos.unshift(action.payload)
        state.lastUpdated = new Date().toISOString()
      })
      .addCase(createTodo.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Update todo
      .addCase(updateTodo.fulfilled, (state, action) => {
        const index = state.todos.findIndex((todo) => todo.id === action.payload.id)
        if (index !== -1) {
          state.todos[index] = action.payload
          state.lastUpdated = new Date().toISOString()
        }
      })

      // Delete todo
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter((todo) => todo.id !== action.payload)
        state.lastUpdated = new Date().toISOString()
      })

      // Toggle todo
      .addCase(toggleTodo.fulfilled, (state, action) => {
        const index = state.todos.findIndex((todo) => todo.id === action.payload.id)
        if (index !== -1) {
          state.todos[index] = action.payload
          state.lastUpdated = new Date().toISOString()
        }
      })

      // Delete completed todos
      .addCase(deleteCompletedTodos.fulfilled, (state) => {
        state.todos = state.todos.filter((todo) => !todo.completed)
        state.lastUpdated = new Date().toISOString()
      })

      // Mark all complete
      .addCase(markAllComplete.fulfilled, (state, action) => {
        state.todos = action.payload
        state.lastUpdated = new Date().toISOString()
      })
  },
})

export const { clearError, setTodos } = todoSlice.actions
export default todoSlice.reducer

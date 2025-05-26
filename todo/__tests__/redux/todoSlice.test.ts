import { configureStore } from "@reduxjs/toolkit"
import todoReducer, {
  setTodos,
  clearError,
  fetchTodos,
  createTodo,
  deleteTodo,
  toggleTodo,
} from "@/lib/redux/slices/todoSlice"
import type { Todo } from "@/lib/types"

// Mock the API
jest.mock("@/lib/api", () => ({
  api: {
    getTodos: jest.fn(),
    createTodo: jest.fn(),
    updateTodo: jest.fn(),
    deleteTodo: jest.fn(),
    toggleTodo: jest.fn(),
  },
}))

const mockTodo: Todo = {
  id: "1",
  title: "Test Todo",
  description: "Test Description",
  completed: false,
  createdAt: "2023-01-01T00:00:00.000Z",
  updatedAt: "2023-01-01T00:00:00.000Z",
}

describe("todoSlice", () => {
  let store: ReturnType<typeof configureStore>

  beforeEach(() => {
    store = configureStore({
      reducer: {
        todos: todoReducer,
      },
    })
  })

  describe("reducers", () => {
    it("should handle setTodos", () => {
      const todos = [mockTodo]
      store.dispatch(setTodos(todos))

      const state = store.getState().todos
      expect(state.todos).toEqual(todos)
      expect(state.lastUpdated).toBeTruthy()
    })

    it("should handle clearError", () => {
      // First set an error
      store.dispatch(fetchTodos.rejected(new Error("Test error"), "", undefined))
      expect(store.getState().todos.error).toBeTruthy()

      // Then clear it
      store.dispatch(clearError())
      expect(store.getState().todos.error).toBeNull()
    })
  })

  describe("async thunks", () => {
    it("should handle fetchTodos.pending", () => {
      store.dispatch(fetchTodos.pending("", undefined))

      const state = store.getState().todos
      expect(state.loading).toBe(true)
      expect(state.error).toBeNull()
    })

    it("should handle fetchTodos.fulfilled", () => {
      const todos = [mockTodo]
      store.dispatch(fetchTodos.fulfilled(todos, "", undefined))

      const state = store.getState().todos
      expect(state.loading).toBe(false)
      expect(state.todos).toEqual(todos)
      expect(state.lastUpdated).toBeTruthy()
    })

    it("should handle fetchTodos.rejected", () => {
      const errorMessage = "Failed to fetch todos"
      store.dispatch(fetchTodos.rejected(new Error(errorMessage), "", undefined))

      const state = store.getState().todos
      expect(state.loading).toBe(false)
      expect(state.error).toBe(errorMessage)
    })

    it("should handle createTodo.fulfilled", () => {
      store.dispatch(createTodo.fulfilled(mockTodo, "", { title: "Test Todo" }))

      const state = store.getState().todos
      expect(state.loading).toBe(false)
      expect(state.todos).toContain(mockTodo)
      expect(state.todos[0]).toEqual(mockTodo) // Should be added to the beginning
    })

    it("should handle deleteTodo.fulfilled", () => {
      // First add a todo
      store.dispatch(setTodos([mockTodo]))

      // Then delete it
      store.dispatch(deleteTodo.fulfilled("1", "", "1"))

      const state = store.getState().todos
      expect(state.todos).toHaveLength(0)
    })

    it("should handle toggleTodo.fulfilled", () => {
      // First add a todo
      store.dispatch(setTodos([mockTodo]))

      // Then toggle it
      const toggledTodo = { ...mockTodo, completed: true }
      store.dispatch(toggleTodo.fulfilled(toggledTodo, "", "1"))

      const state = store.getState().todos
      expect(state.todos[0].completed).toBe(true)
    })
  })

  describe("initial state", () => {
    it("should have correct initial state", () => {
      const state = store.getState().todos
      expect(state.todos).toEqual([])
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
      expect(state.lastUpdated).toBeNull()
    })
  })
})

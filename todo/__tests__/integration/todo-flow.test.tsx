import type React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Provider } from "react-redux"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { configureStore } from "@reduxjs/toolkit"
import { TodoForm } from "@/components/todo-form"
import todoReducer from "@/lib/redux/slices/todoSlice"
import uiReducer from "@/lib/redux/slices/uiSlice"
import type { Todo } from "@/lib/types"

// Mock the API
const mockApi = {
  getTodos: jest.fn(),
  createTodo: jest.fn(),
  updateTodo: jest.fn(),
  deleteTodo: jest.fn(),
  toggleTodo: jest.fn(),
}

jest.mock("@/lib/api", () => ({
  api: mockApi,
}))

const createTestStore = () => {
  return configureStore({
    reducer: {
      todos: todoReducer,
      ui: uiReducer,
    },
  })
}

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const store = createTestStore()
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  )
}

describe("Todo Flow Integration", () => {
  const user = userEvent.setup()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should complete the full todo lifecycle", async () => {
    const mockTodo: Todo = {
      id: "1",
      title: "Test Todo",
      description: "Test Description",
      completed: false,
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-01-01T00:00:00.000Z",
    }

    // Mock API responses
    mockApi.createTodo.mockResolvedValue({
      data: mockTodo,
      message: "Todo created",
      success: true,
    })

    render(
      <TestWrapper>
        <TodoForm />
      </TestWrapper>,
    )

    // Step 1: Create a new todo
    const titleInput = screen.getByPlaceholderText("Enter a task to add to your todo list")
    const descriptionInput = screen.getByPlaceholderText("Description (optional)")
    const submitButton = screen.getByRole("button", { name: /add task/i })

    await user.type(titleInput, "Test Todo")
    await user.type(descriptionInput, "Test Description")
    await user.click(submitButton)

    // Verify API was called
    await waitFor(() => {
      expect(mockApi.createTodo).toHaveBeenCalledWith({
        title: "Test Todo",
        description: "Test Description",
      })
    })

    // Verify form was reset
    expect(titleInput).toHaveValue("")
    expect(descriptionInput).toHaveValue("")
  })

  it("should handle API errors gracefully", async () => {
    // Mock API to return error
    mockApi.createTodo.mockRejectedValue(new Error("Network error"))

    render(
      <TestWrapper>
        <TodoForm />
      </TestWrapper>,
    )

    const titleInput = screen.getByPlaceholderText("Enter a task to add to your todo list")
    const submitButton = screen.getByRole("button", { name: /add task/i })

    await user.type(titleInput, "Test Todo")
    await user.click(submitButton)

    // Verify API was called
    await waitFor(() => {
      expect(mockApi.createTodo).toHaveBeenCalled()
    })

    // Form should not reset on error
    expect(titleInput).toHaveValue("Test Todo")
  })

  it("should validate form inputs", async () => {
    render(
      <TestWrapper>
        <TodoForm />
      </TestWrapper>,
    )

    const submitButton = screen.getByRole("button", { name: /add task/i })

    // Try to submit empty form
    await user.click(submitButton)

    // Should show validation error
    await waitFor(() => {
      expect(screen.getByText("Title is required")).toBeInTheDocument()
    })

    // API should not be called
    expect(mockApi.createTodo).not.toHaveBeenCalled()
  })
})

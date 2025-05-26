import type React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Provider } from "react-redux"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { configureStore } from "@reduxjs/toolkit"
import { TodoForm } from "@/components/todo-form"
import todoReducer from "@/lib/redux/slices/todoSlice"
import uiReducer from "@/lib/redux/slices/uiSlice"

// Mock the API
jest.mock("@/lib/api", () => ({
  api: {
    createTodo: jest.fn(),
  },
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

describe("TodoForm", () => {
  const user = userEvent.setup()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders the form correctly", () => {
    render(
      <TestWrapper>
        <TodoForm />
      </TestWrapper>,
    )

    expect(screen.getByText("Add New Task")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Enter a task to add to your todo list")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Description (optional)")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /add task/i })).toBeInTheDocument()
  })

  it("shows validation error for empty title", async () => {
    render(
      <TestWrapper>
        <TodoForm />
      </TestWrapper>,
    )

    const submitButton = screen.getByRole("button", { name: /add task/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText("Title is required")).toBeInTheDocument()
    })
  })

  it("submits form with valid data", async () => {
    render(
      <TestWrapper>
        <TodoForm />
      </TestWrapper>,
    )

    const titleInput = screen.getByPlaceholderText("Enter a task to add to your todo list")
    const descriptionInput = screen.getByPlaceholderText("Description (optional)")
    const submitButton = screen.getByRole("button", { name: /add task/i })

    await user.type(titleInput, "Test todo")
    await user.type(descriptionInput, "Test description")
    await user.click(submitButton)

    // Form should reset after submission
    await waitFor(() => {
      expect(titleInput).toHaveValue("")
      expect(descriptionInput).toHaveValue("")
    })
  })

  it("shows validation error for title that is too long", async () => {
    render(
      <TestWrapper>
        <TodoForm />
      </TestWrapper>,
    )

    const titleInput = screen.getByPlaceholderText("Enter a task to add to your todo list")
    const longTitle = "a".repeat(201) // Exceeds 200 character limit

    await user.type(titleInput, longTitle)

    const submitButton = screen.getByRole("button", { name: /add task/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText("Title must be less than 200 characters")).toBeInTheDocument()
    })
  })
})

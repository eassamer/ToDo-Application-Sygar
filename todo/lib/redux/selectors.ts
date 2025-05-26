import { createSelector } from "@reduxjs/toolkit"
import type { RootState } from "./store"

// Basic selectors
export const selectTodos = (state: RootState) => state.todos.todos
export const selectTodosLoading = (state: RootState) => state.todos.loading
export const selectTodosError = (state: RootState) => state.todos.error
export const selectLastUpdated = (state: RootState) => state.todos.lastUpdated

export const selectFilters = (state: RootState) => state.ui.filters
export const selectUiLoading = (state: RootState) => state.ui.isLoading
export const selectTheme = (state: RootState) => state.ui.theme
export const selectSidebarOpen = (state: RootState) => state.ui.sidebarOpen

// Memoized selectors
export const selectFilteredTodos = createSelector([selectTodos, selectFilters], (todos, filters) => {
  let filtered = todos

  // Apply search filter
  if (filters.search) {
    filtered = filtered.filter(
      (todo) =>
        todo.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        (todo.description && todo.description.toLowerCase().includes(filters.search.toLowerCase())),
    )
  }

  // Apply completed filter
  if (!filters.showCompleted) {
    filtered = filtered.filter((todo) => !todo.completed)
  }

  // Apply sorting
  filtered.sort((a, b) => {
    switch (filters.sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case "alphabetical":
        return a.title.localeCompare(b.title)
      case "completed":
        return Number(b.completed) - Number(a.completed)
      default:
        return 0
    }
  })

  return filtered
})

export const selectTodoStats = createSelector([selectTodos], (todos) => {
  const total = todos.length
  const completed = todos.filter((todo) => todo.completed).length
  const remaining = total - completed
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

  return {
    total,
    completed,
    remaining,
    completionRate,
  }
})

export const selectCompletedTodos = createSelector([selectTodos], (todos) => todos.filter((todo) => todo.completed))

export const selectIncompleteTodos = createSelector([selectTodos], (todos) => todos.filter((todo) => !todo.completed))

export const selectTodoById = (id: string) =>
  createSelector([selectTodos], (todos) => todos.find((todo) => todo.id === id))

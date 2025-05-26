import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { TodoFilters } from "@/lib/types"

interface UiState {
  filters: TodoFilters
  isLoading: boolean
  theme: "light" | "dark" | "system"
  sidebarOpen: boolean
}

const initialState: UiState = {
  filters: {
    search: "",
    sortBy: "newest",
    showCompleted: true,
  },
  isLoading: false,
  theme: "system",
  sidebarOpen: false,
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload
    },
    setSortBy: (state, action: PayloadAction<TodoFilters["sortBy"]>) => {
      state.filters.sortBy = action.payload
    },
    setShowCompleted: (state, action: PayloadAction<boolean>) => {
      state.filters.showCompleted = action.payload
    },
    setFilters: (state, action: PayloadAction<Partial<TodoFilters>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setTheme: (state, action: PayloadAction<UiState["theme"]>) => {
      state.theme = action.payload
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    resetFilters: (state) => {
      state.filters = initialState.filters
    },
  },
})

export const { setSearch, setSortBy, setShowCompleted, setFilters, setLoading, setTheme, toggleSidebar, resetFilters } =
  uiSlice.actions

export default uiSlice.reducer

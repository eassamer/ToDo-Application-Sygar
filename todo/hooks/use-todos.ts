"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import {
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodo,
  deleteCompletedTodos,
  markAllComplete,
} from "@/lib/redux/slices/todoSlice"
import { selectTodos, selectTodosLoading, selectTodosError } from "@/lib/redux/selectors"
import { api } from "@/lib/api"
import { toast } from "sonner"
import type { CreateTodoRequest, UpdateTodoRequest } from "@/lib/types"

export function useTodos() {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  const todos = useAppSelector(selectTodos)
  const loading = useAppSelector(selectTodosLoading)
  const error = useAppSelector(selectTodosError)

  // Fetch todos with React Query
  const { data: todosData, isLoading: queryLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const response = await api.getTodos()
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Create todo mutation
  const createTodoMutation = useMutation({
    mutationFn: (todoData: CreateTodoRequest) => dispatch(createTodo(todoData)).unwrap(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] })
      toast.success("Todo created successfully!")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create todo")
    },
  })

  // Update todo mutation
  const updateTodoMutation = useMutation({
    mutationFn: (todoData: UpdateTodoRequest) => dispatch(updateTodo(todoData)).unwrap(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] })
      toast.success("Todo updated successfully!")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update todo")
    },
  })

  // Delete todo mutation
  const deleteTodoMutation = useMutation({
    mutationFn: (id: string) => dispatch(deleteTodo(id)).unwrap(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] })
      toast.success("Todo deleted successfully!")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete todo")
    },
  })

  // Toggle todo mutation
  const toggleTodoMutation = useMutation({
    mutationFn: (id: string) => dispatch(toggleTodo(id)).unwrap(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] })
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to toggle todo")
    },
  })

  // Delete completed todos mutation
  const deleteCompletedMutation = useMutation({
    mutationFn: () => dispatch(deleteCompletedTodos()).unwrap(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] })
      toast.success("Completed todos deleted!")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete completed todos")
    },
  })

  // Mark all complete mutation
  const markAllCompleteMutation = useMutation({
    mutationFn: () => dispatch(markAllComplete()).unwrap(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] })
      toast.success("All todos marked as complete!")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to mark all complete")
    },
  })

  return {
    todos: todosData || todos,
    loading: loading || queryLoading,
    error,
    createTodo: createTodoMutation.mutate,
    updateTodo: updateTodoMutation.mutate,
    deleteTodo: deleteTodoMutation.mutate,
    toggleTodo: toggleTodoMutation.mutate,
    deleteCompleted: deleteCompletedMutation.mutate,
    markAllComplete: markAllCompleteMutation.mutate,
    isCreating: createTodoMutation.isPending,
    isUpdating: updateTodoMutation.isPending,
    isDeleting: deleteTodoMutation.isPending,
    isToggling: toggleTodoMutation.isPending,
  }
}

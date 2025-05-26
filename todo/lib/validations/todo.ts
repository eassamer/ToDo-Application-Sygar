import { z } from "zod"

export const createTodoSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters").trim(),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
})

export const updateTodoSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters").trim().optional(),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  completed: z.boolean().optional(),
})

export const todoFiltersSchema = z.object({
  search: z.string().optional(),
  sortBy: z.enum(["newest", "oldest", "alphabetical", "completed"]).optional(),
  showCompleted: z.boolean().optional(),
})

export type CreateTodoInput = z.infer<typeof createTodoSchema>
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>
export type TodoFiltersInput = z.infer<typeof todoFiltersSchema>

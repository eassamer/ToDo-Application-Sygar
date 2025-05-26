"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createTodoSchema, type CreateTodoInput } from "@/lib/validations/todo"
import { useTodos } from "@/hooks/use-todos"

export function TodoForm() {
  const { createTodo, isCreating } = useTodos()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTodoInput>({
    resolver: zodResolver(createTodoSchema),
  })

  const onSubmit = (data: CreateTodoInput) => {
    createTodo(data)
    reset()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add New Task
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input {...register("title")} placeholder="Enter a task to add to your todo list" disabled={isCreating} />
            {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <Input {...register("description")} placeholder="Description (optional)" disabled={isCreating} />
            {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>}
          </div>

          <Button type="submit" disabled={isCreating} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            {isCreating ? "Adding..." : "Add Task"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { toast } from "sonner"

interface TodoItemProps {
  id: string
  title: string
  completed: boolean
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
}

const TodoItem: React.FC<TodoItemProps> = ({ id, title, completed, onToggle, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleToggle = () => {
    onToggle(id, !completed)
    toast.success("Todo updated")
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete(id)
      toast.success("Todo deleted")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <li className="flex items-center justify-between py-2 border-b border-gray-200">
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`todo-${id}`}
          className="mr-2 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          checked={completed}
          onChange={handleToggle}
        />
        <label htmlFor={`todo-${id}`} className={`text-gray-700 ${completed ? "line-through text-gray-500" : ""}`}>
          {title}
        </label>
      </div>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:bg-red-300 disabled:cursor-not-allowed"
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
    </li>
  )
}

export default TodoItem

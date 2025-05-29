'use client'

import { useState, useEffect } from 'react'
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Circle,
  Trash2,
  Moon,
  Sun,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTheme } from 'next-themes'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import type { Todo } from '@/lib/types'

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [loading, setLoading] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Fetch todos from API on component mount
  useEffect(() => {
    fetchTodos()
  }, [])

  // Prevent hydration mismatch for theme
  useEffect(() => {
    setMounted(true)
  }, [])

  // Debug theme changes
  useEffect(() => {
    if (mounted) {
      console.log('Current theme:', theme)
      document.documentElement.classList.toggle('dark', theme === 'dark')
    }
  }, [theme, mounted])

  const fetchTodos = async () => {
    try {
      setLoading(true)
      const response = await api.getTodos()
      setTodos(response.data)
    } catch (error) {
      toast.error('Failed to fetch todos')
      console.error('Error fetching todos:', error)
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async (title: string) => {
    if (!title.trim()) return

    try {
      const response = await api.createTodo({ title: title.trim() })
      setTodos(prev => [response.data, ...prev])
      toast.success('Todo added successfully!')
    } catch (error) {
      toast.error('Failed to add todo')
      console.error('Error adding todo:', error)
    }
  }

  const toggleTodo = async (id: string) => {
    try {
      const response = await api.toggleTodo(id)
      setTodos(prev =>
        prev.map(todo => (todo.id === id ? response.data : todo))
      )
      toast.success('Todo updated!')
    } catch (error) {
      toast.error('Failed to update todo')
      console.error('Error toggling todo:', error)
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      await api.deleteTodo(id)
      setTodos(prev => prev.filter(todo => todo.id !== id))
      toast.success('Todo deleted!')
    } catch (error) {
      toast.error('Failed to delete todo')
      console.error('Error deleting todo:', error)
    }
  }

  const deleteCompleted = async () => {
    try {
      await api.deleteCompletedTodos()
      setTodos(prev => prev.filter(todo => !todo.completed))
      toast.success('Completed todos deleted!')
    } catch (error) {
      toast.error('Failed to delete completed todos')
      console.error('Error deleting completed todos:', error)
    }
  }

  const markAllComplete = async () => {
    try {
      const response = await api.markAllComplete()
      setTodos(response.data)
      toast.success('All todos marked as complete!')
    } catch (error) {
      toast.error('Failed to mark all complete')
      console.error('Error marking all complete:', error)
    }
  }

  const toggleTheme = () => {
    console.log('Toggling theme from:', theme)
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const filteredAndSortedTodos = todos
    .filter(todo => todo.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        case 'oldest':
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          )
        case 'alphabetical':
          return a.title.localeCompare(b.title)
        case 'completed':
          return Number(b.completed) - Number(a.completed)
        default:
          return 0
      }
    })

  const completedCount = todos.filter(todo => todo.completed).length
  const totalCount = todos.length

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-white">Loading todos...</p>
        </div>
      </div>
    )
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
              Todo App
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Stay organized and productive
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full bg-white dark:bg-gray-800 backdrop-blur-sm border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-lg"
          >
            {!mounted ? (
              <div className="h-5 w-5" />
            ) : theme === 'dark' ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-gray-700" />
            )}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="card-hover bg-white dark:bg-gray-800 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Total Tasks
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {totalCount}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <Filter className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover bg-white dark:bg-gray-800 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Completed
                  </p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {completedCount}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover bg-white dark:bg-gray-800 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Remaining
                  </p>
                  <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                    {totalCount - completedCount}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
                  <Circle className="h-6 w-6 text-orange-600 dark:text-orange-300" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Todo */}
        <Card className="mb-6 bg-white dark:bg-gray-800 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Plus className="h-5 w-5" />
              Add New Task
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter a task to add to your todo list"
                className="flex-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 dark:focus:border-blue-400"
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    const target = e.target as HTMLInputElement
                    addTodo(target.value)
                    target.value = ''
                  }
                }}
              />
              <Button
                onClick={e => {
                  const input = e.currentTarget.parentElement?.querySelector(
                    'input'
                  ) as HTMLInputElement
                  if (input) {
                    addTodo(input.value)
                    input.value = ''
                  }
                }}
                className="px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search and Controls */}
        <Card className="mb-6 bg-white dark:bg-gray-800 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-lg">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-400" />
                <Input
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 dark:focus:border-blue-400"
                />
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectItem
                    value="newest"
                    className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700"
                  >
                    Newest first
                  </SelectItem>
                  <SelectItem
                    value="oldest"
                    className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700"
                  >
                    Oldest first
                  </SelectItem>
                  <SelectItem
                    value="alphabetical"
                    className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700"
                  >
                    Alphabetical
                  </SelectItem>
                  <SelectItem
                    value="completed"
                    className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700"
                  >
                    Completed first
                  </SelectItem>
                </SelectContent>
              </Select>

              {todos.length > 0 && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={markAllComplete}
                    disabled={completedCount === totalCount}
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                  >
                    Mark All Complete
                  </Button>
                  <Button
                    variant="outline"
                    onClick={deleteCompleted}
                    disabled={completedCount === 0}
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 disabled:opacity-50"
                  >
                    Delete Completed
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Todo List */}
        <Card className="bg-white dark:bg-gray-800 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              Your Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredAndSortedTodos.length === 0 ? (
              <div className="text-center py-12">
                <Circle className="h-16 w-16 text-gray-300 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {todos.length === 0 ? 'No todos found' : 'No matching tasks'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {todos.length === 0
                    ? 'Add some tasks to get started!'
                    : 'Try adjusting your search or filters'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredAndSortedTodos.map(todo => (
                  <div
                    key={todo.id}
                    className={`flex items-center gap-3 p-4 rounded-lg border transition-all hover:shadow-md ${
                      todo.completed
                        ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                        : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleTodo(todo.id)}
                      className="p-0 h-auto hover:bg-transparent"
                    >
                      {todo.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      )}
                    </Button>

                    <div className="flex-1">
                      <p
                        className={`${
                          todo.completed
                            ? 'line-through text-gray-500 dark:text-gray-400'
                            : 'text-gray-900 dark:text-white'
                        }`}
                      >
                        {todo.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(todo.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {todo.completed && (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      >
                        Completed
                      </Badge>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTodo(todo.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

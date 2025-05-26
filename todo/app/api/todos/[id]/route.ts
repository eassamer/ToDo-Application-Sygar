import { type NextRequest, NextResponse } from "next/server";
import type { UpdateTodoRequest } from "@/lib/types";
import { todoStorage } from "@/lib/storage";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const todos = todoStorage.getTodos();
    const todo = todos.find((t) => t.id === id);

    if (!todo) {
      return NextResponse.json(
        {
          data: null,
          message: "Todo not found",
          success: false,
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      data: todo,
      message: "Todo fetched successfully",
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        data: null,
        message: "Failed to fetch todo",
        success: false,
      },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body: Omit<UpdateTodoRequest, "id"> = await request.json();
    const updatedTodo = todoStorage.updateTodo(id, body);

    if (!updatedTodo) {
      return NextResponse.json(
        {
          data: null,
          message: "Todo not found",
          success: false,
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      data: updatedTodo,
      message: "Todo updated successfully",
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        data: null,
        message: "Failed to update todo",
        success: false,
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const deleted = todoStorage.deleteTodo(id);

    if (!deleted) {
      return NextResponse.json(
        {
          data: null,
          message: "Todo not found",
          success: false,
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      data: null,
      message: "Todo deleted successfully",
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        data: null,
        message: "Failed to delete todo",
        success: false,
      },
      { status: 500 },
    );
  }
}

import { type NextRequest, NextResponse } from "next/server";
import type { CreateTodoRequest } from "@/lib/types";
import { todoStorage } from "@/lib/storage";

export async function GET() {
  try {
    const todos = todoStorage.getTodos();
    return NextResponse.json({
      data: todos,
      message: "Todos fetched successfully",
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        data: null,
        message: "Failed to fetch todos",
        success: false,
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateTodoRequest = await request.json();

    if (!body.title || body.title.trim() === "") {
      return NextResponse.json(
        {
          data: null,
          message: "Title is required",
          success: false,
        },
        { status: 400 },
      );
    }

    const newTodo = todoStorage.addTodo({
      title: body.title.trim(),
      description: body.description || "",
      completed: false,
    });

    return NextResponse.json(
      {
        data: newTodo,
        message: "Todo created successfully",
        success: true,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        data: null,
        message: "Failed to create todo",
        success: false,
      },
      { status: 500 },
    );
  }
}

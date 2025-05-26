import { NextResponse } from "next/server";
import { todoStorage } from "@/lib/storage";

export async function PATCH() {
  try {
    const updatedTodos = todoStorage.markAllComplete();

    return NextResponse.json({
      data: updatedTodos,
      message: "All todos marked as complete",
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        data: null,
        message: "Failed to mark all todos as complete",
        success: false,
      },
      { status: 500 },
    );
  }
}

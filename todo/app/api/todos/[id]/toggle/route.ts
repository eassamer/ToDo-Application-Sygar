import { type NextRequest, NextResponse } from "next/server";
import { todoStorage } from "@/lib/storage";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const updatedTodo = todoStorage.toggleTodo(id);

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
      message: "Todo toggled successfully",
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        data: null,
        message: "Failed to toggle todo",
        success: false,
      },
      { status: 500 },
    );
  }
}

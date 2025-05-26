import { NextResponse } from "next/server";
import { todoStorage } from "@/lib/storage";

export async function DELETE() {
  try {
    const deletedCount = todoStorage.deleteCompleted();

    return NextResponse.json({
      data: null,
      message: `${deletedCount} completed todos deleted successfully`,
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        data: null,
        message: "Failed to delete completed todos",
        success: false,
      },
      { status: 500 },
    );
  }
}

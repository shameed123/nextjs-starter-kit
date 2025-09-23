import { NextRequest, NextResponse } from "next/server";
import { assignUserRole } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    await assignUserRole(userId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in assign-role API:", error);
    return NextResponse.json(
      { error: "Failed to assign role" },
      { status: 500 }
    );
  }
}
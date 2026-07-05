import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";

export async function GET() {
  try {
    const conn = await dbConnect();
    return NextResponse.json({
      success: true,
      data: { database: conn.connection.name, state: "connected" },
    });
  } catch (err) {
    console.error("Health check failed:", err);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "DB_CONNECTION_FAILED",
          message: "Could not reach database",
        },
      },
      { status: 500 }
    );
  }
}

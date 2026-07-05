import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/user";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ success: false }, { status: 404 });
  }

  try {
    await dbConnect();

    const existing = await User.findOne({ email: "admin@arikconsulting.ca" });
    if (existing) {
      return NextResponse.json({
        success: true,
        data: { note: "already seeded", id: existing._id },
      });
    }

    const admin = new User({
      email: "admin@arikconsulting.ca",
      name: "Arik Admin",
      role: "staff",
      staffRole: "admin",
      status: "active",
    });
    await admin.setPassword("ChangeMe123!");
    await admin.save();

    return NextResponse.json({ success: true, data: { id: admin._id } });
  } catch (err) {
    // Dev-only route, so surfacing the real error message in the response
    // is acceptable here and makes debugging much faster.
    console.error("dev-seed failed:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: { code: "SEED_FAILED", message } },
      { status: 500 }
    );
  }
}

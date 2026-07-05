import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/user";

// Development-only seeder. SELF-HEALING: if the admin already exists it
// resets the password to the known dev value and forces status "active",
// so a bad earlier seed (wrong database, wrong hash) fixes itself.
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ success: false }, { status: 404 });
  }

  try {
    const conn = await dbConnect();
    const database = conn.connection.name; // which DB are we ACTUALLY in?

    let admin = await User.findOne({ email: "admin@arikconsulting.ca" }).select(
      "+passwordHash"
    );

    let action: string;
    if (admin) {
      admin.status = "active";
      await admin.setPassword("ChangeMe123!");
      await admin.save();
      action = "existing admin reset to known dev password";
    } else {
      admin = new User({
        email: "admin@arikconsulting.ca",
        name: "Arik Admin",
        role: "staff",
        staffRole: "admin",
        status: "active",
      });
      await admin.setPassword("ChangeMe123!");
      await admin.save();
      action = "admin created";
    }

    const userCount = await User.countDocuments();

    return NextResponse.json({
      success: true,
      data: { database, action, id: admin._id, userCount },
    });
  } catch (err) {
    console.error("dev-seed failed:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: { code: "SEED_FAILED", message } },
      { status: 500 }
    );
  }
}

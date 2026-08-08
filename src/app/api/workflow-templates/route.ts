import { ok, handleApiError } from "@/lib/api";
import { requireStaff } from "@/lib/guards";
import { dbConnect } from "@/lib/db";
import { WorkflowTemplate } from "@/models/workflow-template";

export async function GET() {
  try {
    await requireStaff();
    await dbConnect();
    const templates = await WorkflowTemplate.find({ isActive: true }).sort({ label: 1 }).lean();
    return ok(templates);
  } catch (err) {
    return handleApiError(err);
  }
}
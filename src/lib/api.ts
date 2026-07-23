import { NextResponse } from "next/server";

export function ok<T>(data: T, init?: { status?: number; meta?: object }) {
  return NextResponse.json(
    { success: true, data, ...(init?.meta ? { meta: init.meta } : {}) },
    { status: init?.status ?? 200 }
  );
}

export function fail(
  code: string,
  message: string,
  status = 400,
  fields?: Record<string, string[]>
) {
  return NextResponse.json(
    { success: false, error: { code, message, ...(fields ? { fields } : {}) } },
    { status }
  );
}

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status = 400
  ) {
    super(message);
  }
}

/** Turns thrown errors into consistent HTTP responses. */
export function handleApiError(err: unknown) {
  if (err instanceof ApiError) return fail(err.code, err.message, err.status);
  console.error("[api] unhandled:", err);
  return fail("INTERNAL", "Something went wrong", 500);
}

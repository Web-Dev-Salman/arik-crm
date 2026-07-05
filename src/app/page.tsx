import { redirect } from "next/navigation";

// The root URL has no content of its own — send visitors to the portal.
// The proxy will bounce unauthenticated users to /login automatically.
export default function RootPage() {
  redirect("/dashboard");
}

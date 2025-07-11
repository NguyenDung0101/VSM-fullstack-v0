import { redirect } from "next/navigation";

export default function AdminHomePage() {
  // Redirect to admin dashboard by default
  redirect("/admin");
}

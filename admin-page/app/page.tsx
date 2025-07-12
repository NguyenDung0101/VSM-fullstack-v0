import { redirect } from "next/navigation";

export default function AdminHomePage() {
  // Redirect đến admin page trên port 3002
  redirect("http://localhost:3002/admin");
}

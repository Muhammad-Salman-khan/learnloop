import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect("/login");
  const { role } = session.user;

  if (role === "superAdmin") {
    redirect("/dashboard/superadmin");
  } else if (role === "admin") {
    redirect("/dashboard/admin");
  } else if (role === "staff") {
    redirect("/dashboard/staff");
  } else if (role === "teacher") {
    redirect("/dashboard/teacher");
  } else if (role === "student") {
    redirect("/dashboard/student");
  } else {
    redirect("/login");
  }
};

export default page;

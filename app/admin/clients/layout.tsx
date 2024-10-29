import { GetUserRole } from "@/app/_actions/user"
import { redirect } from "next/navigation"

export default async function ClientsLayout({ children }: { children: React.ReactNode }) {
    const role = await GetUserRole()

    if (role !== "admin") {
        redirect("/admin/dashboard?error=unauthorized")
    }

    return <>{children}</>
}
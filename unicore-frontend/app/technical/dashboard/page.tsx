import { auth } from "@/auth";
import Dashboard from "./dashboard-main";

export default async function DashboardPage() {
    const session = await auth()
    return <Dashboard session={session} />
}
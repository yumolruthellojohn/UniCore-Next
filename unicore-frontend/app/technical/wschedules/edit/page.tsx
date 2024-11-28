import { auth } from "@/auth";
import EditWorkSchedule from "./edit-schedule";

export default async function RequestsPage() {
    const session = await auth()
    return <EditWorkSchedule session={session} />
}
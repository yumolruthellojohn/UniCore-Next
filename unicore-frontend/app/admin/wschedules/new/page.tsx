import { auth } from "@/auth";
import AddWorkSchedule from "./new-schedule";

export default async function RequestsPage() {
    const session = await auth()
    return <AddWorkSchedule session={session} />
}
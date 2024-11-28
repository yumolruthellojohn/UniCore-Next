import { auth } from "@/auth";
import ScheduleView from "./view-schedule";

export default async function RequestsPage() {
    const session = await auth()
    return <ScheduleView session={session} />
}
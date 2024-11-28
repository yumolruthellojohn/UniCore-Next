import { auth } from "@/auth";
import Schedules from "./schedules";

export default async function RequestsPage() {
    const session = await auth()
    return <Schedules session={session} />
}
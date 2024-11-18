import { auth } from "@/auth";
import ReserveRoomQueueView from "./view-reserve-facility-queue"

export default async function ViewRequestPage() {
    const session = await auth()
    return <ReserveRoomQueueView session={session} />
}
import { auth } from "@/auth";
import ReserveItemQueueView from "./view-reserve-item-queue"

export default async function ViewRequestPage() {
    const session = await auth()
    return <ReserveItemQueueView session={session} />
}
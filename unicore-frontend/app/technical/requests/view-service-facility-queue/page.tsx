import { auth } from "@/auth";
import ServiceRoomQueueView from "./view-service-facility-queue"

export default async function ViewRequestPage() {
    const session = await auth()
    return <ServiceRoomQueueView session={session} />
}
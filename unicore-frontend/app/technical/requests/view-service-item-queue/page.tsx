import { auth } from "@/auth";
import ServiceItemQueueView from "./view-service-item-queue"

export default async function ViewRequestPage() {
    const session = await auth()
    return <ServiceItemQueueView session={session} />
}
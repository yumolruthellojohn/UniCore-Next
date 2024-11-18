import { auth } from "@/auth";
import NewServiceRoom from "./service-room";

export default async function NewServiceRoomPage() {
    const session = await auth()
    return <NewServiceRoom session={session} />
}
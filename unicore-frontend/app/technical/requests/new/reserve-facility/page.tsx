import { auth } from "@/auth";
import NewReserveRoom from "./reserve-room";

export default async function NewReserveRoomPage() {
    const session = await auth()
    return <NewReserveRoom session={session} />
}
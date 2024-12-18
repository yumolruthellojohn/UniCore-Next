import { auth } from "@/auth";
import NewReserveItem from "./reserve-item";

export default async function NewReserveItemPage() {
    const session = await auth()
    return <NewReserveItem session={session} />
}
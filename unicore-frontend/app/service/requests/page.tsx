import { auth } from "@/auth";
import Requests from "./requests";

export default async function RequestsPage() {
    const session = await auth()
    return <Requests session={session} />
}
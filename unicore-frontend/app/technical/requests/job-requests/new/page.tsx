import { auth } from "@/auth";
import AddJobRequest from "./job-request";

export default async function AddJobRequestPage() {
    const session = await auth()
    return <AddJobRequest session={session} />
}
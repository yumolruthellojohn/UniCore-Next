import { auth } from "@/auth";
import EditJobRequestStatus from "./edit-job-request-status";

export default async function AddJobRequestPage() {
    const session = await auth()
    return <EditJobRequestStatus session={session} />
}
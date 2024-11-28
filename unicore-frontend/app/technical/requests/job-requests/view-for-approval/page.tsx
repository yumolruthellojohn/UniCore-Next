import { auth } from "@/auth";
import JobRequestApproval from "./job-request-approval";

export default async function AddJobRequestPage() {
    const session = await auth()
    return <JobRequestApproval session={session} />
}
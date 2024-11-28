import { auth } from "@/auth";
import JobRequests from "./job-request-main";

export default async function RequestsPage() {
    const session = await auth()
    return <JobRequests session={session} />
}
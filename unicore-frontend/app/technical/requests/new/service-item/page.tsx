import { auth } from "@/auth";
import NewServiceItem from "./service-item";

export default async function NewServiceItemPage() {
    const session = await auth()
    return <NewServiceItem session={session} />
}
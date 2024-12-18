import { auth } from "@/auth";
import AccountPage from "./account-main";

export default async function AccountMainPage() {
    const session = await auth()
    return <AccountPage session={session} />
}
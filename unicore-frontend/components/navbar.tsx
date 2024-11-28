import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { handleSignOut } from "@/app/actions/authActions";
import { NotificationBellTechnical } from "./notifications/notification-bell-technical";

export default async function Navbar() {
  const session = await auth();
  //const {data : session} = useSession();
  //const { session, status } = useCurrentSession();

  console.log({ session });
  
  return (
    <nav id="navbar" className="fixed top-0 left-0 right-0 flex justify-between items-center py-3 px-4 bg-white shadow-md z-10">
      <Link href="/" className="text-xl font-bold">
        UniCore
      </Link>
      {!session ? (
        <Link href="/auth/login">
          <Button variant="default">Log In</Button>
        </Link>
      ) : (
        <div className="flex items-center gap-2">
          <span className="mr-2 text-sm sm:text-base truncate max-w-[150px] sm:max-w-[400px]">
            <span className="block sm:hidden">{session.user.user_fname}</span>
            <span className="hidden sm:block">
                {session.user.user_fname} {session.user.user_lname}
            </span>
          </span>
          <NotificationBellTechnical userId={parseInt(session.user.user_id)} />
          <form action={handleSignOut}>
            <Button variant="default" type="submit">
              Log Out
            </Button>
          </form>
        </div>
      )}
    </nav>
  );
}
import Link from "next/link";
import Image from "next/image";
import head from '@/app/images/unicore_logo_head.png';
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { handleSignOut } from "@/app/actions/authActions";
import { NotificationBellTechnical } from "./notifications/notification-bell-technical";
import { NotificationBellNonTechnical } from "./notifications/notification-bell-nontechnical";

export default async function Navbar() {
  const session = await auth();
  //const {data : session} = useSession();
  //const { session, status } = useCurrentSession();

  console.log({ session });
  
  return (
    <nav id="navbar" className="fixed top-0 left-0 right-0 flex justify-between items-center py-3 px-4 bg-white shadow-md z-10">
      <Link href="/" className="text-xl font-bold">
        <div className="grid grid-cols-2 items-center">
          UniCore <Image 
            className="rounded-lg"
            src={head}
            alt="img"
            width={40}
            height={40}
            priority>
          </Image>
        </div>
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
          {session.user.user_type === "Technical Staff" ? (
            <NotificationBellTechnical userId={parseInt(session.user.user_id)} />
          ) : session.user.user_type === "Non-technical Staff" ? (
            <NotificationBellNonTechnical userId={parseInt(session.user.user_id)} />
          ) : (<></>)}
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
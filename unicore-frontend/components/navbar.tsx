import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { handleSignOut } from "@/app/actions/authActions";

export default async function Navbar() {
  const session = await auth();
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
          <span className="mr-2 text-sm sm:text-base truncate max-w-[150px] sm:max-w-[200px]">
            Logged in as: {session.user.name}
          </span>
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
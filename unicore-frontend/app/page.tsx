"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import logo from './images/unicore_logo_bg.png';
import { auth } from "@/auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";


export default function Home() {  
  //const session = await auth();
  const {data : session, status} = useSession();

  console.log("fetched status: " + status);
  const usertype = session?.user.user_type;
  console.log("fetched dept: " + usertype);
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="max-w-sm">
        <CardHeader>
          <Image
            className="rounded-lg"
            src={logo}
            alt="img"
            width={500}
            height={500}
            priority
          />
        </CardHeader>
        <CardContent>
          <CardTitle className="mb-2 text-2xl font-bold">
            Greetings from UCLM!
          </CardTitle>
          <p className="text-muted-foreground">
            This is a Web-based Service Management System. For internal use only.
          </p>
          <br />
          {usertype === "Administrator"? (
            <Link href="/admin/dashboard" className="">
              <Button className="w-full" variant="default">Go to Dashboard</Button>
            </Link>
            ) : usertype === "Technical Staff"? (
            <Link href="/technical/dashboard">
              <Button className="w-full" variant="default">Go to Dashboard</Button>
            </Link>
            ) : (
            <Link href="/nontechnical/dashboard">
              <Button className="w-full" variant="default">Go to Dashboard</Button>
            </Link>
            )
          }
        </CardContent>
      </Card>
    </main>
  );
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import logo from './images/unicore_logo_bg.png';

export default async function Home() {
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
        </CardContent>
      </Card>
    </main>
  );
}
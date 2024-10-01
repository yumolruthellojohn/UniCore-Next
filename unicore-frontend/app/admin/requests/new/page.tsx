import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Box, DoorClosed, Wrench } from "lucide-react"
import Link from "next/link"

export default function SelectRequestType() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Select Request Type</CardTitle>
          <Link href="/admin/requests" className="text-blue-500 hover:text-blue-700">
            Back
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RequestButton
              href="/admin/requests/new/reserve-item"
              icon={Box}
              label="Item Reservation"
            />
            <RequestButton
              href="/admin/requests/new/reserve-room"
              icon={DoorClosed}
              label="Room Reservation"
            />
            <RequestButton
              href="/admin/requests/new/service"
              icon={Wrench}
              label="Service"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function RequestButton({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) {
  return (
    <Link href={href} passHref legacyBehavior>
        <a className="w-full">
            <Button className="w-full h-64 flex flex-col items-center justify-center space-y-4">
                <Icon className="w-[150px] h-[150px] mx-4 my-4" />
                <span className="text-xl">{label}</span>
            </Button>
        </a>
    </Link>
  )
}

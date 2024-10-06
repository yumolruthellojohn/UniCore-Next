import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { FileBox, DoorClosed, PackageOpen, HousePlug } from "lucide-react"
import Link from "next/link"

export default function SelectRequestType() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Select Request Type</CardTitle>
          <Link href="/admin/requests" className="text-blue-500 hover:text-blue-700">
            Back
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <RequestButton
              href="/admin/requests/new/reserve-item"
              icon={FileBox}
              label="Item Reservation"
            />
            <RequestButton
              href="/admin/requests/new/reserve-room"
              icon={DoorClosed}
              label="Room Reservation"
            />
            <RequestButton
              href="/admin/requests/new/service-item"
              icon={PackageOpen}
              label="Service for Item"
            />
            <RequestButton
              href="/admin/requests/new/service-room"
              icon={HousePlug}
              label="Service for Room"
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

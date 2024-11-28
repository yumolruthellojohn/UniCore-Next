"use client";

import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import {
    LayoutList,
    Package2,
    DoorOpen,
    StickyNote,
    CalendarDays
} from "lucide-react";

export const sidebarItems = [
    {
        label: "Dashboard",
        href: "/technical/dashboard",
        icon: <LayoutList className="h-4 w-4" />
    },
    {
        label: "Requests",
        href: "",
        icon: <StickyNote className="h-4 w-4" />
    },
    {
        label: "Inventory",
        href: "/technical/inventory",
        icon: <Package2 className="h-4 w-4" />
    },
    {
        label: "Facilities",
        href: "/technical/facilities",
        icon: <DoorOpen className="h-4 w-4" />
    },
    {
      label: "W.S. Schedules",
      href: "/technical/wschedules",
      icon: <CalendarDays className="h-4 w-4" />
    }
]

export default function Sidebar() {
    const pathname = usePathname();
    const [isRequestsOpen, setRequestsOpen] = useState(false);

    return (
      <aside id="sidebar" className="hidden md:block fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="flex h-full flex-col gap-2 border-r bg-muted/40 w-[200px] lg:w-[220px] pt-2">
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {sidebarItems.map((item) => (
                <div key={item.label}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                      pathname === item.href ? "bg-muted text-primary" : ""
                    }`}
                    onClick={() => item.label === "Requests" && setRequestsOpen(!isRequestsOpen)}
                  >
                    {item.icon}  
                    {item.label}
                  </Link>
                  {item.label === "Requests" && (
                    <div
                      className={`ml-4 transition-all duration-300 ease-in-out ${isRequestsOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
                      style={{ height: isRequestsOpen ? 'auto' : '0' }}
                    >
                      <Link href="/technical/requests" className="block px-3 py-2 text-muted-foreground hover:text-primary">
                        Standard
                      </Link>
                      <Link href="/technical/requests/job-requests" className="block px-3 py-2 text-muted-foreground hover:text-primary">
                        BMO Job Requests
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      </aside>
    );
}
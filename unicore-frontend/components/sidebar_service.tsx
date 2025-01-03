"use client";

import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import {
    StickyNote,
    UserRound
} from "lucide-react";

export const sidebarItems = [
    {
        label: "Requests",
        href: "/service/requests",
        icon: <StickyNote className="h-4 w-4" />
    },
    {
      label: "My Account",
      href: "/service/account",
      icon: <UserRound className="h-4 w-4" />
    }
]

export default function Sidebar() {
    const pathname = usePathname();

    return (
      <aside id="sidebar" className="hidden md:block fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="flex h-full flex-col gap-2 border-r bg-muted/40 w-[200px] lg:w-[220px] pt-2">
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                {sidebarItems.map((sidebarItems) => (
                    <Link
                    key={sidebarItems.label}
                    href={sidebarItems.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                        pathname === sidebarItems.href ? "bg-muted text-primary" : ""
                    }`}
                    >
                    {sidebarItems.icon}  
                    {sidebarItems.label}
                    </Link>
                ))}
            </nav>
          </div>
        </div>
      </aside>
    );
}
"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import Link from "next/link";

import { sidebarItems } from "./sidebar_service";

export default function SidebarMobile() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const handleLinkClick = () => {
        setOpen(false);
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" id="sheet" className="flex flex-col">
            <nav className="grid gap-2 text-lg py-5 font-medium">
                {sidebarItems.map((sidebarItems) => (
                    <Link
                    key={sidebarItems.label}
                    href={sidebarItems.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                        pathname === sidebarItems.href ? "bg-muted text-primary" : ""
                    }`}
                    onClick={handleLinkClick}
                    >
                    {sidebarItems.icon}  
                    {sidebarItems.label}
                    </Link>
                ))}
            </nav>
          </SheetContent>
        </Sheet>
    );
}
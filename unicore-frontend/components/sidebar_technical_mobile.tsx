"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import Link from "next/link";

import { sidebarItems } from "./sidebar_technical";

export default function SidebarMobile() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [isRequestsOpen, setRequestsOpen] = useState(false);

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
                      <Link href="/technical/requests" className="block px-3 py-2 text-muted-foreground hover:text-primary" onClick={handleLinkClick}>
                        Standard
                      </Link>
                      <Link href="/technical/requests/job-requests" className="block px-3 py-2 text-muted-foreground hover:text-primary" onClick={handleLinkClick}>
                        BMO Job Requests
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
    );
}
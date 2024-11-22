import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import ScrollToTop from "@/components/scroll/scroll-to-top";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UniCore",
  description: "UCLM Service Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="en">
        <body className={inter.className}>
          <ScrollToTop />
          <Navbar />
            <main id="main-content">
              {children}
            </main>
        </body>
      </html>
    </SessionProvider>
  );
}
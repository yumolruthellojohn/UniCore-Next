import Sidebar from "@/components/sidebar_admin";
import SidebarMobile from "@/components/sidebar_admin_mobile";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen w-full">
            <Sidebar />
            <div className="md:ml-[220px] lg:ml-[280px]">
                <div className="fixed top-16 p-2 z-50 md:hidden">
                    <SidebarMobile />
                </div>
                <div className="d-flex align-items-baseline p-4">
                    {children}
                </div>
            </div>
        </div>
    );
}
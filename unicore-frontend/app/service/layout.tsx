import Sidebar from "@/components/sidebar_service";
import SidebarMobile from "@/components/sidebar_service_mobile";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen w-full">
            <Sidebar />
            <div className="md:ml-[200px] lg:ml-[220px]">
                <div className="fixed top-16 p-2 z-50 md:hidden">
                    <SidebarMobile />
                </div>
                <div className="d-flex align-items-baseline px-6 py-4">
                    {children}
                </div>
            </div>
        </div>
    );
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPage() {
    return (
        <Card className="w-full max-w-[500px] px-4 sm:px-6 md:px-8">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">You have Administrator Access</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-gray-600">
                    Check out the sidebar to navigate to different sections.
                </p>
            </CardContent>
        </Card>
    );
}
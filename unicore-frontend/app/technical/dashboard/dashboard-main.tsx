"use client"

import { Session } from "next-auth";
import { useEffect, useState } from "react";
import axios from "axios";
import { Component as RequestsDonut } from "../requests/requests-donut";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DataTableAdd } from "@/components/data-table/data-table-add-button";
import { RequestsArea } from "../requests/requests-area";
import { RequestsAreaCompleted } from "../requests/requests-area-completed";
import { JobRequestAreaCreated } from "../requests/job-requests/job-area-created";
import { JobRequestAreaCompleted } from "../requests/job-requests/job-area-completed";
import { useRouter } from "next/navigation";
import { ip_address } from '@/app/ipconfig';
import RecentRequestButton from "./recent-request-button";

interface RequestsWeeklyData {
  rq_type: string;
  ongoing_count: number;
  completed_count: number;
}

interface RequestsMonthlyData {
  rq_type: string;
  ongoing_count: number;
  completed_count: number;
}

interface RequestsQuarterData {
  rq_type: string;
  ongoing_count: number;
  completed_count: number;
}

interface RecentRequestsData {
    rq_id: number;
    rq_type: string;
    dept_id: number;
    rq_prio_level: string;
    rq_create_user_id: number;
    rq_accept_user_id: number;
    rq_status: string;
}

// Function to generate alternating colors
function getAlternatingColor(index: number): string {
    const hues = [0, 60, 120, 240] // Red, Yellow, Green, Blue
    const hue = hues[index % 4]
    const lightness = 50 + (index % 2) * 10 // Alternates between 50% and 60% lightness
    return `hsl(${hue}, 70%, ${lightness}%)`
}

export default function Dashboard({ session }: { session: Session | null }) {
    const router = useRouter();

    const [requestsWeeklyData, setRequestsWeeklyData] = useState<RequestsWeeklyData[]>([])
    const [requestsMonthlyData, setRequestsMonthlyData] = useState<RequestsMonthlyData[]>([])
    const [requestsQuarterData, setRequestsQuarterData] = useState<RequestsQuarterData[]>([])
    const [recentSubmittedRequests, setRecentSubmittedRequests] = useState<RecentRequestsData[]>([])
    const [recentCompletedRequests, setRecentCompletedRequests] = useState<RecentRequestsData[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [requestsWeeklyResponse] = await Promise.all([
                    axios.get(`http://${ip_address}:8081/requests/summary/weekly`)
                ]);

                const [requestsMonthlyResponse] = await Promise.all([
                    axios.get(`http://${ip_address}:8081/requests/summary/monthly`)
                ]);

                const [requestsQuarterResponse] = await Promise.all([
                    axios.get(`http://${ip_address}:8081/requests/summary/quarter`)
                ]);

                const recentSubmittedResponse = await axios.get(`http://${ip_address}:8081/requests/created/recent`);
                const recentCompletedResponse = await axios.get(`http://${ip_address}:8081/requests/completed/recent`);

                setRequestsWeeklyData(requestsWeeklyResponse.data);
                setRequestsMonthlyData(requestsMonthlyResponse.data);
                setRequestsQuarterData(requestsQuarterResponse.data);

                setRecentSubmittedRequests(recentSubmittedResponse.data);
                setRecentCompletedRequests(recentCompletedResponse.data);

                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError('Failed to fetch data');
                setIsLoading(false);
            }
        }

        fetchData()
    }, [])

    const ongoingRequestsWeeklyData = requestsWeeklyData.map((item, index) => ({
        browser: item.rq_type,
        visitors: item.ongoing_count,
        fill: getAlternatingColor(index)
    }))

    const completedRequestsWeeklyData = requestsWeeklyData.map((item, index) => ({
        browser: item.rq_type,
        visitors: item.completed_count,
        fill: getAlternatingColor(index)
    }))

    const ongoingRequestsMonthlyData = requestsMonthlyData.map((item, index) => ({
        browser: item.rq_type,
        visitors: item.ongoing_count,
        fill: getAlternatingColor(index)
    }))

    const completedRequestsMonthlyData = requestsMonthlyData.map((item, index) => ({
        browser: item.rq_type,
        visitors: item.completed_count,
        fill: getAlternatingColor(index)
    }))

    const ongoingRequestsQuarterData = requestsQuarterData.map((item, index) => ({
        browser: item.rq_type,
        visitors: item.ongoing_count,
        fill: getAlternatingColor(index)
    }))

    const completedRequestsQuarterData = requestsQuarterData.map((item, index) => ({
        browser: item.rq_type,
        visitors: item.completed_count,
        fill: getAlternatingColor(index)
    }))

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>

    // Function to determine the button variant
    const changeButtonVariant = (request: any) => {
        return (request.dept_id === session?.user.dept_id || 
                request.rq_create_user_id === session?.user.user_id || 
                request.rq_accept_user_id === session?.user.user_id) 
                ? "default" 
                : "outline";
    };

    const handleClick = (request: any) => {
        const userId = session?.user.user_id; // Assuming session.user is available
        const deptId = session?.user.dept_id;
        let url = ``;

        if (request.rq_status === 'Request Submitted' && request.dept_id === deptId) {
            switch (request.rq_type) {
                case "Reserve Item":
                  url = `/technical/requests/view-reserve-item-queue?id=${request.rq_id}`;
                  break;
                case "Reserve Facility":
                  url = `/technical/requests/view-reserve-facility-queue?id=${request.rq_id}`;
                  break;
                case "Service for Item":
                  url = `/technical/requests/view-service-item-queue?id=${request.rq_id}`;
                  break;
                case "Service for Facility":
                  url = `/technical/requests/view-service-facility-queue?id=${request.rq_id}`;
                  break;
                default:
                  url = `/technical/requests/`; // Fallback URL
            }
            router.push(url);
        } else if (request.rq_accept_user_id === userId) {
            switch (request.rq_type) {
                case "Reserve Item":
                  url = `/technical/requests/view-reserve-item-bench?id=${request.rq_id}`;
                  break;
                case "Reserve Facility":
                  url = `/technical/requests/view-reserve-facility-bench?id=${request.rq_id}`;
                  break;
                case "Service for Item":
                  url = `/technical/requests/view-service-item-bench?id=${request.rq_id}`;
                  break;
                case "Service for Facility":
                  url = `/technical/requests/view-service-facility-bench?id=${request.rq_id}`;
                  break;
                default:
                  url = `/technical/requests/`; // Fallback URL
            }
            router.push(url);
            
        } else if (request.rq_create_user_id === userId) {
            switch (request.rq_type) {
                case "Reserve Item":
                  url = `/technical/requests/view-reserve-item?id=${request.rq_id}`;
                  break;
                case "Reserve Facility":
                  url = `/technical/requests/view-reserve-facility?id=${request.rq_id}`;
                  break;
                case "Service for Item":
                  url = `/technical/requests/view-service-item?id=${request.rq_id}`;
                  break;
                case "Service for Facility":
                  url = `/technical/requests/view-service-facility?id=${request.rq_id}`;
                  break;
                default:
                  url = `/technical/requests/`; // Fallback URL
            }
            router.push(url);
        }
    };


    return (
        <div className="p-4">
            <Card className="max-w-[450px]">
                <CardHeader>
                    <CardTitle>
                        Requests Summary
                    </CardTitle>
                    <CardDescription>
                        See the charts below, or visit these pages for more info.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <DataTableAdd text="Standard Requests" href="/technical/requests" />
                    <DataTableAdd text="BMO JOB Requests" href="/technical/requests/job-requests" />
                </CardFooter>
            </Card>
            <br />

            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 max-w-5xl gap-4 mb-8">
                <Card className="min-w-4xl">
                    <CardHeader>
                        <CardTitle>Ongoing Standard Requests By Type</CardTitle>
                        <CardDescription></CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="weekly" className="flex flex-col">
                            <TabsList className="flex flex-row flex-wrap justify-between mb-5">
                                <TabsTrigger value="weekly" className="flex-1 text-center min-w-[120px]">Current Week</TabsTrigger>
                                <TabsTrigger value="monthly" className="flex-1 text-center min-w-[120px]">Current Month</TabsTrigger>
                                <TabsTrigger value="quarter" className="flex-1 text-center min-w-[120px]">Current Quarter</TabsTrigger>
                            </TabsList>
                            <TabsContent value="weekly">
                                <RequestsDonut 
                                    data={ongoingRequestsWeeklyData}
                                />
                            </TabsContent>
                            <TabsContent value="monthly">
                                <RequestsDonut 
                                    data={ongoingRequestsMonthlyData}
                                />
                            </TabsContent>
                            <TabsContent value="quarter">
                                <RequestsDonut 
                                    data={ongoingRequestsQuarterData}
                                />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                    <CardFooter>
                        <div className="grid grid-cols-1 gap-2">
                            <h3>Most Recent:</h3>
                            {recentSubmittedRequests.map((request) => (
                                <RecentRequestButton 
                                buttonVariant={changeButtonVariant(request)}
                                key={request.rq_id}
                                text={`ID: ${request.rq_id} | ${request.rq_type} | Priority: ${request.rq_prio_level}`}
                                onClick={() => handleClick(request)}
                                />
                            ))}
                        </div>
                    </CardFooter>
                </Card>
                <Card className="min-w-4xl">
                    <CardHeader>
                        <CardTitle>Completed Standard Requests By Type</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="weekly" className="flex flex-col">
                            <TabsList className="flex flex-row flex-wrap justify-between mb-5">
                                <TabsTrigger value="weekly" className="flex-1 text-center min-w-[120px]">Current Week</TabsTrigger>
                                <TabsTrigger value="monthly" className="flex-1 text-center min-w-[120px]">Current Month</TabsTrigger>
                                <TabsTrigger value="quarter" className="flex-1 text-center min-w-[120px]">Current Quarter</TabsTrigger>
                            </TabsList>
                            <TabsContent value="weekly">
                                <RequestsDonut 
                                    data={completedRequestsWeeklyData}
                                />
                            </TabsContent>
                            <TabsContent value="monthly">
                                <RequestsDonut 
                                    data={completedRequestsMonthlyData}
                                />
                            </TabsContent>
                            <TabsContent value="quarter">
                                <RequestsDonut 
                                    data={completedRequestsQuarterData}
                                />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                    <CardFooter>
                        <div className="grid grid-cols-1 gap-2">
                            <h3>Most Recent:</h3>
                            {recentCompletedRequests.map((request) => (
                                <RecentRequestButton 
                                    buttonVariant={changeButtonVariant(request)}
                                    key={request.rq_id}
                                    text={`ID: ${request.rq_id} | ${request.rq_type} | Priority: ${request.rq_prio_level}`}
                                    onClick={() => handleClick(request)}
                                />
                            ))}
                        </div>
                    </CardFooter>
                </Card>
                <RequestsArea></RequestsArea>
                <RequestsAreaCompleted></RequestsAreaCompleted>
                <JobRequestAreaCreated></JobRequestAreaCreated>
                <JobRequestAreaCompleted></JobRequestAreaCompleted>
            </div>
        </div>
    )
}
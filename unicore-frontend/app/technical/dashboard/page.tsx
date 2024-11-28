"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Component as RequestsDonut } from "../requests/requests-donut"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTableAdd } from "@/components/data-table/data-table-add-button";
import { RequestsArea } from "../requests/requests-area";
import { RequestsAreaCompleted } from "../requests/requests-area-completed";
import { ip_address } from '@/app/ipconfig';

interface RequestsData {
  rq_type: string;
  ongoing_count: number;
  completed_count: number;
}

// Function to generate alternating colors
function getAlternatingColor(index: number): string {
    const hues = [0, 60, 120, 240] // Red, Yellow, Green, Blue
    const hue = hues[index % 4]
    const lightness = 50 + (index % 2) * 10 // Alternates between 50% and 60% lightness
    return `hsl(${hue}, 70%, ${lightness}%)`
}

export default function Dashboard() {
    const [requestsData, setRequestsData] = useState<RequestsData[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [requestsResponse] = await Promise.all([
                    axios.get(`http://${ip_address}:8081/requests_summary`)
                ]);
                console.log("Fetched requests data:", requestsResponse.data);
                setRequestsData(requestsResponse.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError('Failed to fetch data');
                setIsLoading(false);
            }
        }

        fetchData()
    }, [])

    const ongoingRequestsData = requestsData.map((item, index) => ({
        browser: item.rq_type,
        visitors: item.ongoing_count,
        fill: getAlternatingColor(index)
    }))

    const completedRequestsData = requestsData.map((item, index) => ({
        browser: item.rq_type,
        visitors: item.completed_count,
        fill: getAlternatingColor(index)
    }))

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>

    return (
        <div className="p-4">
            <Card className="max-w-[450px]">
                <CardHeader>
                    <CardTitle>
                        Requests Summary
                    </CardTitle>
                    <CardDescription>
                        See the charts below, or visit the page for more info.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <DataTableAdd text="Go to Requests Page" href="/technical/requests" />
                </CardFooter>
            </Card>
            <br />
            <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl gap-4 mb-8">
                <RequestsDonut 
                    title="Ongoing Requests by Type"
                    description="Current Ongoing Requests"
                    data={ongoingRequestsData}
                />
                <RequestsDonut 
                    title="Completed Requests by Type"
                    description="Total Completed Requests"
                    data={completedRequestsData}
                />
                <RequestsArea></RequestsArea>
                <RequestsAreaCompleted></RequestsAreaCompleted>
            </div>
        </div>
    )
}
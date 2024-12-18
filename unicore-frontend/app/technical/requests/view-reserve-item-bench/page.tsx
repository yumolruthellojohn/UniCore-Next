"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ip_address } from '@/app/ipconfig';

interface ReserveItem {
    rq_id: number
    rq_type: string
    dept_id: number
    dept_name: string
    item_id: number
    item_name: string
    rq_quantity: number
    rq_prio_level: string
    rq_start_date: string
    rq_end_date: string
    rq_start_time: string
    rq_end_time: string
    rq_notes: string
    rq_create_date: string
    rq_complete_date: string
    rq_create_user_id: number
    rq_create_user_fname: string
    rq_create_user_lname: string
    rq_accept_user_id: number
    rq_accept_user_fname: string
    rq_accept_user_lname: string
    rq_status: string
}

export default function ReserveItemBenchView() {
    const searchParams = useSearchParams();
    const requestID = searchParams.get('id');
    const [request, setRequest] = useState<ReserveItem | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            if (requestID) {
                // Fetch request details
                const itemResponse = await axios.get(`http://${ip_address}:8081/requests/reserve_item/${requestID}`);
                setRequest(itemResponse.data[0]);
            }
        };

        fetchData();
    }, [requestID]);

    if (!request) {
        return <div>Loading...</div>;
    }

    const handleEdit = () => {
        router.push(`/technical/requests/edit-reserve-item?id=${request.rq_id}`);
    };

    return (
        <div className="container mx-auto py-4">
            <Card className="w-full max-w-[600px] px-4 sm:px-6 md:px-8">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Request Details</CardTitle>
                    <Link href="/technical/requests" className="text-blue-500 hover:text-blue-700">
                        Back to Requests
                    </Link>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <p><strong>ID:</strong> {request.rq_id}</p>
                    <p><strong>Type:</strong> {request.rq_type}</p>
                    <p><strong>Department:</strong> {request.dept_name}</p>
                    <p><strong>Item:</strong> {request.item_name}</p>
                    <p><strong>Date Submitted:</strong> {request.rq_create_date}</p>
                    <p><strong>Requested Quantity:</strong> {request.rq_quantity}</p>
                    <p><strong>Priority Level:</strong> {request.rq_prio_level}</p>
                    <p><strong>Submitted by:</strong> {request.rq_create_user_fname + " " + request.rq_create_user_lname}</p>
                    <p><strong>Reservation Date:</strong> From {request.rq_start_date} To {request.rq_end_date}</p>
                    <p><strong>Reservation Time:</strong> From {request.rq_start_time} To {request.rq_end_time}</p>
                    <p><strong>Notes:</strong> {request.rq_notes}</p>
                    <p><strong>Respondent:</strong> {request.rq_accept_user_fname + " " + request.rq_accept_user_lname}</p>
                    <p><strong>Status:</strong> {request.rq_status}</p>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
                    {request.rq_status !== "Completed" && request.rq_status !== "Canceled" && (
                        <Button 
                            className="w-full sm:w-auto" 
                            variant="default" 
                            onClick={handleEdit}
                        >
                            Update Request
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
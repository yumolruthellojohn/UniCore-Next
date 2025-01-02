"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ip_address } from '@/app/ipconfig';

interface ServiceItem {
    rq_id: number
    rq_type: string
    dept_id: number
    dept_name: string
    item_id: number
    item_name: string
    rq_quantity: number
    rq_service_type: string
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
    rq_accept_notes: string
    rq_service_user_id: number
    rq_service_user_fname: string
    rq_service_user_lname: string
    rq_service_notes: string
    rq_service_status: string
    rq_status: string
}

export default function ServiceItemView() {
    const searchParams = useSearchParams();
    const requestID = searchParams.get('id');
    const [request, setRequest] = useState<ServiceItem | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            if (requestID) {
                // Fetch request details
                const itemResponse = await axios.get(`http://${ip_address}:8081/requests/service_item/${requestID}`);
                setRequest(itemResponse.data[0]);
            }
        };

        fetchData();
    }, [requestID]);

    if (!request) {
        return <div>Loading...</div>;
    }

    const handleEdit = () => {
        router.push(`/service/requests/edit-service-item?id=${request.rq_id}`);
    };

    return (
        <div className="container mx-auto py-4">
            <Card className="w-full max-w-[600px] px-4 sm:px-6 md:px-8">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Request Details</CardTitle>
                    <Link href="/service/requests" className="text-blue-500 hover:text-blue-700">
                        Back to Requests
                    </Link>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <p><strong>ID:</strong> {request.rq_id}</p>
                    <p><strong>Type:</strong> {request.rq_type}</p>
                    <p><strong>Department:</strong> {request.dept_name}</p>
                    <p><strong>Item:</strong> {request.item_name}</p>
                    <p><strong>Service Type:</strong> {request.rq_service_type}</p>
                    <p><strong>Requested Quantity:</strong> {request.rq_quantity}</p>
                    <p><strong>Date Submitted:</strong> {request.rq_create_date}</p>
                    <p><strong>Priority Level:</strong> {request.rq_prio_level}</p>
                    <p><strong>Service Date:</strong> From {request.rq_start_date} To {request.rq_end_date}</p>
                    <p><strong>Service Time:</strong> From {request.rq_start_time} To {request.rq_end_time}</p>
                    <p><strong>Submitted by:</strong> {request.rq_create_user_fname + " " + request.rq_create_user_lname}</p>
                    <p><strong>Purpose/Notes:</strong> {request.rq_notes}</p>
                    <p><strong>Date Completed:</strong> {request.rq_complete_date ? request.rq_complete_date : "Not completed yet"}</p>
                    <p><strong>Respondent:</strong> {request.rq_accept_user_fname ? (request.rq_accept_user_fname + " " + request.rq_accept_user_lname) : "No respondent yet"}</p>
                    <p><strong>Respondent's Notes:</strong> {request.rq_accept_notes ? request.rq_accept_notes : "No notes yet"}</p>
                    <p><strong>Service Staff:</strong> {request.rq_service_user_fname ? (request.rq_service_user_fname + " " + request.rq_service_user_lname) : "No service staff yet"}</p>
                    <p><strong>Service Progress:</strong> {request.rq_service_status ? request.rq_service_status : "Not started"}</p>
                    <p><strong>Service Staff's Notes:</strong> {request.rq_service_notes ? request.rq_service_notes : "No notes yet"}</p>
                    <p><strong>Status:</strong> {request.rq_status}</p>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
                    {request.rq_status != "Completed" && request.rq_status != "Canceled" && (
                        <>
                            <Button 
                                className="w-full sm:w-auto" 
                                variant="default" 
                                onClick={handleEdit}
                            >
                                Update Service Progress
                            </Button>
                        </>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { ip_address } from '@/app/ipconfig';

interface ServiceItem {
    rq_id: number
    rq_type: string
    dept_id: number
    dept_name: string
    item_id: number
    item_name: string
    rq_service_type: string
    rq_prio_level: string
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
    rq_service_status: string
    rq_service_notes: string
    rq_status: string
}

export default function ServiceItemView() {
    const searchParams = useSearchParams();
    const requestID = searchParams.get('id');
    const [request, setRequest] = useState<ServiceItem | null>(null);
    const router = useRouter();
    const { toast } = useToast();

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
        router.push(`/admin/requests/edit-service-item?id=${request.rq_id}`);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://${ip_address}:8081/requests/${request.rq_id}`);
            toast({
                title: "Request deleted successfully",
                description: "The request has been deleted.",
            })
            router.push('/admin/requests');
        } catch (error) {
            console.error('Error deleting request:', error);
            toast({
                title: "Error",
                description: "Failed to delete the request. Please try again.",
                variant: "destructive",
            })
        }
    };

    return (
        <div className="container mx-auto py-4">
            <Card className="w-full max-w-[600px] px-4 sm:px-6 md:px-8">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Request Details</CardTitle>
                    <Link href="/admin/requests" className="text-blue-500 hover:text-blue-700">
                        Back
                    </Link>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <p><strong>ID:</strong> {request.rq_id}</p>
                    <p><strong>Type:</strong> {request.rq_type}</p>
                    <p><strong>Department:</strong> {request.dept_name}</p>
                    <p><strong>Item:</strong> {request.item_name}</p>
                    <p><strong>Service Type:</strong> {request.rq_service_type}</p>
                    <p><strong>Date Submitted:</strong> {request.rq_create_date}</p>
                    <p><strong>Priority Level:</strong> {request.rq_prio_level}</p>
                    <p><strong>Submitted by:</strong> {request.rq_create_user_fname + " " + request.rq_create_user_lname}</p>
                    <p><strong>Notes:</strong> {request.rq_notes}</p>
                    <p><strong>Date Completed:</strong> {request.rq_complete_date}</p>
                    <p><strong>Respondent:</strong> {request.rq_accept_user_fname + " " + request.rq_accept_user_lname}</p>
                    <p><strong>Respondent Notes:</strong> {request.rq_accept_notes}</p>
                    <p><strong>Service Staff:</strong> {request.rq_service_user_fname + " " + request.rq_service_user_lname}</p>
                    <p><strong>Service Status:</strong> {request.rq_service_status}</p>
                    <p><strong>Service Staff Notes:</strong> {request.rq_service_notes}</p>
                    <p><strong>Request Status:</strong> {request.rq_status}</p>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
                    <Button 
                        className="w-full sm:w-auto" 
                        variant="default" 
                        onClick={handleEdit}
                    >
                        Edit
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className="w-full sm:w-auto" variant="destructive">Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the request.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete}>Yes, Delete this request</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            </Card>
        </div>
    );
}
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
import DownloadRequestPDF from '../request-download';
import Image from 'next/image';

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

interface Requestor {
    user_id: number;
    user_fname: string;
    user_lname: string;
    user_sign: string;
}

interface Respondent {
    user_id: number;
    user_fname: string;
    user_lname: string;
    user_sign: string;
}

export default function ReserveItemView() {
    const searchParams = useSearchParams();
    const requestID = searchParams.get('id');
    const [request, setRequest] = useState<ReserveItem | null>(null);
    const [requestor, setRequestor] = useState<Requestor | null>(null);
    const [respondent, setRespondent] = useState<Respondent | null>(null);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            if (requestID) {
                // Fetch request details
                const itemResponse = await axios.get(`http://${ip_address}:8081/requests/reserve_item/${requestID}`);
                setRequest(itemResponse.data[0]);

                // Fetch requestor details
                const requestorID = itemResponse.data[0].rq_create_user_id;
                const requestorDetails = await axios.get(`http://${ip_address}:8081/users/${requestorID}`);
                setRequestor(requestorDetails.data[0]);

                // Fetch respondent details
                if (itemResponse.data[0].rq_accept_user_id) {
                    const respondentID = itemResponse.data[0].rq_accept_user_id;
                    const respondentDetails = await axios.get(`http://${ip_address}:8081/users/${respondentID}`);
                    setRespondent(respondentDetails.data[0]);
                }
            }
        };

        fetchData();
    }, [requestID]);

    if (!request) {
        return <div>Loading...</div>;
    }

    const handleEdit = () => {
        router.push(`/nontechnical/requests/edit-reserve-item-conflict?id=${request.rq_id}`);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://${ip_address}:8081/requests/${request.rq_id}`);
            toast({
                title: "Request deleted successfully",
                description: "The request has been deleted.",
            })
            router.push('/nontechnical/requests');
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
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-5xl gap-4 mb-8">
            <Card className="w-full max-w-[600px] px-4 sm:px-6 md:px-8">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Request Details</CardTitle>
                    <Link href="/nontechnical/requests" className="text-blue-500 hover:text-blue-700">
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
                    <p><strong>Date Completed:</strong> {request.rq_complete_date}</p>
                    <p><strong>Respondent:</strong> {request.rq_accept_user_fname + " " + request.rq_accept_user_lname}</p>
                    <p><strong>Status:</strong> {request.rq_status}</p>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
                    {request.rq_status === "Conflict" && (
                        <>
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
                                        <AlertDialogAction onClick={handleDelete}>Yes, Delete this Request</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </>
                    )}
                    <DownloadRequestPDF requestId={request.rq_id.toString()} requestType={request.rq_type} />
                </CardFooter>
            </Card>
            <Card className="w-full max-w-[600px] px-4 sm:px-6 md:px-8">
                <CardHeader>
                    <CardTitle>E-Signatures</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                    {request.rq_create_user_id && (
                        <div className="flex flex-col items-center gap-4">
                            <p><strong>Requestor:</strong> {requestor?.user_fname + " " + requestor?.user_lname}</p>
                            {requestor?.user_sign ? (
                                <Image
                                    src={`data:image/png;base64,${requestor.user_sign}`}
                                    alt="Requestor Signature"
                                    width={150}
                                    height={75}
                                    className="border rounded p-2"
                                />
                            ) : (
                                <p className="text-gray-400">No e-signature</p>
                            )}   
                        </div>
                    )}

                    {request.rq_accept_user_id && (
                        <div className="flex flex-col items-center gap-4">
                            <p><strong>Respondent:</strong> {respondent?.user_fname + " " + respondent?.user_lname}</p>
                            {respondent?.user_sign ? (
                                <Image
                                    src={`data:image/png;base64,${respondent.user_sign}`}
                                    alt="Requestor Signature"
                                    width={150}
                                    height={75}
                                    className="border rounded p-2"
                                />
                            ) : (
                                <p className="text-gray-400">No e-signature</p>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
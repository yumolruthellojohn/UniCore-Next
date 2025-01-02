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

interface ServiceStaff {
    user_id: number;
    user_fname: string;
    user_lname: string;
    user_sign: string;
}

export default function ServiceItemView() {
    const searchParams = useSearchParams();
    const requestID = searchParams.get('id');
    const [request, setRequest] = useState<ServiceItem | null>(null);
    const [requestor, setRequestor] = useState<Requestor | null>(null);
    const [respondent, setRespondent] = useState<Respondent | null>(null);
    const [serviceStaff, setServiceStaff] = useState<ServiceStaff| null>(null);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            if (requestID) {
                // Fetch request details
                const itemResponse = await axios.get(`http://${ip_address}:8081/requests/service_item/${requestID}`);
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

                // Fetch service staff details
                if (itemResponse.data[0].rq_service_user_id) {
                    const serviceStaffID = itemResponse.data[0].rq_service_user_id;
                    const serviceStaffDetails = await axios.get(`http://${ip_address}:8081/users/${serviceStaffID}`);
                    setServiceStaff(serviceStaffDetails.data[0]);
                }
            }
        };

        fetchData();
    }, [requestID]);

    if (!request) {
        return <div>Loading...</div>;
    }

    const handleEdit = () => {
        router.push(`/technical/requests/edit-service-item-conflict?id=${request.rq_id}`);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://${ip_address}:8081/requests/${request.rq_id}`);
            toast({
                title: "Request deleted successfully",
                description: "The request has been deleted.",
            })
            router.push('/technical/requests');
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
                    <Link href="/technical/requests" className="text-blue-500 hover:text-blue-700">
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
                                    alt="Respondent Signature"
                                    width={150}
                                    height={75}
                                    className="border rounded p-2"
                                />
                            ) : (
                                <p className="text-gray-400">No e-signature</p>
                            )}
                        </div>
                    )}

                    {request.rq_service_user_id && (
                        <div className="flex flex-col items-center gap-4">
                            <p><strong>Service Staff:</strong> {serviceStaff?.user_fname + " " + serviceStaff?.user_lname}</p>
                            {serviceStaff?.user_sign ? (
                                <Image
                                    src={`data:image/png;base64,${serviceStaff.user_sign}`}
                                    alt="Service Staff Signature"
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
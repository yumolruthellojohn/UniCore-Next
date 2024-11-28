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
import { Session } from 'next-auth';
import { ip_address } from '@/app/ipconfig';

interface ServiceRoom {
    rq_id: number
    rq_type: string
    dept_id: number
    dept_name: string
    room_id: number
    room_name: string
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
    rq_status: string
}

interface Requestor {
    user_idnum: number
    user_email: string
    user_contact: string
    dept_id: number
    dept_name: string
}

export default function ServiceRoomQueueView({ session }: { session: Session | null }) {
    //const { data: session, status } = useSession();

    //console.log('Session status:', status);
    console.log('Session data:', session);

    const searchParams = useSearchParams();
    const requestID = searchParams.get('id');
    const [request, setRequest] = useState<ServiceRoom | null>(null);
    const [requestor, setRequestor] = useState<Requestor | null>(null);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            if (requestID) {
                // Fetch request details
                const roomResponse = await axios.get(`http://${ip_address}:8081/requests/service_room/${requestID}`);
                setRequest(roomResponse.data[0]);

                const requestorID = roomResponse.data[0].rq_create_user_id;

                // Fetch requestor details
                const requestorResponse = await axios.get(`http://${ip_address}:8081/users/${requestorID}`);
                setRequestor(requestorResponse.data[0]);
            }
        };

        fetchData();
    }, [requestID]);

    if (!request) {
        return <div>Loading...</div>;
    }

    /*const handleEdit = () => {
        //router.push(`/admin/rooms/edit?id=${room.room_id}`);
        //TO DO: Request Edit Module 
    };*/

    const handleAccept = async () => {
        //console.log('Update with session status:', status);
        console.log('Update with session data:', session);
        
        if (session?.user?.user_id){
            const newUserId = session.user.user_id.toString();
            console.log('Setting new user id:', newUserId);

            try {
                const accepted = {
                    rq_status: 'Accepted',
                    rq_accept_user_id: newUserId
                }

                await axios.put(`http://${ip_address}:8081/requests/accept/${requestID}`, accepted);
                toast({
                    title: "Request accepted",
                    description: "You accepted the request and it is now in your workbench.",
                })
                router.push('/technical/requests');
            } catch (error) {
                console.error('Error accepting the request:', error);
                toast({
                    title: "Error",
                    description: "Failed to accept the request. Please try again.",
                    variant: "destructive",
                })
            }
        } else {
            console.log("Not authenticated");
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl gap-4 mb-8">
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
                    <p><strong>Facility:</strong> {request.room_name}</p>
                    <p><strong>Service Type:</strong> {request.rq_service_type}</p>
                    <p><strong>Date Submitted:</strong> {request.rq_create_date}</p>
                    <p><strong>Priority Level:</strong> {request.rq_prio_level}</p>
                    <p><strong>Submitted by:</strong> {request.rq_create_user_fname + " " + request.rq_create_user_lname}</p>
                    <p><strong>Service Date:</strong> From {request.rq_start_date} To {request.rq_end_date}</p>
                    <p><strong>Service Time:</strong> From {request.rq_start_time} To {request.rq_end_time}</p>
                    <p><strong>Notes:</strong> {request.rq_notes}</p>
                    <p><strong>Status:</strong> {request.rq_status}</p>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className="w-full sm:w-auto" variant="default">Accept Request</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will accept the request and add it to your workbench.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleAccept}>Yes, Accept this Request</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            </Card>
            <Card className="w-full max-w-[600px] px-4 sm:px-6 md:px-8">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Requestor Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4">
                    <p><strong>ID Number:</strong> {requestor?.user_idnum}</p>
                    <p><strong>Name:</strong> {request.rq_create_user_fname + " " + request.rq_create_user_lname}</p>
                    <p><strong>E-mail Address:</strong> {requestor?.user_email}</p>
                    <p><strong>Contact Number:</strong> {requestor?.user_contact}</p>
                    <p><strong>Department:</strong> {requestor?.dept_name}</p>
                </CardContent>
            </Card>
        </div>
    );
}
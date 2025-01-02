"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ip_address } from '@/app/ipconfig';
import DownloadRequestPDF from '../request-download';
import Image from 'next/image';

interface ReserveRoom {
    rq_id: number
    rq_type: string
    dept_id: number
    dept_name: string
    room_id: number
    room_name: string
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
    rq_status: string
}

interface Room {
    room_id: number;
    room_bldg: string;
    room_floor: string;
    room_type: string;
    room_name: string;
    room_status: string;
    room_status_start_date: string;
    room_status_end_date: string;
    room_status_start_time: string;
    room_status_end_time: string;
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

export default function ReserveRoomBenchView() {
    const searchParams = useSearchParams();
    const requestID = searchParams.get('id');
    console.log(requestID);
    const [request, setRequest] = useState<ReserveRoom | null>(null);
    const [requestor, setRequestor] = useState<Requestor | null>(null);
    const [respondent, setRespondent] = useState<Respondent | null>(null);
    const [room, setRoom] = useState<Room | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            if (requestID) {
                // Fetch request details
                const roomResponse = await axios.get(`http://${ip_address}:8081/requests/reserve_room/${requestID}`);
                console.log(roomResponse.data[0]);
                setRequest(roomResponse.data[0]);

                //Fetch facility details
                const roomID = roomResponse.data[0].room_id;
                const roomDetails = await axios.get(`http://${ip_address}:8081/rooms/${roomID}`);
                setRoom(roomDetails.data[0]);

                // Fetch requestor details
                const requestorID = roomResponse.data[0].rq_create_user_id;
                const requestorDetails = await axios.get(`http://${ip_address}:8081/users/${requestorID}`);
                setRequestor(requestorDetails.data[0]);

                // Fetch respondent details
                if (roomResponse.data[0].rq_accept_user_id) {
                    const respondentID = roomResponse.data[0].rq_accept_user_id;
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
        router.push(`/technical/requests/edit-reserve-facility?id=${request.rq_id}`);
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
                    <p><strong>Facility:</strong> {request.room_name}</p>
                    <p><strong>Date Submitted:</strong> {request.rq_create_date}</p>
                    <p><strong>Priority Level:</strong> {request.rq_prio_level}</p>
                    <p><strong>Reservation Date:</strong> From {request.rq_start_date} To {request.rq_end_date}</p>
                    <p><strong>Reservation Time:</strong> From {request.rq_start_time} To {request.rq_end_time}</p>
                    <p><strong>Submitted by:</strong> {request.rq_create_user_fname + " " + request.rq_create_user_lname}</p>
                    <p><strong>Purpose/Notes:</strong> {request.rq_notes}</p>
                    <p><strong>Respondent:</strong> {request.rq_accept_user_fname + " " + request.rq_accept_user_lname}</p>
                    <p><strong>Respondent's Notes:</strong> {request.rq_accept_notes ? request.rq_accept_notes : "No notes yet"}</p>
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
                    <DownloadRequestPDF requestId={request.rq_id.toString()} requestType={request.rq_type} />
                </CardFooter>
            </Card>
            <Card className="w-full max-w-[600px] px-4 sm:px-6 md:px-8">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Facility Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4">
                    <p><strong>Building:</strong> {room?.room_bldg}</p>
                    <p><strong>Floor:</strong> {room?.room_floor}</p>
                    <p><strong>Type:</strong> {room?.room_type}</p>
                    <p><strong>Name:</strong> {room?.room_name}</p>
                    <p><strong>Status:</strong> {room?.room_status}</p>
                    {room?.room_status !== 'Available' && (
                        <p><strong>Status Timeframe:</strong> {room?.room_status_start_date} to {room?.room_status_end_date}, {room?.room_status_start_time} - {room?.room_status_end_time}</p>
                    )}
                </CardContent>
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
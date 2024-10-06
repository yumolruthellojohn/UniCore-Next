"use client";

import { useEffect, useState } from 'react';
import { createRoomRequestsColumns, RoomRequests } from "@/app/admin/requests/relate-room-columns"
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
import { DataTable } from '@/components/data-table/data-table-no-change';

interface Room {
  room_id: number;
  room_name: string;
  room_desc: string;
  room_status: string;
  dept_id: number;
  dept_name: string;
}

const filterRelateRoomColumn = {
    id: "rq_type",
    title: "Request Type",
  }

export default function RoomView() {
    const searchParams = useSearchParams();
    const roomId = searchParams.get('id');
    const [roomRequestsData, setRoomRequestsData] = useState<RoomRequests[]>([]);
    const [room, setRoom] = useState<Room | null>(null);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            if (roomId) {
                // Fetch room details
                const roomResponse = await axios.get(`http://localhost:8081/rooms/${roomId}`);
                setRoom(roomResponse.data[0]);

                // Fetch related requests
                const requestsResponse = await axios.get(`http://localhost:8081/requests/relate_room/${roomId}`);
                setRoomRequestsData(requestsResponse.data);
            }   
        };

        fetchData();
    }, [roomId]);

    if (!room) {
        return <div>Loading...</div>;
    }

    const handleEdit = () => {
        router.push(`/technical/rooms/edit?id=${room.room_id}`);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8081/rooms/${room.room_id}`);
            toast({
                title: "Room deleted successfully",
                description: "The room has been removed.",
            })
            router.push('/technical/rooms');
        } catch (error) {
            console.error('Error deleting room:', error);
            toast({
                title: "Error",
                description: "Failed to delete the room. Please try again.",
                variant: "destructive",
            })
        }
    };

    const roomRequestsColumns = createRoomRequestsColumns();

    return (
        <div className="container mx-auto py-4">
            <Card className="w-full max-w-[600px] px-4 sm:px-6 md:px-8">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Room Details</CardTitle>
                    <Link href="/technical/rooms" className="text-blue-500 hover:text-blue-700">
                        Back
                    </Link>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <p><strong>ID:</strong> {room.room_id}</p>
                    <p><strong>Name:</strong> {room.room_name}</p>
                    <p><strong>Description:</strong> {room.room_desc}</p>
                    <p><strong>Status:</strong> {room.room_status}</p>
                    <p><strong>Department:</strong> {room.dept_name}</p>
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
                                    This action cannot be undone. This will permanently delete the room.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete}>Yes, Delete this Room</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            </Card>
            <br />
            <Card className="w-full px-4 sm:px-6 md:px-8">
                <CardHeader>
                    <CardTitle>Related Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable 
                        columns={roomRequestsColumns}
                        data={roomRequestsData}
                        filterColumn={filterRelateRoomColumn}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
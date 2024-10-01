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

interface Room {
  room_id: number;
  room_name: string;
  room_desc: string;
  room_status: string;
  dept_id: number;
  dept_name: string;
}

export default function RoomView() {
    const searchParams = useSearchParams();
    const roomId = searchParams.get('id');
    const [room, setRoom] = useState<Room | null>(null);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
    // Fetch room details from your API
        const fetchItem = async () => {
      const response = await axios.get(`http://localhost:8081/rooms/${roomId}`);
      setRoom(response.data[0]);
        };

    fetchItem();
    }, []);

    if (!room) {
        return <div>Loading...</div>;
    }

    const handleEdit = () => {
        router.push(`/admin/rooms/edit?id=${room.room_id}`);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8081/rooms/${room.room_id}`);
            toast({
                title: "Room deleted successfully",
                description: "The room has been removed.",
            })
            router.push('/admin/rooms');
        } catch (error) {
            console.error('Error deleting room:', error);
            toast({
                title: "Error",
                description: "Failed to delete the room. Please try again.",
                variant: "destructive",
            })
        }
    };

    return (
        <Card className="w-full max-w-[600px] px-4 sm:px-6 md:px-8">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Room Details</CardTitle>
                <Link href="/admin/rooms" className="text-blue-500 hover:text-blue-700">
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
    );
}
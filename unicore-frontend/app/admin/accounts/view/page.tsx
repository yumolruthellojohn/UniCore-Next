"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ip_address } from '@/app/ipconfig';

interface User {
    user_id: number;
    user_idnum: string;
    user_password: string;
    user_fname: string;
    user_lname: string;
    user_email: string;
    user_contact: string;
    user_type: string;
    user_position: string;
    dept_id: number;
    dept_name: string;
    user_status: string;
}

export default function UserView() {
    const searchParams = useSearchParams();
    const userId = searchParams.get('id');
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            if (userId) {
                const userResponse = await axios.get(`http://${ip_address}:8081/users/${userId}`);
                setUser(userResponse.data[0]);
            }   
        };

        fetchData();
    }, [userId]);

    if (!user) {
        return <div>Loading...</div>;
    }

    const handleEdit = () => {
        router.push(`/admin/accounts/edit?id=${user.user_id}`);
    };

    return (
        <div className="container mx-auto py-4">
            <Card className="w-full max-w-[600px] px-4 sm:px-6 md:px-8">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>User Account Details</CardTitle>
                    <Link href="/admin/accounts" className="text-blue-500 hover:text-blue-700">
                        Back
                    </Link>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <p><strong>ID Number:</strong> {user.user_idnum}</p>
                    <p><strong>First Name:</strong> {user.user_fname}</p>
                    <p><strong>Last Name:</strong> {user.user_lname}</p>
                    <p><strong>Email:</strong> {user.user_email}</p>
                    <p><strong>Contact Number:</strong> {user.user_contact}</p>
                    <p><strong>User Type:</strong> {user.user_type}</p>
                    <p><strong>Position:</strong> {user.user_position}</p>
                    <p><strong>Department:</strong> {user.dept_name}</p>
                    <p><strong>Status:</strong> {user.user_status}</p>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button 
                        className="w-full sm:w-auto" 
                        variant="default" 
                        onClick={handleEdit}
                    >
                        Edit
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

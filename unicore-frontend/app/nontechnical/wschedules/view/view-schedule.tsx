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
import { Session } from 'next-auth';

interface Schedule {
    sched_id: number;
    sched_user_id: number;
    sched_dept_id: number;
    sched_days_of_week: string;
    sched_time_in: string;
    sched_time_out: string;
    sched_start_date: string;
    sched_end_date: string;
    sched_notes: string;
    user_fname: string;
    user_lname: string;
    dept_name: string;
}

export default function ScheduleView({ session }: { session: Session | null }) {
    console.log('Session data:', session)
    const userID = session?.user?.user_id;
    const userDept = session?.user?.dept_id;
    const userPosition = session?.user?.user_position;

    const searchParams = useSearchParams();
    const scheduleId = searchParams.get('id');
    const [schedule, setSchedule] = useState<Schedule | null>(null);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            if (scheduleId) {
                try {
                    const response = await axios.get(`http://${ip_address}:8081/schedules/${scheduleId}`);
                    setSchedule(response.data[0]);
                } catch (error) {
                    console.error('Error fetching schedule:', error);
                    toast({
                        title: "Error",
                        description: "Failed to fetch schedule details.",
                        variant: "destructive",
                    });
                }
            }
        };

        fetchData();
    }, [scheduleId]);

    if (!schedule) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto py-4">
            <Card className="w-full max-w-[600px] px-4 sm:px-6 md:px-8">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Schedule Details</CardTitle>
                    <Link href="/nontechnical/wschedules" className="text-blue-500 hover:text-blue-700">
                        Back to Schedules
                    </Link>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <p><strong>Schedule ID:</strong> {schedule.sched_id}</p>
                    <p><strong>Staff Name:</strong> {schedule.user_fname} {schedule.user_lname}</p>
                    <p><strong>Assigned Department:</strong> {schedule.dept_name}</p>
                    <p><strong>Days of Week:</strong> {schedule.sched_days_of_week}</p>
                    <p><strong>Time In:</strong> {schedule.sched_time_in}</p>
                    <p><strong>Time Out:</strong> {schedule.sched_time_out}</p>
                    <p><strong>Start Date:</strong> {schedule.sched_start_date}</p>
                    <p><strong>End Date:</strong> {schedule.sched_end_date}</p>
                    <p><strong>Notes:</strong> {schedule.sched_notes}</p>
                </CardContent>
            </Card>
        </div>
    );
}

"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
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
import { ip_address } from '@/app/ipconfig';
import { Button } from "@/components/ui/button";
import { toast } from '@/hooks/use-toast';

interface JobRequest {
    job_id: number;
    job_rq_id: number;
    job_dept_id: number;
    job_create_date: string;
    job_items: { name_desc: string; quantity: number }[];
    job_purpose: string;
    job_create_user: string;
    job_bmo_approval: string;
    job_custodian_approval: string;
    job_cads_approval: string;
    job_letter: string;
    dept_name: string;
    create_user_fname: string;
    create_user_lname: string;
}

export default function ViewJobRequest() {
    const searchParams = useSearchParams();
    const jobId = searchParams.get('id'); // Fetch the job_id from the URL parameters
    const [jobRequest, setJobRequest] = useState<JobRequest | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchJobRequest = async () => {
            if (jobId) {
                try {
                    const response = await axios.get(`http://${ip_address}:8081/jobrequests/${jobId}`);
                    const jobData = response.data[0];
                 
                    // Check if job_items is a string and parse it
                    if (typeof jobData.job_items === 'string') {
                        jobData.job_items = JSON.parse(jobData.job_items);
                    }
                 
                    setJobRequest(jobData);
                } catch (error) {
                    console.error('Error fetching job request:', error);
                }
            }
        };

        fetchJobRequest();
    }, [jobId]);

    const handleEdit = () => {
        router.push(`/technical/requests/job-requests/edit-declined?id=${jobId}`);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://${ip_address}:8081/jobrequests/delete/${jobRequest?.job_id}`);
            toast({
                title: "Job Request deleted successfully",
                description: "The job request has been deleted.",
            })
            router.push('/technical/requests/job-requests');
        } catch (error) {
            console.error('Error deleting job request:', error);
            toast({
                title: "Error",
                description: "Failed to delete the job request. Please try again.",
                variant: "destructive",
            })
        }
    };

    if (!jobRequest) {
        return <div>Loading...</div>; // Loading state
    }

    return (
        <div className="container mx-auto py-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-6xl">
                <Card className="w-full max-w-[600px] px-4 sm:px-6 md:px-8">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Job Request Details</CardTitle>
                        <Link href="/technical/requests/job-requests" className="text-blue-500 hover:text-blue-700">
                            Back to Job Requests
                        </Link>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4">
                        <p><strong>Job ID:</strong> {jobRequest.job_id}</p>
                        <p><strong>Requisition ID:</strong> {jobRequest.job_rq_id}</p>
                        <p><strong>Department:</strong> {jobRequest.dept_name}</p>
                        <p><strong>Date Submitted:</strong> {jobRequest.job_create_date}</p>
                        <p><strong>Items:</strong></p>
                        <ul>
                            {jobRequest.job_items.map((item, index) => (
                                <li key={index}>{item.name_desc} (Quantity: {item.quantity})</li>
                            ))}
                        </ul>
                        <p><strong>Purpose:</strong> {jobRequest.job_purpose}</p>
                        <p><strong>Submitted By:</strong> {jobRequest.create_user_fname + " " + jobRequest.create_user_lname}</p>
                    </CardContent>
                    <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
                        <Button onClick={handleEdit}>
                            Edit Job Request
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button className="w-full sm:w-auto" variant="destructive">Delete</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the job request.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete}>Yes, Delete this Job Request</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardFooter>
                </Card>

                {/* New Card for Approvals */}
                <Card className="w-full max-w-[600px] px-4 sm:px-6 md:px-8">
                    <CardHeader>
                        <CardTitle>Approval Status</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4">
                        <p><strong>Building Maintenance:</strong> {jobRequest.job_bmo_approval}</p>
                        <p><strong>Property Custodian:</strong> {jobRequest.job_custodian_approval}</p>
                        <p><strong>CADS:</strong> {jobRequest.job_cads_approval}</p>
                    </CardContent>
                </Card>

                {/* Accordion for Job Letter */}
                <Card className="w-full max-w-[600px] px-4 sm:px-6 md:px-8">
                    <CardContent>
                        <Accordion type="single" collapsible className='bg-white px-2 py-1 rounded'>
                            <AccordionItem value='job_letter'>
                                <AccordionTrigger>View Job Request Letter</AccordionTrigger>
                                <AccordionContent className="overflow-x-auto">
                                    <pre>{jobRequest.job_letter}</pre>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { ip_address } from '@/app/ipconfig';
import { Button } from "@/components/ui/button";

interface JobRequest {
    job_id: number;
    job_rq_id: number;
    job_dept_id: number;
    job_create_date: string;
    job_items: { name_desc: string; quantity: number }[];
    job_purpose: string;
    job_create_user: string;
    job_custodian_approval: string;
    job_custodian_user_id: number;
    job_custodian_notes: string;
    job_cads_approval: string;
    job_cads_user_id: number;
    job_cads_notes: string;
    job_letter: string;
    job_recommendation: string;
    job_estimated_cost: number;
    job_recommend_user_id: number;
    job_status: string;
    job_remarks: string;
    dept_name: string;
    create_user_fname: string;
    create_user_lname: string;
    custodian_user_fname: string;
    custodian_user_lname: string;
    cads_user_fname: string;
    cads_user_lname: string;
    recommend_user_fname: string;
    recommend_user_lname: string;
}

export default function ViewJobRequestDetails() {
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
        router.push(`/technical/requests/job-requests/edit-status?id=${jobId}`);
    };

    if (!jobRequest) {
        return <div>Loading...</div>; // Loading state
    }

    return (
        <div className="container mx-auto py-4">
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
            </Card>
            <br />
            {/* New Card for Approvals */}
            <Card className="w-full max-w-[600px] px-4 sm:px-6 md:px-8 mt-4">
                <CardHeader>
                    <CardTitle>Approvals</CardTitle>
                </CardHeader>
                <CardContent>
                    <p><strong>Property Custodian:</strong> {jobRequest.job_custodian_approval}</p>
                    <p><strong>Noted By:</strong> {jobRequest.custodian_user_fname + " " + jobRequest.custodian_user_lname}</p>
                    <p><strong>Notes:</strong> {jobRequest.job_custodian_notes}</p>
                    <br />
                    <p><strong>CADS:</strong> {jobRequest.job_cads_approval}</p>
                    <p><strong>Noted By:</strong> {jobRequest.cads_user_fname + " " + jobRequest.cads_user_lname}</p>
                    <p><strong>Notes:</strong> {jobRequest.job_cads_notes}</p>
                </CardContent>
            </Card>
            <br />
            {/* Accordion for Job Letter */}
            <Card className="w-full max-w-[600px] px-4 sm:px-6 md:px-8 mt-4">
                <CardContent>
                    <Accordion type="single" collapsible className='bg-white px-2 py-1 rounded'>
                        <AccordionItem value='job_letter'>
                            <AccordionTrigger>View Job Request Letter</AccordionTrigger>
                            <AccordionContent>
                                <pre>{jobRequest.job_letter}</pre>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
            <br />
            {/* New Card for Recommendations and Status */}
            <Card className="w-full max-w-[600px] px-4 sm:px-6 md:px-8 mt-4">
                <CardHeader>
                    <CardTitle>Recommendation and Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <p><strong>Recommendation:</strong> {jobRequest.job_recommendation}</p>
                    <p><strong>Estimated Cost:</strong> {jobRequest.job_estimated_cost != null ? jobRequest.job_estimated_cost : 0}</p>
                    <p><strong>Recommended By:</strong> {(jobRequest.recommend_user_fname && jobRequest.recommend_user_lname) ? (jobRequest.recommend_user_fname + " " + jobRequest.recommend_user_lname) : "(None)"}</p>
                    <p><strong>Status:</strong> {jobRequest.job_status}</p>
                    <p><strong>Remarks:</strong> {jobRequest.job_remarks}</p>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleEdit}>
                        Update Job Request
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

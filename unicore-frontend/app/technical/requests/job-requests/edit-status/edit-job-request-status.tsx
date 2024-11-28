'use client';

import { Session } from 'next-auth';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ip_address } from '@/app/ipconfig';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import Link from 'next/link';

interface JobItem {
    name_desc: string;
    quantity: number;
}

interface JobRequest {
    job_id: number;
    job_rq_id: number;
    job_dept_id: number;
    job_create_date: string;
    job_items: JobItem[];
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

interface EditJobRequestProps {
    session: Session | null; // Include session prop to fetch user ID
}

export default function EditJobRequest({ session }: EditJobRequestProps) {
    const searchParams = useSearchParams();
    const jobId = searchParams.get('id'); // Fetch the job_id from the URL parameters
    const [jobRequest, setJobRequest] = useState<JobRequest | null>(null);

    const [formData, setFormData] = useState({
        job_id: '',
        job_rq_id: '',
        job_items: [] as JobItem[],
        job_purpose: '',
        job_recommendation: '',
        job_estimated_cost: 0,
        job_status: '',
        job_remarks: '',
        job_recommend_user_id: session?.user?.user_id || '0', // Fetch user ID from session
    });

    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Fetch the existing job request data using the jobId
        const fetchJobRequest = async () => {
            try {
                const response = await axios.get(`http://${ip_address}:8081/jobrequests/${jobId}`);
                const jobData = response.data[0];
                 
                // Check if job_items is a string and parse it
                if (typeof jobData.job_items === 'string') {
                    jobData.job_items = JSON.parse(jobData.job_items);
                }
                 
                setJobRequest(jobData);
                const jobRequestData = jobData;

                // Set the form data with the fetched job request details
                setFormData({
                    job_id: jobRequestData.job_id,
                    job_rq_id: jobRequestData.job_rq_id,
                    job_items: jobRequestData.job_items,
                    job_purpose: jobRequestData.job_purpose,
                    job_recommendation: jobRequestData.job_recommendation,
                    job_estimated_cost: jobRequestData.job_estimated_cost,
                    job_status: jobRequestData.job_status,
                    job_remarks: jobRequestData.job_remarks,
                    job_recommend_user_id: session?.user?.user_id || '0', // Fetch user ID from session
                });
            } catch (error) {
                console.error('Error fetching job request:', error);
                // Handle error (e.g., show an error message to the user)
            }
        };

        if (jobId) {
            fetchJobRequest();
        }
    }, [jobId, session]);

    const handleChange = (name: string, value: string | number) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Convert job_items to JSON string
        const jobItemsJson = JSON.stringify(formData.job_items);
        const requestData = { ...formData, job_items: jobItemsJson };

        try {
            await axios.put(`http://${ip_address}:8081/jobrequests/status/${jobId}`, requestData); // Adjust the endpoint as needed
            console.log('Form submitted:', requestData);
            setShowSuccessDialog(true);
        } catch (err) {
            console.error('Error fetching job request data:', err);
        }
    };

    const handleDialogClose = () => {
        setShowSuccessDialog(false);
        router.push('/technical/requests/job-requests'); // Adjust this path to your job requests page route
    };

    return (
        <div className="container mx-auto p-4">
            <Card className="max-w-4xl">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Edit Job Request</CardTitle>
                    <Link href="/technical/requests/job-requests" className="text-blue-500 hover:text-blue-700">
                        Back to Job Requests
                    </Link>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4">
                    <p><strong>Job ID:</strong> {jobRequest?.job_id}</p>
                    <p><strong>Requisition ID:</strong> {jobRequest?.job_rq_id}</p>
                    <p><strong>Department:</strong> {jobRequest?.dept_name}</p>
                    <p><strong>Date Submitted:</strong> {jobRequest?.job_create_date}</p>
                    <p><strong>Items:</strong></p>
                    <ul>
                        {jobRequest?.job_items?.map((item, index) => (
                            <li key={index}>{item.name_desc} (Quantity: {item.quantity})</li>
                        ))}
                    </ul>
                    <p><strong>Purpose:</strong> {jobRequest?.job_purpose}</p>
                    <p><strong>Submitted By:</strong> {jobRequest?.create_user_fname + " " + jobRequest?.create_user_lname}</p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="job_recommendation">Recommendation:</Label>
                            <Textarea
                                id="job_recommendation"
                                value={formData.job_recommendation}
                                onChange={(e) => handleChange('job_recommendation', e.target.value)}
                                rows={4}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="job_estimated_cost">Estimated Cost(₱):</Label>
                            <Input
                                type="number"
                                id="job_estimated_cost"
                                value={formData.job_estimated_cost}
                                onChange={(e) => handleChange('job_estimated_cost', parseFloat(e.target.value))}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="job_status">Status:</Label>
                            <Select onValueChange={(value) => handleChange('job_status', value)} value={formData.job_status}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="For Canvas">For Canvas</SelectItem>
                                    <SelectItem value="For PO Approval">For PO Approval</SelectItem>
                                    <SelectItem value="For Ordering">For Ordering</SelectItem>
                                    <SelectItem value="For Delivery">For Delivery</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="job_remarks">Remarks:</Label>
                            <Textarea
                                id="job_remarks"
                                value={formData.job_remarks}
                                onChange={(e) => handleChange('job_remarks', e.target.value)}
                                rows={2}
                            />
                        </div>
                        <Button type="submit" className="w-full">Update Request</Button>
                    </form>
                </CardContent>
            </Card>

            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-green-500">Success</DialogTitle>
                        <DialogDescription>
                            Job request has been successfully updated.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={handleDialogClose}>OK</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
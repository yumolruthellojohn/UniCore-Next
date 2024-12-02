'use client';

import { Session } from 'next-auth';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { ip_address } from '@/app/ipconfig';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
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
    job_create_user_id: number;
    job_bmo_approval: string;
    job_bmo_notes: string;
    job_custodian_approval: string;
    job_custodian_notes: string;
    job_cads_approval: string;
    job_cads_notes: string;
    job_letter: string;
    dept_name: string;
    create_user_fname: string;
    create_user_lname: string;
}

interface EditJobRequestApprovalsProps {
    session: Session | null;
}

export default function EditJobRequestApprovals({ session }: EditJobRequestApprovalsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const jobId = searchParams.get('id'); // Get job ID from query parameters
    const [jobRequest, setJobRequest] = useState<JobRequest | null>(null);
    const [formData, setFormData] = useState({
        job_bmo_approval: '',
        job_bmo_notes: '',
        job_custodian_approval: '',
        job_custodian_notes: '',
        job_cads_approval: '',
        job_cads_notes: '',
        job_bmo_user_id: session?.user?.user_id || '0', // Fetch user ID from session
        job_custodian_user_id: session?.user?.user_id || '0', // Fetch user ID from session
        job_cads_user_id: session?.user?.user_id || '0', // Fetch user ID from session
    });
    const [showSuccessDialog, setShowSuccessDialog] = useState(false); // State for success dialog

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
                    // Initialize formData with existing job request data
                    setFormData({
                        job_bmo_approval: response.data[0].job_bmo_approval,
                        job_bmo_notes: response.data[0].job_bmo_notes,
                        job_custodian_approval: response.data[0].job_custodian_approval,
                        job_custodian_notes: response.data[0].job_custodian_notes,
                        job_cads_approval: response.data[0].job_cads_approval,
                        job_cads_notes: response.data[0].job_cads_notes,
                        job_bmo_user_id: session?.user?.user_id || '0',
                        job_custodian_user_id: session?.user?.user_id || '0',
                        job_cads_user_id: session?.user?.user_id || '0',
                    });
                } catch (error) {
                    console.error('Error fetching job request:', error);
                }
            }
        };

        fetchJobRequest();
    }, [jobId, session]);

    const handleApprovalChange = (field: string, value: string) => {
        setFormData(prevState => ({
            ...prevState,
            [field]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            let apiUrl = '';
            if (session?.user?.user_position === "Property Custodian") {
                apiUrl = `http://${ip_address}:8081/jobrequests/custodian_approval/${jobId}`;
            } else if (session?.user?.user_position === "CADS Director") {
                apiUrl = `http://${ip_address}:8081/jobrequests/cads_approval/${jobId}`;
            } else if (session?.user?.dept_id == '1') {
                apiUrl = `http://${ip_address}:8081/jobrequests/bmo_approval/${jobId}`;
            } else {
                console.error('User position not recognized for API URL.');
            }

            // Send the request to the appropriate API endpoint
            await axios.put(apiUrl, formData);

            let notif_type_new = "";
            if (formData.job_bmo_approval === "Approved" && formData.job_custodian_approval === "Approved" && formData.job_cads_approval === "Approved") {
                notif_type_new = "jobrequest_update_approved_all";
            } else if (formData.job_bmo_approval === "Declined" || formData.job_custodian_approval === "Declined" || formData.job_cads_approval === "Declined") {
                notif_type_new = "jobrequest_update_declined";
            } else {
                notif_type_new = "jobrequest_update";
            }

            // Send notification to requestor
            await axios.post(`http://${ip_address}:8081/notifications/add`, {
                notif_user_id: jobRequest?.job_create_user_id,
                notif_type: notif_type_new,
                notif_content: `Your BMO job request approval has recevied an update.`,
                notif_related_id: jobRequest?.job_id
            });

            setShowSuccessDialog(true); // Show success dialog on successful submission
        } catch (error) {
            console.error('Error updating job request approvals:', error);
        }
    };

    const handleDialogClose = () => {
        setShowSuccessDialog(false);
        router.push('/technical/requests/job-requests'); // Adjust this path to your job requests page route
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
                            {jobRequest?.job_items?.map((item, index) => (
                                <li key={index}>{item.name_desc} (Quantity: {item.quantity})</li>
                            ))}
                        </ul>
                        <p><strong>Purpose:</strong> {jobRequest.job_purpose}</p>
                        <p><strong>Submitted By:</strong> {jobRequest.create_user_fname + " " + jobRequest.create_user_lname}</p>
                    </CardContent>
                </Card>

                {/* Approval Fields in a Separate Card */}
                <Card className="w-full max-w-[600px] px-4 sm:px-6 md:px-8">
                    <CardHeader>
                        <CardTitle>Job Request Approval</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4">
                        <p><strong>Building Maintenance:</strong> {jobRequest.job_bmo_approval}</p>
                        <p><strong>Property Custodian:</strong> {jobRequest.job_custodian_approval}</p>
                        <p><strong>CADS:</strong> {jobRequest.job_cads_approval}</p>
                        <br />
                        <form onSubmit={handleSubmit}>
                            {/* Approval Fields for BMO */}
                            {session?.user?.dept_id == '1' && session?.user?.user_position === "Supervisor" && jobRequest.job_bmo_approval !== "Approved" && (
                                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                    <strong>You can set the Building Maintenance approval of this job request</strong>
                                    <Label htmlFor="job_bmo_approval">Approval Status:</Label>
                                    <Select onValueChange={(value) => handleApprovalChange('job_bmo_approval', value)} value={formData.job_bmo_approval}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select BMO Approval Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Approved">Approved</SelectItem>
                                            <SelectItem value="Declined">Declined</SelectItem>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Label htmlFor="job_bmo_notes">Notes:</Label>
                                    <Textarea
                                        id="job_bmo_notes"
                                        value={formData.job_bmo_notes}
                                        onChange={(e) => handleApprovalChange('job_bmo_notes', e.target.value)}
                                        rows={3}
                                        required
                                    />
                                </div>
                            )}

                            {/* Approval Fields for Property Custodian */}
                            {session?.user?.user_position === "Property Custodian" && jobRequest.job_bmo_approval === "Approved" && jobRequest.job_custodian_approval !== "Approved" && (
                                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                    <strong>You can set the Property Custodian approval of this job request</strong>
                                    <Label htmlFor="job_custodian_approval">Approval Status:</Label>
                                    <div style={{ width: '100%' }}>
                                        <Select onValueChange={(value) => handleApprovalChange('job_custodian_approval', value)} value={formData.job_custodian_approval}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Approval Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Approved">Approved</SelectItem>
                                                <SelectItem value="Declined">Declined</SelectItem>
                                                <SelectItem value="Pending">Pending</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Label htmlFor="job_custodian_notes">Notes:</Label>
                                    <Textarea
                                        id="job_custodian_notes"
                                        value={formData.job_custodian_notes}
                                        onChange={(e) => handleApprovalChange('job_custodian_notes', e.target.value)}
                                        rows={3}
                                        required
                                    />
                                </div>
                            )}

                            {/* Approval Fields for CADS Staff */}
                            {session?.user?.user_position === "CADS Staff" && jobRequest.job_bmo_approval === "Approved" && jobRequest.job_cads_approval !== "Approved" && (
                                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                    <strong>You can set the CADS approval of this job request</strong>
                                    <Label htmlFor="job_cads_approval">Approval Status:</Label>
                                    <Select onValueChange={(value) => handleApprovalChange('job_cads_approval', value)} value={formData.job_cads_approval}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select CADS Approval Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Approved">Approved</SelectItem>
                                            <SelectItem value="Declined">Declined</SelectItem>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Label htmlFor="job_cads_notes">Notes:</Label>
                                    <Textarea
                                        id="job_cads_notes"
                                        value={formData.job_cads_notes}
                                        onChange={(e) => handleApprovalChange('job_cads_notes', e.target.value)}
                                        rows={3}
                                        required
                                    />
                                </div>
                            )}
                            <Button type="submit" variant="default" className="mt-4">
                                Save Changes
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Accordion for Job Letter */}
                <Card className="w-full max-w-[600px] px-4 sm:px-6 md:px-8 mt-4">
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

                {/* Success Dialog */}
                <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="text-green-500">Success</DialogTitle>
                            <DialogDescription>
                                You approved the job request.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button onClick={handleDialogClose}>OK</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
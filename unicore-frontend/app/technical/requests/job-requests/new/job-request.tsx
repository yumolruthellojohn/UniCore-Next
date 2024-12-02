'use client';

import { Session } from 'next-auth';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Link from 'next/link';
import { ip_address } from '@/app/ipconfig';
import { Trash } from 'lucide-react';

interface JobItem {
    name_desc: string;
    quantity: number;
}

interface AddJobRequestProps {
    session: Session | null;
}

export default function AddJobRequest({ session }: AddJobRequestProps) {
    console.log('Session data:', session);
    const job_dept_id = session?.user?.dept_id || '0';
    const job_create_user_id = session?.user?.user_id || '0';

    const [formData, setFormData] = useState({
        job_dept_id: job_dept_id,
        job_create_date: new Date().toISOString().split('T')[0],
        job_items: [] as JobItem[],
        job_purpose: '',
        job_create_user_id: job_create_user_id,
        job_letter: `Dear [Recipient's Name],

I am writing to formally request the following job items for our department:

1. [Item Description 1] - Quantity: [Quantity 1]
2. [Item Description 2] - Quantity: [Quantity 2]
3. [Item Description 3] - Quantity: [Quantity 3]

The purpose of this request is [briefly explain the purpose of the request]. 

Thank you for considering this request. I look forward to your prompt response.

Sincerely,
[Your Name]
[Your Position]
[Your Department]
[Date]`,
        job_bmo_approval: 'Pending',
        job_custodian_approval: 'Pending',
        job_cads_approval: 'Pending',
        job_status: 'Pending'
    });

    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const router = useRouter();

    const handleChange = (name: string, value: string | number) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleItemChange = (index: number, name: string, value: string | number) => {
        const updatedItems = [...formData.job_items];
        updatedItems[index] = { ...updatedItems[index], [name]: value };
        setFormData(prevState => ({
            ...prevState,
            job_items: updatedItems,
        }));
    };

    const addItem = () => {
        setFormData(prevState => ({
            ...prevState,
            job_items: [...prevState.job_items, { quantity: 0, name_desc: '' }]
        }));
    };

    const removeItem = (index: number) => {
        const updatedItems = [...formData.job_items];
        updatedItems.splice(index, 1);
        setFormData(prevState => ({
            ...prevState,
            job_items: updatedItems,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Convert job_items to JSON string
        const jobItemsJson = JSON.stringify(formData.job_items);
        const requestData = { ...formData, job_items: jobItemsJson };

        try {
            await axios.post(`http://${ip_address}:8081/jobrequests/add`, requestData);
            console.log('Form submitted:', requestData);

            //const jobRequestId = response.data[0].job_id;

            // Only send notification if we have the job request ID
            /*if (jobRequestId) {
                await axios.post(`http://${ip_address}:8081/notifications/create-job-request`, {
                    job_request_id: jobRequestId,
                    notification_type: 'new_job_request',
                    content: `A new Job Request has been submitted for approval. Click to view details.`,
                    user_roles: ['property_custodian', 'cads_staff']
                });
            }*/

            setShowSuccessDialog(true);
        } catch (err) {
            console.error('Error fetching job request data:', err);
        }
    };

    const handleDialogClose = () => {
        setShowSuccessDialog(false);
        router.push('/technical/requests/job-requests'); // Adjust this path to your job requests page route
    };

    // Ensure there's at least one item in job_items for initial input
    const initialJobItem = { quantity: 0, name_desc: '' };
    const jobItemsToDisplay = formData.job_items.length > 0 ? formData.job_items : [initialJobItem];

    return (
        <div className="container mx-auto p-4">
            <Card className="max-w-4xl">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>New Job Request</CardTitle>
                    <Link href="/technical/requests/job-requests" className="text-blue-500 hover:text-blue-700">
                        Back to Job Requests
                    </Link>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Items:</Label>
                            <div className="space-y-4">
                                {jobItemsToDisplay.map((item, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-4 p-4 border rounded-lg">
                                        <div className="space-y-2">
                                            <Label>Quantity</Label>
                                            <Input
                                                type="number"
                                                placeholder="Quantity"
                                                value={item.quantity}
                                                onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                                                className='w-25'
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Name and Description</Label>
                                            <Input
                                                placeholder="(Item Details)"
                                                value={item.name_desc}
                                                onChange={(e) => handleItemChange(index, 'name_desc', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="flex items-end justify-end">
                                            <Button 
                                                variant='ghost'
                                                size="icon"
                                                title="Remove Item"
                                                onClick={() => removeItem(index)}
                                                disabled={index === 0}
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button type="button" onClick={addItem} className="mt-2">Add Another Item</Button>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="job_purpose">Purpose:</Label>
                            <Textarea
                                id="job_purpose"
                                value={formData.job_purpose}
                                onChange={(e) => handleChange('job_purpose', e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="job_letter">Job Request Letter:</Label>
                            <Textarea
                                id="job_letter"
                                value={formData.job_letter}
                                onChange={(e) => handleChange('job_letter', e.target.value)}
                                placeholder="Enter your job request letter here..."
                                rows={10}
                            />
                        </div>
                        <Button type="submit" className="w-full">Submit Request</Button>
                    </form>
                </CardContent>
            </Card>

            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-green-500">Success</DialogTitle>
                        <DialogDescription>
                            Job request has been successfully submitted.
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

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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

export default function EditJobRequest() {
    const searchParams = useSearchParams();
    const jobId = searchParams.get('id'); // Fetch the job_id from the URL parameters

    const [formData, setFormData] = useState({
        job_items: [] as JobItem[],
        job_purpose: '',
        job_letter: '',
        job_custodian_approval: 'Pending', // Reset to Pending
        job_cads_approval: 'Pending', // Reset to Pending
        job_status: 'Pending'
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
                 
                const jobRequest = jobData;

                // Set the form data with the fetched job request details
                setFormData({
                    job_items: jobRequest.job_items,
                    job_purpose: jobRequest.job_purpose,
                    job_letter: jobRequest.job_letter,
                    job_custodian_approval: 'Pending', // Reset to Pending
                    job_cads_approval: 'Pending', // Reset to Pending
                    job_status: 'Pending'
                });
                console.log(formData);
            } catch (error) {
                console.error('Error fetching job request:', error);
                // Handle error (e.g., show an error message to the user)
            }
        };

        if (jobId) {
            fetchJobRequest();
        }
    }, [jobId]);

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
            job_items: [...prevState.job_items, { name_desc: '', quantity: 0 }]
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
            await axios.put(`http://${ip_address}:8081/jobrequests/edit/${jobId}`, requestData); // Adjust the endpoint as needed
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

    // Ensure there's at least one item in job_items for initial input
    const initialJobItem = { quantity: 0, name_desc: '' };
    const jobItemsToDisplay = formData.job_items.length > 0 ? formData.job_items : [initialJobItem];

    return (
        <div className="container mx-auto p-4">
            <Card className="max-w-4xl">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Edit Job Request</CardTitle>
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
                                rows={5}
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

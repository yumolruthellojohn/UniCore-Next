'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Link from 'next/link';
import { ip_address } from '@/app/ipconfig';
import Image from 'next/image';

interface FormData {
    room_id: string;
    room_name: string;
    rq_service_type: string;
    rq_status: string;
    rq_notes: string;
    rq_accept_notes: string;
    rq_service_notes: string;
    rq_service_proof: string;
    rq_service_status: string;
}

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB in bytes
const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];

export default function EditServiceFacilityRequest(){
    const router = useRouter();
    const searchParams = useSearchParams();
    const requestID = searchParams.get('id');
    const [loading, setLoading] = useState(true);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [proofPreview, setProofPreview] = useState<string | null>(null);

    const [formData, setFormData] = useState<FormData>({
        room_id: '',
        room_name: '',
        rq_service_type: '',
        rq_status: '',
        rq_notes: '',
        rq_accept_notes: '',
        rq_service_notes: '',
        rq_service_proof: '',
        rq_service_status: ''
    });

    useEffect(() => {
        if (requestID) {
            fetchRequestData();
        }
    }, [requestID]);

    const fetchRequestData = async () => {
        try {
            const response = await axios.get(`http://${ip_address}:8081/requests/service_room/${requestID}`);
            // Log the response to see what data you're getting
            console.log('Fetched request data:', response.data);
            setFormData(response.data[0]);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching request data:', error);
            setLoading(false);
        }
    };

    const handleChange = (name: string, value: string | number) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file type
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            alert('Please upload an image file (PNG, JPEG, or JPG)');
            return;
        }

        // Check file size
        if (file.size > MAX_FILE_SIZE) {
            alert('File size must be less than 1GB');
            return;
        }

        setProofFile(file);
        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setProofPreview(previewUrl);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            
            // Append all form fields with type assertion
            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key as keyof FormData]);
            });

            // Append file if exists
            if (proofFile) {
                formDataToSend.append('rq_service_proof', proofFile);
            }

            // Update the request with FormData
            await axios.put(
                `http://${ip_address}:8081/requests/service_room/progress/${requestID}`, 
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            setShowSuccessDialog(true);
        } catch (err) {
            console.error('Error updating request:', err);
        }
    }

    const handleDialogClose = () => {
        setShowSuccessDialog(false);
        router.push('/service/requests');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <Card className="max-w-3xl">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Service Request for Facility: Service Progress Update</CardTitle>
                    <Link href="/service/requests" className="text-blue-500 hover:text-blue-700">
                        Back to Requests
                    </Link>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                            <div className="py-2">
                                <p><strong>Facility Name:</strong> {formData.room_name}</p>
                                <p><strong>Service Type:</strong> {formData.rq_service_type}</p>
                                <p><strong>Request Status:</strong> {formData.rq_status}</p>
                                <p><strong>Requestor's Purpose/Notes:</strong> {formData.rq_notes}</p>
                                <p><strong>Respondents's Notes:</strong> {formData.rq_accept_notes}</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="rq_status">Service Progress: </Label>
                                <Select 
                                    onValueChange={(value) => handleChange('rq_service_status', value)} 
                                    value={formData.rq_service_status} required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select service progress" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Ongoing">Ongoing</SelectItem>
                                        <SelectItem value="Complete">Complete</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="rq_service_notes">Your Notes:</Label>
                                <Textarea
                                    id="rq_service_notes"
                                    value={formData.rq_service_notes}
                                    onChange={(e) => handleChange('rq_service_notes', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="rq_service_proof">Proof of Service (Image):</Label>
                                <Input
                                    type="file"
                                    id="rq_service_proof"
                                    name="rq_service_proof"
                                    accept="image/png,image/jpeg,image/jpg"
                                    onChange={handleFileChange}
                                    className="w-full border rounded p-2"
                                />
                                {(proofPreview || formData.rq_service_proof) ? (
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-600 mb-2">Preview:</p>
                                        <div className="relative w-full h-[200px]">
                                            <Image 
                                                src={proofPreview || formData.rq_service_proof} 
                                                alt="Proof preview" 
                                                fill
                                                style={{ objectFit: 'contain' }}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-400">No proof of service uploaded</p>
                                )}
                            </div>
                        </div>
                        <Button type="submit" className="w-full">Save Changes</Button>
                    </form>
                </CardContent>
            </Card>

            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-green-500">Success</DialogTitle>
                        <DialogDescription>
                            Service progress has been updated.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={handleDialogClose}>OK</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
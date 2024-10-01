'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Link from 'next/link';

interface Department {
    dept_id: number;
    dept_name: string;
}

export default function AddRoom() {
    const [formData, setFormData] = useState({
        room_name: '',
        room_desc: '',
        room_status: '',
        dept_id: '1', // Default to 'None' department
    });

    const [departments, setDepartments] = useState<Department[]>([]);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Fetch departments from your API
        const fetchDepartments = async () => {
            try {
                const response = await axios.get("http://localhost:8081/departments"); // Adjust this URL to your actual API endpoint
                setDepartments(response.data);
            } catch (error) {
                console.error('Error fetching departments:', error);
                // Handle error (e.g., show error message to user)
            }
        };

        fetchDepartments();
    }, []);

    const handleChange = (name: string, value: string | number) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // API call to save the room
        try {
            await axios.post("http://localhost:8081/rooms/add", formData);
            console.log('Form submitted:', formData);
            setShowSuccessDialog(true);
        } catch (err) {
            console.log(err);
            // You might want to show an error message to the user here
        }
    };

    const handleDialogClose = () => {
        setShowSuccessDialog(false);
        router.push('/admin/rooms'); // Adjust this path to your rooms page route
    };

    return (
        <div className="container mx-auto p-4">
            <Card className="max-w-4xl">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Add New Room</CardTitle>
                    <Link href="/admin/rooms" className="text-blue-500 hover:text-blue-700">
                        Back to Rooms
                    </Link>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="room_name">Name:</Label>
                                <Input
                                    id="room_name"
                                    value={formData.room_name}
                                    onChange={(e) => handleChange('room_name', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="room_desc">Description:</Label>
                                <Textarea
                                    id="room_desc"
                                    value={formData.room_desc}
                                    onChange={(e) => handleChange('room_desc', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="room_status">Status:</Label>
                                <Select onValueChange={(value) => handleChange('room_status', value)} defaultValue={formData.room_status}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Available">Available</SelectItem>
                                        <SelectItem value="Reserved">Reserved</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dept_id">Department:</Label>
                                <Select onValueChange={(value) => handleChange('dept_id', value)} defaultValue={formData.dept_id}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departments.map((dept) => (
                                            <SelectItem key={dept.dept_id} value={dept.dept_id.toString()}>
                                                {dept.dept_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Button type="submit" className="w-full">Add Room</Button>
                    </form>
                </CardContent>
            </Card>

            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-green-500">Success</DialogTitle>
                        <DialogDescription>
                            Room has been successfully saved.
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
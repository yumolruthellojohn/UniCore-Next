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
import { ip_address } from '@/app/ipconfig';

interface Department {
    dept_id: number;
    dept_name: string;
}

export default function AddRoom() {
    const [formData, setFormData] = useState({
        room_bldg: '',
        room_floor: '',
        room_type: '',
        room_name: '',
        room_desc: '',
        room_status: 'Available', //Default to avail
        dept_id: '1', // Default to 'None' department
    });

    const [departments, setDepartments] = useState<Department[]>([]);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Fetch departments from your API
        const fetchDepartments = async () => {
            try {
                const response = await axios.get(`http://${ip_address}:8081/departments`); // Adjust this URL to your actual API endpoint
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
            await axios.post(`http://${ip_address}:8081/rooms/add`, formData);
            console.log('Form submitted:', formData);
            setShowSuccessDialog(true);
        } catch (err) {
            console.log(err);
            // You might want to show an error message to the user here
        }
    };

    const handleDialogClose = () => {
        setShowSuccessDialog(false);
        router.push('/admin/facilities'); // Adjust this path to your facilities page route
    };

    return (
        <div className="container mx-auto p-4">
            <Card className="max-w-4xl">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Add New Facility</CardTitle>
                    <Link href="/admin/facilities" className="text-blue-500 hover:text-blue-700">
                        Back to Facilities
                    </Link>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="room_bldg">Building:</Label>
                                <Select onValueChange={(value) => handleChange('room_bldg', value)} defaultValue={formData.room_bldg}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select building" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Old Building">Old Building</SelectItem>
                                        <SelectItem value="Annex A">Annex 1</SelectItem>
                                        <SelectItem value="Annex B">Annex 2</SelectItem>
                                        <SelectItem value="BE Building">BE Building</SelectItem>
                                        <SelectItem value="NSA Building">NSA Building</SelectItem>
                                        <SelectItem value="CBE Building">CBE Building</SelectItem>
                                        <SelectItem value="Maritime Building">Maritime Building</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="room_floor">Floor Level:</Label>
                                <Select onValueChange={(value) => handleChange('room_floor', value)} defaultValue={formData.room_floor}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select floor level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Ground Level">Ground Level</SelectItem>
                                        <SelectItem value="2nd Floor">2nd Floor</SelectItem>
                                        <SelectItem value="3rd Floor">3rd Floor</SelectItem>
                                        <SelectItem value="4th Floor">4th Floor</SelectItem>
                                        <SelectItem value="5th Floor">5th Floor</SelectItem>
                                        <SelectItem value="6th Floor">6th Floor</SelectItem>
                                        <SelectItem value="7th Floor">7th Floor</SelectItem>
                                        <SelectItem value="8th Floor">8th Floor</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="room_type">Type:</Label>
                                <Select onValueChange={(value) => handleChange('room_type', value)} defaultValue={formData.room_type}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Lecture">Lecture</SelectItem>
                                        <SelectItem value="Laboratory">Laboratory</SelectItem>
                                        <SelectItem value="Office">Office</SelectItem>
                                        <SelectItem value="Multi-Purpose">Multi-Purpose</SelectItem>
                                        <SelectItem value="Stock Room">Stock Room</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
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
                        <Button type="submit" className="w-full">Add Facility</Button>
                    </form>
                </CardContent>
            </Card>

            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-green-500">Success</DialogTitle>
                        <DialogDescription>
                            Facility has been successfully saved.
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
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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

export default function EditRoom() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const roomId = searchParams.get('id');
    const [loading, setLoading] = useState(true);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [departments, setDepartments] = useState<Department[]>([]);

    const [formData, setFormData] = useState({
        room_bldg: '',
        room_floor: '',
        room_name: '',
        room_desc: '',
        dept_id: '',
    });

    useEffect(() => {
        if (roomId) {
            fetchRoomData();
            fetchDepartments();
        }
    }, [roomId]);

    const fetchRoomData = async () => {
        try {
            const response = await axios.get(`http://${ip_address}:8081/rooms/${roomId}`);
            // Log the response to see what data you're getting
            console.log('Fetched room data:', response.data);
            setFormData(response.data[0]);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching room data:', error);
            setLoading(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await axios.get(`http://${ip_address}:8081/departments`);
            setDepartments(response.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const handleChange = (name: string, value: string | number) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await axios.put(`http://${ip_address}:8081/rooms/${roomId}`, formData);
            setShowSuccessDialog(true);
        } catch (err) {
            console.error('Error updating item:', err);
            // You might want to show an error message to the user here
        }
    };

    const handleDialogClose = () => {
        setShowSuccessDialog(false);
        router.push('/admin/facilities');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <Card className="max-w-4xl">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Edit Facility</CardTitle>
                    <Link href="/admin/facilities" className="text-blue-500 hover:text-blue-700">
                        Back to Facilities
                    </Link>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="room_bldg">Building:</Label>
                                <Select onValueChange={(value) => handleChange('room_bldg', value)} value={formData.room_bldg}>
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
                                <Select onValueChange={(value) => handleChange('room_floor', value)} value={formData.room_floor}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select floor level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1st Floor">1st Floor</SelectItem>
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
                                <Select onValueChange={(value) => handleChange('dept_id', value)} value={formData.dept_id.toString()}>
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
                        <Button type="submit" className="w-full">Update Facility</Button>
                    </form>
                </CardContent>
            </Card>

            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-green-500">Success</DialogTitle>
                        <DialogDescription>
                            Facility has been successfully updated.
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
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Button } from "@/components/ui/button"
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
import { useSession } from 'next-auth/react';
import { ip_address } from '@/app/ipconfig';

interface Item {
    item_id: number;
    item_name: string;
}

interface Department {
    dept_id: number;
    dept_name: string;
}

interface User {
    user_id: number;
    user_fname: string;
    user_lname: string;
}

export default function NewServiceItem() {
    const { data: session, status } = useSession();
    const router = useRouter();

    console.log('Session status:', status);
    console.log('Session data:', session);

    const today = new Date();
    const month = today.getMonth()+1;
    const year = today.getFullYear();
    const date = today.getDate();
    const currentDate = year + "-" + month + "-" + date;

    const [formData, setFormData] = useState({
        rq_type: 'Service for Item',
        dept_id: '', // Default to 'None' department
        item_id: '', // Default to 'None' item
        rq_service_type: 'Maintenance',
        rq_prio_level: 'Moderate', // Default to 'Moderate' priority
        rq_notes: '',
        rq_create_date: currentDate,
        rq_create_user_id: '',
        rq_status: 'Request Submitted'
    });

    const [departments, setDepartments] = useState<Department[]>([]);
    const [items, setItems] = useState<Item[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    useEffect(() => {
        const fetchItemDeptData = async () => {
            try {
                const dept_response = await axios.get(`http://${ip_address}:8081/departments`); // Adjust this URL to your actual API endpoint
                setDepartments(dept_response.data);
                const item_response = await axios.get(`http://${ip_address}:8081/items`); // Adjust this URL to your actual API endpoint
                setItems(item_response.data);
                const user_response = await axios.get(`http://${ip_address}:8081/users`); // Adjust this URL to your actual API endpoint
                setUsers(user_response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle error (e.g., show error message to user)
            }
        };

        fetchItemDeptData();
    }, []);

    const handleChange = (name: string, value: string | number) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // API call to save the item reservation request
        try {
            await axios.post(`http://${ip_address}:8081/requests/service_item/add`, formData);
            console.log('Form submitted:', formData);
            setShowSuccessDialog(true);
        } catch (err) {
            console.log(err);
            // You might want to show an error message to the user here
        }
    };

    const handleDialogClose = () => {
        setShowSuccessDialog(false);
        router.push('/admin/requests'); // Adjust this path to your requests page route
    };

    return (
        <div className="container mx-auto p-4">
            <Card className="max-w-4xl">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>New Service Request</CardTitle>
                    <Link href="/admin/requests" className="text-blue-500 hover:text-blue-700">
                        Back to Requests
                    </Link>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="rq_create_user_id">Requestor:</Label>
                                <Select onValueChange={(value) => handleChange('rq_create_user_id', value)} defaultValue={formData.rq_create_user_id} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a user" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map((user) => (
                                            <SelectItem key={user.user_id} value={user.user_id.toString()}>
                                                {user.user_fname + " " + user.user_lname}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dept_id">Department:</Label>
                                <Select onValueChange={(value) => handleChange('dept_id', value)} defaultValue={formData.dept_id} required>
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
                            <div className="space-y-2">
                                <Label htmlFor="item_id">Item:</Label>
                                <Select onValueChange={(value) => handleChange('item_id', value)} defaultValue={formData.item_id} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an item" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {items.map((item) => (
                                            <SelectItem key={item.item_id} value={item.item_id.toString()}>
                                                {item.item_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="rq_service_type">Service Type:</Label>
                                <Select onValueChange={(value) => handleChange('rq_service_type', value)} defaultValue={formData.rq_service_type} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a service type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                                        <SelectItem value="Repair">Repair</SelectItem>
                                        <SelectItem value="Installation">Installation</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="rq_prio_level">Priority Level:</Label>
                                <Select onValueChange={(value) => handleChange('rq_prio_level', value)} defaultValue={formData.rq_prio_level} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select priority level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Moderate">Moderate</SelectItem>
                                        <SelectItem value="Urgent">Urgent</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="rq_notes">Request Notes:</Label>
                                <Textarea
                                    id="rq_notes"
                                    value={formData.rq_notes}
                                    onChange={(e) => handleChange('rq_notes', e.target.value)}
                                    required
                                />
                            </div>
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
                            Request has been submitted.
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

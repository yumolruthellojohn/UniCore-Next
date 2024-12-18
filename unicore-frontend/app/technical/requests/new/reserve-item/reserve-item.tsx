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
import { Session } from 'next-auth';
import { ip_address } from '@/app/ipconfig';

interface Item {
    item_id: number;
    item_name: string;
}

interface Department {
    dept_id: number;
    dept_name: string;
}

export default function NewReserveItem({ session }: { session: Session | null }) {
    //const { session, status } = useCurrentSession();
    //const {data : session, status} = useSession();

    const router = useRouter();

    //console.log('Session status:', status);
    console.log('Session data:', session);

    const today = new Date();
    const month = today.getMonth()+1;
    const year = today.getFullYear();
    const date = today.getDate();
    const currentDate = year + "-" + month + "-" + date;

    const [formData, setFormData] = useState({
        rq_type: 'Reserve Item',
        dept_id: '', // Default to BMO department
        item_id: '',
        rq_quantity: 0,
        rq_prio_level: 'Moderate', // Default to 'Moderate' priority
        rq_start_date: '',
        rq_end_date: '',
        rq_start_time: '',
        rq_end_time: '',
        rq_notes: '',
        rq_create_date: currentDate,
        rq_create_user_id: '',
        rq_status: 'Request Submitted',

    });

    const [departments, setDepartments] = useState<Department[]>([]);
    const [items, setItems] = useState<Item[]>([]);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    useEffect(() => {
        const fetchItemDeptData = async () => {
            if (session?.user?.user_id) {
                const newUserId = session.user.user_id.toString();
                console.log('Setting new user id:', newUserId);
                try {
                    const id_response = await axios.get(`http://${ip_address}:8081/users/user_id/${newUserId}`); // Adjust this URL to your actual API endpoint
                    console.log(id_response.data[0].user_id);
                    setFormData(prevState => ({
                        ...prevState,
                        rq_create_user_id: id_response.data[0].user_id,
                    }));
                } catch (error) {
                    console.error('Error fetching user id:', error);
                    // Handle error (e.g., show error message to user)
                }
            }

            try {
                const dept_response = await axios.get(`http://${ip_address}:8081/departments`); // Adjust this URL to your actual API endpoint
                setDepartments(dept_response.data);
                //const item_response = await axios.get(`http://${ip_address}:8081/items`); // Adjust this URL to your actual API endpoint
                //setItems(item_response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle error (e.g., show error message to user)
            }
        };

        fetchItemDeptData();
    }, []);

    const handleChange = async (name: string, value: string | number) => {
        setFormData(prevState => {
            const newState = {
                ...prevState,
                [name]: value,
            };

            if (name === 'rq_prio_level' && value === 'Urgent') {
                newState.rq_start_date = currentDate;
            }

            return newState;
        });

        // Fetch items when department changes
        if (name === 'dept_id') {
            try {
                const response = await axios.get(`http://${ip_address}:8081/items/deptID/${value}`);
                setItems(response.data);
                // Clear the selected item when department changes
                setFormData(prev => ({ ...prev, item_id: '' }));
            } catch (error) {
                console.error('Error fetching items for department:', error);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // API call to save the item reservation request
        try {
            await axios.post(`http://${ip_address}:8081/requests/reserve_item/add`, formData);
            console.log('Form submitted:', formData);
            setShowSuccessDialog(true);
        } catch (err) {
            console.log(err);
            // You might want to show an error message to the user here
        }
    };

    const handleDialogClose = () => {
        setShowSuccessDialog(false);
        router.push('/technical/requests'); // Adjust this path to your requests page route
    };

    return (
        <div className="container mx-auto p-4">
            <Card className="max-w-4xl">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>New Item Reservation Request</CardTitle>
                    <Link href="/technical/requests" className="text-blue-500 hover:text-blue-700">
                        Back to Requests
                    </Link>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="dept_id">Submit to (Department):</Label>
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
                                <Label htmlFor="rq_quantity">Requested Quantity:</Label>
                                <Input
                                    type="number"
                                    id="rq_quantity"
                                    value={formData.rq_quantity}
                                    onChange={(e) => handleChange('rq_quantity', parseInt(e.target.value))}
                                    required
                                />
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
                            <div className="space-y-2">
                                <Label htmlFor="rq_start_date">Start Date:</Label>
                                {formData.rq_prio_level === 'Urgent' ? (
                                    <div className="p-2 bg-gray-100 rounded-md">
                                        Today ({currentDate})
                                    </div>
                                ) : (
                                    <Input
                                        type="date"
                                        id="rq_start_date"
                                        value={formData.rq_start_date}
                                        onChange={(e) => handleChange('rq_start_date', e.target.value)}
                                        required
                                    />
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="rq_end_date">End Date:</Label>
                                <Input
                                    type="date"
                                    id="rq_end_date"
                                    value={formData.rq_end_date}
                                    onChange={(e) => handleChange('rq_end_date', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="rq_start_time">Start Time:</Label>
                                <Input
                                    type="time"
                                    id="rq_start_time"
                                    value={formData.rq_start_time}
                                    onChange={(e) => handleChange('rq_start_time', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="rq_end_time">End Time:</Label>
                                <Input
                                    type="time"
                                    id="rq_end_time"
                                    value={formData.rq_end_time}
                                    onChange={(e) => handleChange('rq_end_time', e.target.value)}
                                    required
                                />
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
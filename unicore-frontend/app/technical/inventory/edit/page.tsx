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

interface Department {
    dept_id: number;
    dept_name: string;
}

export default function EditInventoryItem() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const itemId = searchParams.get('id');
    const [loading, setLoading] = useState(true);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [itemTotal, setItemTotal] = useState(0);

    const [formData, setFormData] = useState({
        item_category: '',
        item_control: '',
        item_quantity: 0,
        item_measure: '',
        item_name: '',
        item_desc: '',
        item_buy_date: '',
        item_buy_cost: 0,
        item_remarks: '',
        item_status: '',
        dept_id: '',
    });

    useEffect(() => {
        if (itemId) {
            fetchItemData();
            fetchDepartments();
        }
    }, [itemId]);

    useEffect(() => {
        // Calculate item total whenever quantity or buy cost changes
        const quantity = formData.item_quantity ?? 0;
        const cost = formData.item_buy_cost ?? 0;
        const total = quantity * cost;
        setItemTotal(total);
    }, [formData.item_quantity, formData.item_buy_cost]);

    const fetchItemData = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/items/${itemId}`);
            // Log the response to see what data you're getting
            console.log('Fetched item data:', response.data);
            setFormData(response.data[0]);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching item data:', error);
            setLoading(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await axios.get("http://localhost:8081/departments");
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
            await axios.put(`http://localhost:8081/items/${itemId}`, formData);
            setShowSuccessDialog(true);
        } catch (err) {
            console.error('Error updating item:', err);
            // You might want to show an error message to the user here
        }
    };

    const handleDialogClose = () => {
        setShowSuccessDialog(false);
        router.push('/technical/inventory');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <Card className="max-w-4xl">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Edit Item</CardTitle>
                    <Link href="/technical/inventory" className="text-blue-500 hover:text-blue-700">
                        Back to Inventory
                    </Link>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="item_category">Category:</Label>
                                <Input
                                    id="item_category"
                                    value={formData.item_category}
                                    onChange={(e) => handleChange('item_category', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="item_control">Control Number:</Label>
                                <Input
                                    id="item_control"
                                    value={formData.item_control}
                                    onChange={(e) => handleChange('item_control', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="item_quantity">Quantity:</Label>
                                <Input
                                    type="number"
                                    id="item_quantity"
                                    value={formData.item_quantity}
                                    onChange={(e) => handleChange('item_quantity', parseInt(e.target.value))}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="item_measure">Unit of Measurement:</Label>
                                <Input
                                    id="item_measure"
                                    value={formData.item_measure}
                                    onChange={(e) => handleChange('item_measure', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="item_name">Name:</Label>
                                <Input
                                    id="item_name"
                                    value={formData.item_name}
                                    onChange={(e) => handleChange('item_name', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="item_desc">Description:</Label>
                                <Textarea
                                    id="item_desc"
                                    value={formData.item_desc}
                                    onChange={(e) => handleChange('item_desc', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="item_buy_date">Purchase Date</Label>
                                <Input
                                    type="date"
                                    id="item_buy_date"
                                    value={formData.item_buy_date ? formData.item_buy_date.split('T')[0] : ''}
                                    onChange={(e) => handleChange('item_buy_date', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="item_buy_cost">Cost per unit:</Label>
                                <Input
                                    type="number"
                                    id="item_buy_cost"
                                    value={formData.item_buy_cost}
                                    onChange={(e) => handleChange('item_buy_cost', parseFloat(e.target.value))}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="item_total">Total Cost:</Label>
                                <div className="p-2 bg-gray-100 rounded-md">{itemTotal.toFixed(2)}</div>
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
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="item_remarks">Condition Remarks:</Label>
                                <Textarea
                                    id="item_remarks"
                                    value={formData.item_remarks}
                                    onChange={(e) => handleChange('item_remarks', e.target.value)}
                                />
                            </div>
                        </div>
                        <Button type="submit" className="w-full">Update Item</Button>
                    </form>
                </CardContent>
            </Card>

            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-green-500">Success</DialogTitle>
                        <DialogDescription>
                            Item has been successfully updated.
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
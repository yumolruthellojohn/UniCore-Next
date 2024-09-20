'use client';
import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AddInventoryItem() {
    const [formData, setFormData] = useState({
        item_category: '',
        item_control: '',
        item_quantity: 0,
        item_measure: '',
        item_name_desc: '',
        item_buy_date: '',
        item_buy_cost: 0,
        item_total: 0,
        item_remarks: '',
        dept_id: '1', // Default to 'None' department
    });

    const handleChange = (name: string, value: string | number) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // TODO: Implement API call to save the item
        console.log('Form submitted:', formData);
    };

    return (
        <div className="container mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Add Inventory Item</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="item_category">Category</Label>
                                <Input
                                    id="item_category"
                                    value={formData.item_category}
                                    onChange={(e) => handleChange('item_category', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="item_control">Control Number</Label>
                                <Input
                                    id="item_control"
                                    value={formData.item_control}
                                    onChange={(e) => handleChange('item_control', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="item_quantity">Quantity</Label>
                                <Input
                                    type="number"
                                    id="item_quantity"
                                    value={formData.item_quantity}
                                    onChange={(e) => handleChange('item_quantity', parseInt(e.target.value))}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="item_measure">Measure</Label>
                                <Input
                                    id="item_measure"
                                    value={formData.item_measure}
                                    onChange={(e) => handleChange('item_measure', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="item_name_desc">Name/Description</Label>
                                <Textarea
                                    id="item_name_desc"
                                    value={formData.item_name_desc}
                                    onChange={(e) => handleChange('item_name_desc', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="item_buy_date">Buy Date</Label>
                                <Input
                                    type="date"
                                    id="item_buy_date"
                                    value={formData.item_buy_date}
                                    onChange={(e) => handleChange('item_buy_date', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="item_buy_cost">Buy Cost</Label>
                                <Input
                                    type="number"
                                    id="item_buy_cost"
                                    value={formData.item_buy_cost}
                                    onChange={(e) => handleChange('item_buy_cost', parseFloat(e.target.value))}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="item_total">Total</Label>
                                <Input
                                    type="number"
                                    id="item_total"
                                    value={formData.item_total}
                                    onChange={(e) => handleChange('item_total', parseFloat(e.target.value))}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dept_id">Department</Label>
                                <Select onValueChange={(value) => handleChange('dept_id', value)} defaultValue={formData.dept_id}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">None</SelectItem>
                                        <SelectItem value="2">College of Computer Studies (CCS)</SelectItem>
                                        {/* Add more department options as needed */}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="item_remarks">Remarks</Label>
                                <Textarea
                                    id="item_remarks"
                                    value={formData.item_remarks}
                                    onChange={(e) => handleChange('item_remarks', e.target.value)}
                                />
                            </div>
                        </div>
                        <Button type="submit" className="w-full">Add Item</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
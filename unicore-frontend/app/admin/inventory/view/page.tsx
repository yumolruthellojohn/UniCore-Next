"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface Item {
  item_id: number;
  item_category: string;
  item_control: string | null;
  item_quantity: number;
  item_measure: string;
  item_name: string;
  item_desc: string;
  item_buy_date: string;
  item_buy_cost: number;
  item_total: number;
  item_remarks: string;
  dept_id: number;
  dept_name: string;
}

export default function ItemView() {
    const searchParams = useSearchParams();
    const itemId = searchParams.get('id');
    const [item, setItem] = useState<Item | null>(null);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
    // Fetch item details from your API
        const fetchItem = async () => {
      const response = await axios.get(`http://localhost:8081/items/${itemId}`);
      setItem(response.data[0]);
        };

    fetchItem();
    }, []);

    if (!item) {
        return <div>Loading...</div>;
    }

    const handleEdit = () => {
        router.push(`/admin/inventory/edit?id=${item.item_id}`);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8081/items/${item.item_id}`);
            toast({
                title: "Item deleted successfully",
                description: "The item has been removed from the inventory.",
            })
            router.push('/admin/inventory');
        } catch (error) {
            console.error('Error deleting item:', error);
            toast({
                title: "Error",
                description: "Failed to delete the item. Please try again.",
                variant: "destructive",
            })
        }
    };

    return (
        <Card className="w-full max-w-[600px] px-4 sm:px-6 md:px-8">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Item Details</CardTitle>
                <Link href="/admin/inventory" className="text-blue-500 hover:text-blue-700">
                    Back
                </Link>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <p><strong>ID:</strong> {item.item_id}</p>
                <p><strong>Category:</strong> {item.item_category}</p>
                <p><strong>Control Number:</strong> {item.item_control || 'N/A'}</p>
                <p><strong>Quantity:</strong> {item.item_quantity}</p>
                <p><strong>Unit of Measure:</strong> {item.item_measure}</p>
                <p><strong>Name:</strong> {item.item_name}</p>
                <p><strong>Description:</strong> {item.item_desc}</p>
                <p><strong>Purchase Date:</strong> {item.item_buy_date}</p>
                <p><strong>Purchase Cost:</strong> Php {item.item_buy_cost.toFixed(2)}</p>
                <p><strong>Total Cost:</strong> Php {item.item_total.toFixed(2)}</p>
                <p><strong>Remarks:</strong> {item.item_remarks}</p>
                <p><strong>Department:</strong> {item.dept_name}</p>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
                <Button 
                    className="w-full sm:w-auto" 
                    variant="default" 
                    onClick={handleEdit}
                >
                    Edit
                </Button>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button className="w-full sm:w-auto" variant="destructive">Delete</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the item from the inventory.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>Yes, Delete this Item</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        </Card>
    );
}
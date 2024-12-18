"use client";

import { useEffect, useState } from 'react';
import { createItemRequestsColumns, ItemRequests } from "@/app/technical/inventory/relate-item-columns";
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
import { DataTable } from '@/components/data-table/data-table-no-change';
import { ip_address } from '@/app/ipconfig';

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
  item_status: string;
  dept_id: number;
  dept_name: string;
  item_reserved: number
  item_serviced: number
}

const filterRelateItemColumn = {
  id: "rq_type",
  title: "Request Type",
}

export default function ItemView() {
    const searchParams = useSearchParams();
    const itemId = searchParams.get('id');
    const [itemRequestsData, setItemRequestsData] = useState<ItemRequests[]>([]);
    const [item, setItem] = useState<Item | null>(null);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            if (itemId) {
                // Fetch item details
                const itemResponse = await axios.get(`http://${ip_address}:8081/items/${itemId}`);
                setItem(itemResponse.data[0]);

                // Fetch related requests
                const requestsResponse = await axios.get(`http://${ip_address}:8081/requests/relate_item/${itemId}`);
                setItemRequestsData(requestsResponse.data);
            }   
        };

        fetchData();
    }, [itemId]);

    if (!item) {
        return <div>Loading...</div>;
    }

    const handleEdit = () => {
        router.push(`/technical/inventory/edit?id=${item.item_id}`);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://${ip_address}:8081/items/${item.item_id}`);
            toast({
                title: "Item deleted successfully",
                description: "The item has been removed from the inventory.",
            })
            router.push('/technical/inventory');
        } catch (error) {
            console.error('Error deleting item:', error);
            toast({
                title: "Error",
                description: "Failed to delete the item. Please try again.",
                variant: "destructive",
            })
        }
    };

    const itemRequestsColumns = createItemRequestsColumns();

    return (
        <div className="container mx-auto py-4">
            <Card className="w-full max-w-[600px] px-4 sm:px-6 md:px-8 mb-8">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Item Details</CardTitle>
                    <Link href="/technical/inventory" className="text-blue-500 hover:text-blue-700">
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
                    <p><strong>Condition Remarks:</strong> {item.item_remarks}</p>
                    <p><strong>Department:</strong> {item.dept_name}</p>
                    <p><strong>Status:</strong> {item.item_status}</p>
                    <p><strong>Reserved:</strong> {item.item_reserved}</p>
                    <p><strong>Serviced:</strong> {item.item_serviced}</p>
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
            <br />
            <Card className="w-full px-4 sm:px-6 md:px-8">
                <CardHeader>
                    <CardTitle>Related Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable 
                        columns={itemRequestsColumns}
                        data={itemRequestsData}
                        filterColumn={filterRelateItemColumn}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
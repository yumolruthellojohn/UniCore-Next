'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createColumns, Item } from "./inventory-columns"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableAdd } from "@/components/data-table/data-table-add-button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster"
import axios from "axios";
import { Button } from '@/components/ui/button';
import { ip_address } from '@/app/ipconfig';

async function getData(): Promise<Item[]> {
    let item = null;
    try {
        const response = await axios.get(`http://${ip_address}:8081/items`);
        item = response.data;
      } catch (err) {
        console.log(err);
        item = null;
      }
    
    return item;
}

const filterColumn = {
    id: "item_name",
    title: "Name",
}

export default function Inventory() {
    const [data, setData] = useState<Item[]>([]);

    const refreshData = useCallback(async () => {
        const freshData = await getData();
        setData(freshData);
    }, []);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    const columns = useMemo(() => createColumns(refreshData), [refreshData]);

    return (
        <div className="container mx-auto py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
              <Card className="w-full">
                <CardHeader className="pb-3">
                  <CardTitle>Inventory</CardTitle>
                  <CardDescription className="text-balance leading-relaxed">
                    Manage the items and view their details.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <DataTableAdd text="Add New Item" href="/admin/inventory/new" />
                </CardFooter>
              </Card>
              <Card className="w-full">
                <CardHeader className="pb-3">
                  <CardTitle>Export Data</CardTitle>
                  <CardDescription className="text-balance leading-relaxed">
                    Fetch data and export to PDF.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Generate PDF</Button>
                </CardFooter>
              </Card>
            </div>
            <br />
            <DataTable 
                columns={columns}
                data={data} 
                filterColumn={filterColumn}
                onDataChange={refreshData}
            />
            <Toaster />
        </div>
    )
}
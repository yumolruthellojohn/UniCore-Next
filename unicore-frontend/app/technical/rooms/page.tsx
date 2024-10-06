'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createColumns, Room } from "./rooms-columns";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableAdd } from "@/components/data-table/data-table-add-button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";
import axios from "axios";
import { Button } from '@/components/ui/button';

async function getData(): Promise<Room[]> {
    let room = null;
    try {
        const response = await axios.get("http://localhost:8081/rooms");
        room = response.data;
      } catch (err) {
        console.log(err);
        room = null;
      }
    
    return room;
}

const filterColumn = {
    id: "room_name",
    title: "Name",
}

export default function Rooms() {
    const [data, setData] = useState<Room[]>([]);

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
                  <CardTitle>Rooms</CardTitle>
                  <CardDescription className="max-w-lg text-balance leading-relaxed">
                    Manage the rooms and view their details.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <DataTableAdd text="Add New Room" href="/admin/rooms/new" />
                </CardFooter>
              </Card>
              <Card className="w-full">
                <CardHeader className="pb-3">
                  <CardTitle>Export Data</CardTitle>
                  <CardDescription className="text-balance leading-relaxed">
                    Fetch all data and export to PDF.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Generate PDF</Button>
                </CardFooter>
              </Card>
            </div>
            <div className='max-w-5xl'>
              <DataTable 
                  columns={columns}
                  data={data} 
                  filterColumn={filterColumn}
                  onDataChange={refreshData}
              />
            </div>
            <Toaster />
        </div>
    )
}
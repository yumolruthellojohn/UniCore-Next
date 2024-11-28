'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createColumns, Room } from "./rooms-columns";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableAdd } from "@/components/data-table/data-table-add-button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";
import axios from "axios";
import { Button } from '@/components/ui/button';
import { ip_address } from '@/app/ipconfig';
import GenerateFacilityPDFReport from './report';

async function getData(): Promise<Room[]> {
    let room = null;
    try {
        const response = await axios.get(`http://${ip_address}:8081/rooms`);
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
              <Card className="w-full">
                <CardHeader className="pb-3">
                  <CardTitle>Facilities</CardTitle>
                  <CardDescription className="max-w-lg text-balance leading-relaxed">
                    Manage the facilities and view their details.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <DataTableAdd text="Add New Facility" href="/technical/facilities/new" />
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
                  <GenerateFacilityPDFReport></GenerateFacilityPDFReport>
                </CardFooter>
              </Card>
            </div>
            <br />
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
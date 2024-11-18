'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createReserveItemColumns, ReserveItem } from "./reserve-item-columns"
import { createReserveRoomColumns, ReserveRoom } from "./reserve-room-columns"
import { createServiceItemColumns, ServiceItem } from "./service-item-columns"
import { createServiceRoomColumns, ServiceRoom } from "./service-room-columns"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableAdd } from "@/components/data-table/data-table-add-button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster"
import axios from "axios";
import { Button } from '@/components/ui/button';
import { ip_address } from '@/app/ipconfig';

async function getReserveItemData(): Promise<ReserveItem[]> {
    let reserveItem = null;
    try {
        const response = await axios.get(`http://${ip_address}:8081/requests/reserve_item`);
        reserveItem = response.data;
      } catch (err) {
        console.log(err);
        reserveItem = null;
      }
    
    return reserveItem;
}

async function getReserveRoomData(): Promise<ReserveRoom[]> {
  let reserveRoom = null;
  try {
      const response = await axios.get(`http://${ip_address}:8081/requests/reserve_room`);
      reserveRoom = response.data;
    } catch (err) {
      console.log(err);
      reserveRoom = null;
    }
  
  return reserveRoom;
}

async function getServiceItemData(): Promise<ServiceItem[]> {
  let serviceItem = null;
    try {
      const response = await axios.get(`http://${ip_address}:8081/requests/service_item`);
      serviceItem = response.data;
    } catch (err) {
      console.log(err);
      serviceItem = null;
    }

    return serviceItem;
}

async function getServiceRoomData(): Promise<ServiceRoom[]> {
  let serviceRoom = null;
    try {
      const response = await axios.get(`http://${ip_address}:8081/requests/service_room`);
      serviceRoom = response.data;
    } catch (err) {
      console.log(err);
      serviceRoom = null;
    }

    return serviceRoom;
}

const filterReserveItemColumn = {
  id: "item_name",
  title: "Item Name",
}

const filterReserveRoomColumn = {
  id: "room_name",
  title: "Room Name",
}

const filterServiceItemColumn = {
  id: "item_name",
  title: "Item Name",
}

const filterServiceRoomColumn = {
  id: "room_name",
  title: "Room Name",
}

export default function Requests() {
    const [reserveItemData, setReserveItemData] = useState<ReserveItem[]>([]);
    const [reserveRoomData, setReserveRoomData] = useState<ReserveRoom[]>([]);
    const [serviceItemData, setServiceItemData] = useState<ServiceItem[]>([]);
    const [serviceRoomData, setServiceRoomData] = useState<ServiceRoom[]>([]);
    const refreshData = useCallback(async () => {
        const freshReserveItemData = await getReserveItemData();
        setReserveItemData(freshReserveItemData);
        const freshReserveRoomData = await getReserveRoomData();
        setReserveRoomData(freshReserveRoomData);
        const freshServiceItemData = await getServiceItemData();
        setServiceItemData(freshServiceItemData);
        const freshServiceRoomData = await getServiceRoomData();
        setServiceRoomData(freshServiceRoomData);
    }, []);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    const reserveItemColumns = useMemo(() => createReserveItemColumns(refreshData), [refreshData]);
    const reserveRoomColumns = useMemo(() => createReserveRoomColumns(refreshData), [refreshData]);
    const serviceItemColumns = useMemo(() => createServiceItemColumns(refreshData), [refreshData]);
    const serviceRoomColumns = useMemo(() => createServiceRoomColumns(refreshData), [refreshData]);

    return (
        <div className="container mx-auto py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
              <Card className="w-full">
                <CardHeader className="pb-3">
                  <CardTitle>Requests</CardTitle>
                  <CardDescription className="max-w-lg text-balance leading-relaxed">
                    Manage the requests and view their details.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <DataTableAdd text="Create New Request" href="/admin/requests/new" />
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
            <Card>
              <CardHeader>
                <CardTitle>
                  <h1 className="text-2xl font-bold">Item Reservations</h1>
                </CardTitle>
              </CardHeader>
                <div className='px-4 pb-2'>
                  <DataTable 
                    columns={reserveItemColumns}
                    data={reserveItemData} 
                    filterColumn={filterReserveItemColumn}
                    onDataChange={refreshData}
                  />
                </div>
            </Card>
            <br />
            <Card>
              <CardHeader>
                <CardTitle>
                  <h1 className="text-2xl font-bold">Room Reservations</h1>
                </CardTitle>
              </CardHeader>
              <div className='px-4 pb-2'>
                <DataTable 
                  columns={reserveRoomColumns}
                  data={reserveRoomData} 
                  filterColumn={filterReserveRoomColumn}
                  onDataChange={refreshData}
                />
              </div>
            </Card>
            <br />
            <Card>
              <CardHeader>
                <CardTitle>
                  <h1 className="text-2xl font-bold">Services for Item</h1>
                </CardTitle>
              </CardHeader>
              <div className='px-4 pb-2'>
                <DataTable 
                  columns={serviceItemColumns}
                  data={serviceItemData} 
                  filterColumn={filterServiceItemColumn}
                  onDataChange={refreshData}
                />
              </div>
            </Card>
            <br />
            <Card>
              <CardHeader>
                <CardTitle>
                  <h1 className="text-2xl font-bold">Services for Room</h1>
                </CardTitle>
              </CardHeader>
              <div className='px-4 pb-2'>
                <DataTable 
                  columns={serviceRoomColumns}
                  data={serviceRoomData} 
                  filterColumn={filterServiceRoomColumn}
                  onDataChange={refreshData}
                />
              </div>
            </Card>
            <Toaster />
        </div>
    )
}
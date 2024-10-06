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

async function getReserveItemData(): Promise<ReserveItem[]> {
    let reserveItem = null;
    try {
        const response = await axios.get("http://localhost:8081/requests/reserve_item");
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
      const response = await axios.get("http://localhost:8081/requests/reserve_room");
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
      const response = await axios.get("http://localhost:8081/requests/service_item");
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
      const response = await axios.get("http://localhost:8081/requests/service_room");
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
            <div className="flex justify-between items-center mb-4">
            <Card
                className="sm:col-span-2" x-chunk="dashboard-05-chunk-0"
              >
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
            </div>
            <h1 className="text-2xl font-bold">Item Reservations</h1>
            <DataTable 
                columns={reserveItemColumns}
                data={reserveItemData} 
                filterColumn={filterReserveItemColumn}
                onDataChange={refreshData}
            />
            <br />
            <h1 className="text-2xl font-bold">Room Reservations</h1>
            <DataTable 
                columns={reserveRoomColumns}
                data={reserveRoomData} 
                filterColumn={filterReserveRoomColumn}
                onDataChange={refreshData}
            />
            <br />
            <h1 className="text-2xl font-bold">Services for Item</h1>
            <DataTable 
                columns={serviceItemColumns}
                data={serviceItemData} 
                filterColumn={filterServiceItemColumn}
                onDataChange={refreshData}
            />
            <br />
            <h1 className="text-2xl font-bold">Services for Room</h1>
            <DataTable 
                columns={serviceRoomColumns}
                data={serviceRoomData} 
                filterColumn={filterServiceRoomColumn}
                onDataChange={refreshData}
            />
            <Toaster />
        </div>
    )
}
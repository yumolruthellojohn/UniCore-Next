'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createReserveItemColumns, ReserveItem } from "./reserve-item-columns"
import { createReserveRoomColumns, ReserveRoom } from "./reserve-room-columns"
import { createServiceColumns, Service } from "./service-columns"
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

async function getServiceData(): Promise<Service[]> {
  let service = null;
  try {
      const response = await axios.get("http://localhost:8081/requests/service");
      service = response.data;
    } catch (err) {
      console.log(err);
      service = null;
    }

    return service;
}

const filterReserveItemColumn = {
    id: "item_name",
    title: "Item Name",
}

const filterReserveRoomColumn = {
  id: "room_name",
  title: "Room Name",
}

const filterServiceColumn = {
  id: "rq_service_type",
  title: "Service Type",
}

export default function Requests() {
    const [reserveItemData, setReserveItemData] = useState<ReserveItem[]>([]);
    const [reserveRoomData, setReserveRoomData] = useState<ReserveRoom[]>([]);
    const [serviceData, setServiceData] = useState<Service[]>([]);
    const refreshData = useCallback(async () => {
        const freshReserveItemData = await getReserveItemData();
        setReserveItemData(freshReserveItemData);
        const freshReserveRoomData = await getReserveRoomData();
        setReserveRoomData(freshReserveRoomData);
        const freshServiceData = await getServiceData();
        setServiceData(freshServiceData);
    }, []);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    const reserveItemColumns = useMemo(() => createReserveItemColumns(refreshData), [refreshData]);
    const reserveRoomColumns = useMemo(() => createReserveRoomColumns(refreshData), [refreshData]);
    const serviceColumns = useMemo(() => createServiceColumns(refreshData), [refreshData]);
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
            <h1 className="text-2xl font-bold">Service</h1>
            <DataTable 
                columns={serviceColumns}
                data={serviceData} 
                filterColumn={filterServiceColumn}
                onDataChange={refreshData}
            />
            <Toaster />
        </div>
    )
}
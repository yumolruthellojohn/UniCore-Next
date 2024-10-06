'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createRequestQueueColumns, RequestQueue } from "./requests-queue-columns";
import { createRequestAcceptColumns, RequestAccept } from "./requests-accept-columns";
import { createRequestSubmittedColumns, RequestSubmitted } from './requests-submitted-columns';
import { DataTable } from "@/components/data-table/data-table";
import { DataTableAdd } from "@/components/data-table/data-table-add-button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";
import axios from "axios";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';


const filterRequestQueueColumn = {
    id: "rq_type",
    title: "Request Type",
}

const filterRequestAcceptColumn = {
    id: "rq_type",
    title: "Request Type",
}

const filterRequestSubmittedColumn = {
    id: "dept_name",
    title: "Department",
}

export default function Requests() {
    const { data: session, status } = useSession();
    const router = useRouter();

    console.log('Session status:', status);
    console.log('Session data:', session);

    const currentUserID = Number(session?.user?.user_id);

    const [requestQueueData, setRequestQueueData] = useState<RequestQueue[]>([]);
    const [requestAcceptData, setRequestAcceptData] = useState<RequestAccept[]>([]);
    const [requestSubmittedData, setRequestSubmittedData] = useState<RequestSubmitted[]>([]);
    
    const getRequestQueueData = useCallback(async () => {
        const newUserId = session?.user?.user_id?.toString();
        if (status === 'authenticated' && newUserId){
            console.log('Setting new user id:', newUserId);

            try {
                const dept_response = await axios.get(`http://localhost:8081/users/user_dept/${newUserId}`); // Adjust this URL to your actual API endpoint
                console.log(dept_response.data[0].dept_id);

                const req_response = await axios.get(`http://localhost:8081/requests/queue/${dept_response.data[0].dept_id}`);
                return req_response.data;

                
            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle error (e.g., show error message to user)
            }
        }  else {
            console.log('Unable to set dept_id. Status:', status, 'User ID:', session?.user?.user_id);
            return null;
        }

    }, [session, status]);

    const getRequestAcceptData = useCallback(async () => {
        const newUserId = session?.user?.user_id.toString();
        if (status === 'authenticated' && newUserId){
            console.log('Setting new user id:', newUserId);

            try {
                const userid_response = await axios.get(`http://localhost:8081/users/user_id/${newUserId}`); // Adjust this URL to your actual API endpoint
                console.log(userid_response.data[0].user_id);

                const req_response = await axios.get(`http://localhost:8081/requests/accepted/${userid_response.data[0].user_id}`);
                return req_response.data;

                
            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle error (e.g., show error message to user)
            }
        }  else {
            console.log('Unable to set user_id. Status:', status, 'User ID:', session?.user?.user_id);
            return null;
        }

    }, [session, status]);

    const getRequestSubmittedData = useCallback(async () => {
        const newUserId = session?.user?.user_id.toString();
        if (status === 'authenticated' && newUserId){
            console.log('Setting new user id:', newUserId);

            try {
                const userid_response = await axios.get(`http://localhost:8081/users/user_id/${newUserId}`); // Adjust this URL to your actual API endpoint
                console.log(userid_response.data[0].user_id);

                const req_response = await axios.get(`http://localhost:8081/requests/submitted/${userid_response.data[0].user_id}`);
                return req_response.data;

                
            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle error (e.g., show error message to user)
            }
        }  else {
            console.log('Unable to set user_id. Status:', status, 'User ID:', session?.user?.user_id);
            return null;
        }

    }, [session, status]);

    const refreshData = useCallback(async () => {
        const freshRequestQueueData = await getRequestQueueData();
        setRequestQueueData(freshRequestQueueData || []);
        const freshRequestAcceptData = await getRequestAcceptData();
        setRequestAcceptData(freshRequestAcceptData || []);
        const freshRequestSubmittedData = await getRequestSubmittedData();
        setRequestSubmittedData(freshRequestSubmittedData || []);
    }, []);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    const requestQueueColumns = useMemo(() => createRequestQueueColumns(refreshData, currentUserID), [refreshData]);
    const requestAcceptColumns = useMemo(() => createRequestAcceptColumns(refreshData), [refreshData]);
    const requestSubmittedColumns = useMemo(() => createRequestSubmittedColumns(refreshData), [refreshData]);

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
                      <DataTableAdd text="Create New Request" href="/technical/requests/new" />
                    </CardFooter>
                  </Card>
            </div>
            <h1 className="text-2xl font-bold">On Queue</h1>
                <DataTable 
                    columns={requestQueueColumns}
                    data={requestQueueData} 
                    filterColumn={filterRequestQueueColumn}
                    onDataChange={refreshData}
            />
            <br />
            <h1 className="text-2xl font-bold">Workbench</h1>
                <DataTable 
                    columns={requestAcceptColumns}
                    data={requestAcceptData} 
                    filterColumn={filterRequestAcceptColumn}
                    onDataChange={refreshData}
            />
            <br />
            <h1 className="text-2xl font-bold">Submitted Requests</h1>
                <DataTable 
                    columns={requestSubmittedColumns}
                    data={requestSubmittedData}
                    filterColumn={filterRequestSubmittedColumn}
                    onDataChange={refreshData}
            />
            <Toaster />
        </div>
    )
}

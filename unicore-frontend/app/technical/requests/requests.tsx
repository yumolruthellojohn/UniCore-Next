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
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
import { ip_address } from '@/app/ipconfig';
import GenerateRequestPDFReport from './report';


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

export default function Requests({ session }: { session: Session | null }) {
    //const { data: session, status } = useSession();
    const router = useRouter();

    //console.log('Session status:', status);
    console.log('Session data:', session);

    const currentUserID = Number(session?.user?.user_id);

    const [requestQueueData, setRequestQueueData] = useState<RequestQueue[]>([]);
    const [requestAcceptData, setRequestAcceptData] = useState<RequestAccept[]>([]);
    const [requestSubmittedData, setRequestSubmittedData] = useState<RequestSubmitted[]>([]);
    
    const getRequestQueueData = useCallback(async () => {
        const newUserId = session?.user?.user_id?.toString();
        if (newUserId) {
            console.log('Setting new user id:', newUserId);

            try {
                const dept_response = await axios.get(`http://${ip_address}:8081/users/user_dept/${newUserId}`); // Adjust this URL to your actual API endpoint
                console.log(dept_response.data[0].dept_id);
                console.log(session?.user?.dept_id);

                const req_response = await axios.get(`http://${ip_address}:8081/requests/queue/${dept_response.data[0].dept_id}`);
                return req_response.data;

                
            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle error (e.g., show error message to user)
            }
        }  else {
            console.log('Unable to set dept_id. User ID:', session?.user?.user_id);
            return null;
        }

    }, [session]);

    const getRequestAcceptData = useCallback(async () => {
        const newUserId = session?.user?.user_id.toString();
        if (newUserId){
            console.log('Setting new user id:', newUserId);

            try {
                const userid_response = await axios.get(`http://${ip_address}:8081/users/user_id/${newUserId}`); // Adjust this URL to your actual API endpoint
                console.log(userid_response.data[0].user_id);

                const req_response = await axios.get(`http://${ip_address}:8081/requests/accepted/${userid_response.data[0].user_id}`);
                return req_response.data;

                
            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle error (e.g., show error message to user)
            }
        }  else {
            console.log('Unable to set user_id. User ID:', session?.user?.user_id);
            return null;
        }

    }, [session]);

    const getRequestSubmittedData = useCallback(async () => {
        const newUserId = session?.user?.user_id.toString();
        if (newUserId){
            console.log('Setting new user id:', newUserId);

            try {
                const userid_response = await axios.get(`http://${ip_address}:8081/users/user_id/${newUserId}`); // Adjust this URL to your actual API endpoint
                console.log(userid_response.data[0].user_id);

                const req_response = await axios.get(`http://${ip_address}:8081/requests/submitted/${userid_response.data[0].user_id}`);
                return req_response.data;

                
            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle error (e.g., show error message to user)
            }
        }  else {
            console.log('Unable to set user_id. User ID:', session?.user?.user_id);
            return null;
        }

    }, [session]);

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
                <Card className="w-full">
                    <CardHeader className="pb-3">
                      <CardTitle>Standard Requests</CardTitle>
                      <CardDescription className="max-w-lg text-balance leading-relaxed">
                        Manage the requests and view their details.
                      </CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <DataTableAdd text="Create New Request" href="/technical/requests/new" />
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
                        <GenerateRequestPDFReport username={session?.user.user_fname + " " + session?.user.user_lname}></GenerateRequestPDFReport>
                    </CardFooter>
                </Card>
            </div>
            <br />
            <Accordion type="single" collapsible defaultValue="table-1" className='bg-white px-2 py-1 rounded'>
                <AccordionItem value='table-1'>
                    <AccordionTrigger>
                        <h1 className="text-2xl font-bold px-2">On Queue</h1>
                    </AccordionTrigger>
                    <AccordionContent>
                        <DataTable 
                            columns={requestQueueColumns}
                            data={requestQueueData} 
                            filterColumn={filterRequestQueueColumn}
                            onDataChange={refreshData}
                        />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <br />
            <Accordion type="single" collapsible className='bg-white px-2 py-1 rounded'>
                <AccordionItem value='table-2'>
                    <AccordionTrigger>
                        <h1 className="text-2xl font-bold px-2">My Workbench</h1>
                    </AccordionTrigger>
                    <AccordionContent>
                        <DataTable 
                            columns={requestAcceptColumns}
                            data={requestAcceptData} 
                            filterColumn={filterRequestAcceptColumn}
                            onDataChange={refreshData}
                        />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <br />
            <Accordion type="single" collapsible className='bg-white px-2 py-1 rounded'>
                <AccordionItem value='table-3'>
                    <AccordionTrigger>
                        <h1 className="text-2xl font-bold px-2">My Submitted Requests</h1>
                    </AccordionTrigger>
                    <AccordionContent>
                        <DataTable 
                            columns={requestSubmittedColumns}
                            data={requestSubmittedData}
                            filterColumn={filterRequestSubmittedColumn}
                            onDataChange={refreshData}
                        />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <Toaster />
        </div>
    )
}

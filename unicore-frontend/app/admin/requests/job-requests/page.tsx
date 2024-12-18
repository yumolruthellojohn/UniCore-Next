'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createJobRequestsColumnsAdmin, JobRequest } from './job-requests-columns';
import { DataTable } from "@/components/data-table/data-table";
import { DataTableAdd } from "@/components/data-table/data-table-add-button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";
import axios from "axios";
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ip_address } from '@/app/ipconfig';
import GenerateBMOJobPDFReport from './report';

const filterJobRequestsColumn = {
    id: "job_id",
    title: "Job ID",
};


export default function JobRequests({ session }: { session: Session | null }) {
    const router = useRouter();
    const currentUserID = session?.user?.user_id;
    const currentUserDept = session?.user?.dept_id;
    const currentUserPosition = session?.user?.user_position;
    console.log("Session data: " + currentUserID + " " + currentUserDept + " " + currentUserPosition);

    const [jobRequestData, setJobRequestData] = useState<JobRequest[]>([]);

    const getJobRequestData = useCallback(async () => {
        try {
            const response = await axios.get(`http://${ip_address}:8081/jobrequests/all`);
            return response.data;
        }
        catch (error) {
            console.error('Error fetching data:', error);
        }
    }, [session]);

    const refreshData = useCallback(async () => {
        const freshJobRequestData = await getJobRequestData();
        setJobRequestData(freshJobRequestData || []);
    }, []);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    const jobRequestColumns = useMemo(() => createJobRequestsColumnsAdmin(refreshData), [refreshData]);

    return (
        <div className="container mx-auto py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
                <Card className="w-full">
                    <CardHeader className="pb-3">
                        <CardTitle>BMO Job Requests</CardTitle>
                        <CardDescription className="max-w-lg text-balance leading-relaxed">
                            Manage job requests and view their details.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <DataTableAdd text="New Job Request" href="/admin/requests/job-requests/new" />
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
                        <GenerateBMOJobPDFReport></GenerateBMOJobPDFReport>
                    </CardFooter>
                </Card>
            </div>
            <br />
            <DataTable 
                columns={jobRequestColumns}
                data={jobRequestData} 
                filterColumn={filterJobRequestsColumn}
                onDataChange={refreshData}
            />
            <Toaster />
        </div>
    )
}

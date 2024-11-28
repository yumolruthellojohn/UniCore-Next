'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createJobSubmittedColumns, JobSubmitted } from './job-submitted-columns';
import { createJobBMOApprovalColumns, JobBMOApproval } from './job-bmo-approval-columns';
import { createJobCadsApprovalColumns, JobCadsApproval } from './job-cads-approval-columns';
import { createJobCadsApprovedColumns, JobCadsApproved } from './job-cads-approved-columns';
import { createJobCustodianApprovalColumns, JobCustodianApproval } from './job-custod-approval-columns';
import { createJobCustodianApprovedColumns, JobCustodianApproved } from './job-custod-approved-columns';
import { createJobStatusColumns, JobStatus } from './job-status-columns';
import { DataTable } from "@/components/data-table/data-table";
import { DataTableAdd } from "@/components/data-table/data-table-add-button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";
import axios from "axios";
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ip_address } from '@/app/ipconfig';

const filterJobSubmittedColumn = {
    id: "job_id",
    title: "Job ID",
};

const filterJobBMOApprovalColumn = {
    id: "dept_name",
    title: "Department",
};

const filterJobCadsApprovalColumn = {
    id: "dept_name",
    title: "Department",
};

const filterJobCadsApprovedColumn = {
    id: "dept_name",
    title: "Department",
};

const filterJobCustodianApprovalColumn = {
    id: "dept_name",
    title: "Department",
};

const filterJobCustodianApprovedColumn = {
    id: "dept_name",
    title: "Department",
};

const filterJobStatusColumn = {
    id: "dept_name",
    title: "Department",
};

export default function JobRequests({ session }: { session: Session | null }) {
    const router = useRouter();
    const currentUserID = session?.user?.user_id;
    const currentUserDept = session?.user?.dept_id;
    const currentUserPosition = session?.user?.user_position;
    console.log("Session data: " + currentUserID + " " + currentUserDept + " " + currentUserPosition);

    const [jobSubmittedData, setJobSubmittedData] = useState<JobSubmitted[]>([]);
    const [jobBMOApprovalData, setJobBMOApprovalData] = useState<JobCadsApproval[]>([]);
    const [jobCadsApprovalData, setJobCadsApprovalData] = useState<JobCadsApproval[]>([]);
    const [jobCadsApprovedData, setJobCadsApprovedData] = useState<JobCadsApproved[]>([]);
    const [jobCustodianApprovalData, setJobCustodianApprovalData] = useState<JobCustodianApproval[]>([]);
    const [jobCustodianApprovedData, setJobCustodianApprovedData] = useState<JobCustodianApproved[]>([]);
    const [jobStatusData, setJobStatusData] = useState<JobStatus[]>([]);

    const getJobSubmittedData = useCallback(async () => {
        try {
            const response = await axios.get(`http://${ip_address}:8081/jobrequests/submitted/${currentUserID}`);
            return response.data;
        }
        catch (error) {
            console.error('Error fetching data:', error);
        }
    }, [session]);

    const getJobCadsApprovalData = useCallback(async () => {
        try {
            const response = await axios.get(`http://${ip_address}:8081/jobrequests/cads_approval/Pending`);
            return response.data;
        }
        catch (error) {
            console.error('Error fetching data:', error);
        }
    }, [session]);

    const getJobCadsApprovedData = useCallback(async () => {
        try {
            const response = await axios.get(`http://${ip_address}:8081/jobrequests/cads_approval/Approved`);
            return response.data;
        }
        catch (error) {
            console.error('Error fetching data:', error);
        }
    }, [session]);

    const getJobCustodianApprovalData = useCallback(async () => {
        try {
            const response = await axios.get(`http://${ip_address}:8081/jobrequests/custodian_approval/Pending`);
            return response.data;
        }
        catch (error) {
            console.error('Error fetching data:', error);
        }
    }, [session]);
    const getJobCustodianApprovedData = useCallback(async () => {
        try {
            const response = await axios.get(`http://${ip_address}:8081/jobrequests/custodian_approval/Approved`);
            return response.data;
        }
        catch (error) {
            console.error('Error fetching data:', error);
        }
    }, [session]);

    const getJobStatusData = useCallback(async () => {
        try {
            const response = await axios.get(`http://${ip_address}:8081/jobrequests/approved/Approved`);
            return response.data;
        }
        catch (error) {
            console.error('Error fetching data:', error);
        }
    }, [session]);

    const refreshData = useCallback(async () => {
        const freshJobSubmittedData = await getJobSubmittedData();
        setJobSubmittedData(freshJobSubmittedData || []);
        const freshJobCadsApprovalData = await getJobCadsApprovalData();
        setJobCadsApprovalData(freshJobCadsApprovalData || []);
        const freshJobCadsApprovedData = await getJobCadsApprovedData();
        setJobCadsApprovedData(freshJobCadsApprovedData || []);
        const freshJobCustodianApprovalData = await getJobCustodianApprovalData();
        setJobCustodianApprovalData(freshJobCustodianApprovalData || []);
        const freshJobCustodianApprovedData = await getJobCustodianApprovedData();
        setJobCustodianApprovedData(freshJobCustodianApprovedData || []);
        const freshJobStatusData = await getJobStatusData();
        setJobStatusData(freshJobStatusData || []);
    }, []);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    const jobSubmittedColumns = useMemo(() => createJobSubmittedColumns(refreshData), [refreshData]);
    const jobCadsApprovalColumns = useMemo(() => createJobCadsApprovalColumns(refreshData), [refreshData]);
    const jobCadsApprovedColumns = useMemo(() => createJobCadsApprovedColumns(refreshData), [refreshData]);
    const jobCustodianApprovalColumns = useMemo(() => createJobCustodianApprovalColumns(refreshData), [refreshData]);
    const jobCustodianApprovedColumns = useMemo(() => createJobCustodianApprovedColumns(refreshData), [refreshData]);
    const jobStatusColumns = useMemo(() => createJobStatusColumns(refreshData), [refreshData]);

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
                        {/* Show New Job Request button only if the user is not Property Custodian or CADS Staff */}
                        {currentUserPosition !== "Property Custodian" && currentUserPosition !== "CADS Director" ? (
                            <DataTableAdd text="New Job Request" href="/technical/requests/job-requests/new" />
                        ) : (
                            <h3>This is the BMO Job Requests Approval section. This means you are authorized to approve the requests below.</h3>
                        )}
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
            {currentUserPosition === "CADS Director" && (
                <>
                <br />
                <Card className="max-w-6xl">
                    <CardHeader className="pb-3">
                        <CardTitle>Job Requests (For Approval)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='max-w-6xl'>
                            <DataTable 
                                columns={jobCadsApprovalColumns}
                                data={jobCadsApprovalData} 
                                filterColumn={filterJobCadsApprovalColumn}
                                onDataChange={refreshData}
                            />
                        </div>
                    </CardContent>
                </Card>
                <br />
                <Card className="max-w-6xl">
                    <CardHeader className="pb-3">
                        <CardTitle>Job Requests (Approved)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='max-w-6xl'>
                            <DataTable 
                                columns={jobCadsApprovedColumns}
                                data={jobCadsApprovedData} 
                                filterColumn={filterJobCadsApprovedColumn}
                                onDataChange={refreshData}
                            />
                        </div>
                    </CardContent>
                </Card>
                </>
            )}
            {currentUserPosition === "Property Custodian" && (
                <>
                <br />
                <Card className="max-w-6xl">
                    <CardHeader className="pb-3">
                        <CardTitle>Job Requests (For Approval)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='max-w-6xl'>
                            <DataTable 
                                columns={jobCustodianApprovalColumns}
                                data={jobCustodianApprovalData}
                                filterColumn={filterJobCustodianApprovalColumn}
                                onDataChange={refreshData}
                            />
                        </div>
                    </CardContent>
                </Card>
                <br />
                <Card className="max-w-6xl">
                    <CardHeader className="pb-3">
                        <CardTitle>Job Requests (Approved)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='max-w-6xl'>
                            <DataTable 
                                columns={jobCustodianApprovedColumns}
                                data={jobCustodianApprovedData}
                                filterColumn={filterJobCustodianApprovedColumn}
                                onDataChange={refreshData}
                            />
                        </div>
                    </CardContent>
                </Card>
                </>
            )}
            {currentUserDept == '1' && (
                <>
                <br />
                <Card className="max-w-6xl">
                    <CardHeader className="pb-3">
                        <CardTitle>Job Requests Workbench</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='max-w-6xl'>
                            <DataTable 
                                columns={jobStatusColumns}
                                data={jobStatusData}
                                filterColumn={filterJobStatusColumn}
                                onDataChange={refreshData}
                            />
                        </div>
                    </CardContent>
                </Card>
                </>
            )}
            {/* Show My Submitted Job Requests card only if the user is not Property Custodian or CADS Staff */}
            {currentUserPosition !== "Property Custodian" && currentUserPosition !== "CADS Director" && (
                <>
                <br />
                <Card className="max-w-6xl">
                    <CardHeader className="pb-3">
                        <CardTitle>My Submitted Job Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='max-w-6xl'>
                            <DataTable 
                                columns={jobSubmittedColumns}
                                data={jobSubmittedData} 
                                filterColumn={filterJobSubmittedColumn}
                                onDataChange={refreshData}
                            />
                        </div>
                    </CardContent>
                </Card>
                </>
            )}
            <Toaster />
        </div>
    )
}

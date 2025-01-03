'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createRequestAssignColumns, RequestAssign } from './requests-assigned-columns';
import { DataTable } from "@/components/data-table/data-table";
import { DataTableAdd } from "@/components/data-table/data-table-add-button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";
import axios from "axios";
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import { ip_address } from '@/app/ipconfig';


const filterRequestAssignedColumn = {
  id: "rq_property_name",
  title: "Property Name",
}

export default function Requests({ session }: { session: Session | null }) {
    //const { data: session, status } = useSession();
    const router = useRouter();

    //console.log('Session status:', status);
    console.log('Session data:', session);

    const currentUserID = Number(session?.user?.user_id);

    const [requestAssignedData, setRequestAssignedData] = useState<RequestAssign[]>([]);

    const getRequestAssignedData = useCallback(async () => {
        const newUserId = session?.user?.user_id.toString();
        if (newUserId){
            console.log('Setting new user id:', newUserId);

            try {
                const userid_response = await axios.get(`http://${ip_address}:8081/users/user_id/${newUserId}`); // Adjust this URL to your actual API endpoint
                console.log(userid_response.data[0].user_id);

                const req_response = await axios.get(`http://${ip_address}:8081/requests/assigned/${userid_response.data[0].user_id}`);
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
        const freshRequestAssignedData = await getRequestAssignedData();
        setRequestAssignedData(freshRequestAssignedData || []);
    }, []);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    const requestAssignedColumns = useMemo(() => createRequestAssignColumns(refreshData), [refreshData]);

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
                        <p>As a Service Staff, you are responsible with updating the service status of the requests.</p>
                    </CardFooter>
                </Card>
            </div>
            <br />
            <Card>
              <CardHeader>
                <CardTitle>
                  <h1 className="text-2xl font-bold">Assigned Requests</h1>
                </CardTitle>
              </CardHeader>
                <div className='px-4 pb-2'>
                  <DataTable 
                     columns={requestAssignedColumns}
                     data={requestAssignedData}
                     filterColumn={filterRequestAssignedColumn}
                     onDataChange={refreshData}
                  />
                </div>
            </Card>
            <Toaster />
        </div>
    )
}

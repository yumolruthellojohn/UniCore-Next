'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createColumns, User } from "./accounts-columns"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableAdd } from "@/components/data-table/data-table-add-button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster"
import axios from "axios";
import { Button } from '@/components/ui/button';
import { ip_address } from '@/app/ipconfig';

async function getData(): Promise<User[]> {
    let users = null;
    try {
        const response = await axios.get(`http://${ip_address}:8081/users/non_admin`);
        users = response.data;
    } catch (err) {
        console.log(err);
        users = null;
    }
    
    return users;
}

const filterColumn = {
    id: "user_lname",
    title: "Last Name"
}

export default function UserAccounts() {
    const [data, setData] = useState<User[]>([]);

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
                        <CardTitle>User Accounts</CardTitle>
                        <CardDescription className="text-balance leading-relaxed">
                            Manage user accounts and view their details.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <DataTableAdd text="Add New User" href="/admin/accounts/new" />
                    </CardFooter>
                </Card>
            </div>
            <br />
            <DataTable 
                columns={columns}
                data={data} 
                filterColumn={filterColumn}
                onDataChange={refreshData}
            />
            <Toaster />
        </div>
    )
}

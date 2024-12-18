'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import Link from 'next/link';
import { ip_address } from '@/app/ipconfig';

interface Department {
    dept_id: number;
    dept_name: string;
}

export default function EditUserAccount() {
    const [formData, setFormData] = useState({
        user_idnum: '',
        user_password: '',
        user_fname: '',
        user_lname: '',
        user_email: '',
        user_contact: '',
        user_type: '',
        user_position: '',
        dept_id: '',
        user_status: ''
    });

    const [departments, setDepartments] = useState<Department[]>([]);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams.get('id');

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get(`http://${ip_address}:8081/departments`);
                setDepartments(response.data);
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };

        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://${ip_address}:8081/users/${userId}`);
                const userData = response.data[0];
                setFormData({
                    user_idnum: userData.user_idnum.toString(),
                    user_password: userData.user_password,
                    user_fname: userData.user_fname,
                    user_lname: userData.user_lname,
                    user_email: userData.user_email,
                    user_contact: userData.user_contact,
                    user_type: userData.user_type,
                    user_position: userData.user_position,
                    dept_id: userData.dept_id.toString(),
                    user_status: userData.user_status
                });
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchDepartments();
        if (userId) {
            fetchUser();
        }
    }, [userId]);

    const handleChange = (name: string, value: string | number) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await axios.put(`http://${ip_address}:8081/users/edit/${userId}`, formData);
            setShowSuccessDialog(true);
        } catch (err) {
            console.log(err);
        }
    };

    const handleDialogClose = () => {
        setShowSuccessDialog(false);
        router.push('/admin/accounts');
    };

    return (
        <div className="container mx-auto p-4">
            <Card className="max-w-4xl">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Edit User Account</CardTitle>
                    <Link href="/admin/accounts" className="text-blue-500 hover:text-blue-700">
                        Back to Accounts
                    </Link>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="user_idnum">ID Number:</Label>
                                <Input
                                    id="user_idnum"
                                    value={formData.user_idnum}
                                    onChange={(e) => handleChange('user_idnum', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="user_password">Password:</Label>
                                <Input
                                    type="password"
                                    id="user_password"
                                    value={formData.user_password}
                                    onChange={(e) => handleChange('user_password', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="user_fname">First Name:</Label>
                                <Input
                                    id="user_fname"
                                    value={formData.user_fname}
                                    onChange={(e) => handleChange('user_fname', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="user_lname">Last Name:</Label>
                                <Input
                                    id="user_lname"
                                    value={formData.user_lname}
                                    onChange={(e) => handleChange('user_lname', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="user_email">Email:</Label>
                                <Input
                                    type="email"
                                    id="user_email"
                                    value={formData.user_email}
                                    onChange={(e) => handleChange('user_email', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="user_contact">Contact Number:</Label>
                                <Input
                                    id="user_contact"
                                    value={formData.user_contact}
                                    onChange={(e) => handleChange('user_contact', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="user_type">User Type:</Label>
                                <Select onValueChange={(value) => handleChange('user_type', value)} value={formData.user_type} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a user type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Administrator">Administrator</SelectItem>
                                        <SelectItem value="Technical Staff">Technical Staff</SelectItem>
                                        <SelectItem value="Non-technical Staff">Non-technical Staff</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="user_position">Position:</Label>
                                <Select onValueChange={(value) => handleChange('user_position', value)} value={formData.user_position} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a position" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Director">Director</SelectItem>
                                        <SelectItem value="Supervisor">Supervisor</SelectItem>
                                        <SelectItem value="CMO Staff">CMO Staff</SelectItem>
                                        <SelectItem value="BMO Staff">BMO Staff</SelectItem>
                                        <SelectItem value="CADS Staff">CADS Staff</SelectItem>
                                        <SelectItem value="Property Custodian">Property Custodian</SelectItem>
                                        <SelectItem value="Faculty Staff">Faculty Staff</SelectItem>
                                        <SelectItem value="Working Student">Working Student</SelectItem>
                                        <SelectItem value="Student">Student</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dept_id">Department:</Label>
                                <Select onValueChange={(value) => handleChange('dept_id', value)} value={formData.dept_id} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departments.map((dept) => (
                                            <SelectItem key={dept.dept_id} value={dept.dept_id.toString()}>
                                                {dept.dept_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="user_status">Status:</Label>
                                <Select onValueChange={(value) => handleChange('user_status', value)} value={formData.user_status} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Activated">Activated</SelectItem>
                                        <SelectItem value="Deactivated">Deactivated</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Button type="submit" className="w-full">Save Changes</Button>
                    </form>
                </CardContent>
            </Card>

            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-green-500">Success</DialogTitle>
                        <DialogDescription>
                            User account has been successfully updated.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={handleDialogClose}>OK</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

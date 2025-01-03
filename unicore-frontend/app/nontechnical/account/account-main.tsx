"use client";

import { Session } from "next-auth";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import axios from 'axios';
import { ip_address } from '@/app/ipconfig';
import Image from 'next/image';

interface User {
    user_id: number;
    user_idnum: number;
    user_password: string;
    user_fname: string;
    user_lname: string;
    user_email: string;
    user_contact: string;
    user_type: string;
    user_position: string;
    dept_id: number;
    dept_name: string;
    user_sign: string | null;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];

export default function AccountPage({ session }: { session: Session | null }) {
    const userID = session?.user.user_id;
    const [user, setUser] = useState<User | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [formData, setFormData] = useState({
        user_password: '',
        user_fname: '',
        user_lname: '',
        user_email: '',
        user_contact: ''
    });
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [signatureFile, setSignatureFile] = useState<File | null>(null);
    const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const loadUserDetails = async () => {
            try {
                const response = await axios.get(`http://${ip_address}:8081/users/${userID}`);
                setUser(response.data[0]);
                setFormData(response.data[0]); // Initialize form data with user details
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };
        loadUserDetails();
    }, []);

    const handleEdit = async () => {
        try {
            await axios.put(`http://${ip_address}:8081/users/edit/${userID}`, formData);
            setIsEditing(false);
            // Optionally refresh user details
            const response = await axios.get(`http://${ip_address}:8081/users/${userID}`);
            setUser(response.data[0]);

            toast({
                title: "Update Successful",
                description: "Your account details has been updated.",
            })
        } catch (error) {
            console.error('Error updating user details:', error);

            toast({
                title: "Update Failed",
                description: "Your account details failed to update.",
                variant: "destructive"
            })
        }
    };

    const handleChangePassword = async () => {
        setPasswordError('');

        // Check if the old password matches the current user's password
        if (oldPassword !== user?.user_password) {
            setPasswordError("Current password does not match to your account.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError("New password and confirmation do not match.");
            return;
        }

        try {
            await axios.put(`http://${ip_address}:8081/users/password/${userID}`, { user_password: newPassword }); // Adjust the endpoint as necessary
            setIsChangingPassword(false);

            // Clear the input fields after successful password change
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');

            // Optionally refresh user details
            const response = await axios.get(`http://${ip_address}:8081/users/${userID}`);
            setUser(response.data[0]);

            toast({
                title: "Password Change Successful",
                description: "Your password has been updated.",
            })
        } catch (error) {
            console.error('Error changing password:', error);

            toast({
                title: "Password Change Failed",
                description: "Your password failed to update.",
                variant: "destructive"
            })
        }
    };

    // function to handle signature upload
    const handleSignatureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            toast({
                title: "File Too Large",
                description: "Please upload an image smaller than 2MB.",
                variant: "destructive"
            });
            return;
        }

        // Validate file type
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            toast({
                title: "Invalid File Type",
                description: "Please upload a PNG, JPG, or JPEG image.",
                variant: "destructive"
            });
            return;
        }

        setSignatureFile(file);
        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setSignaturePreview(previewUrl);

         // Create FormData and upload
         const signFormData = new FormData();
         signFormData.append('user_sign', file);

        try {
            await axios.put(`http://${ip_address}:8081/users/signature/${userID}`, signFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast({
                title: "Signature Upload Successful",
                description: "Your e-signature has been updated.",
            });

            // Refresh user details to get updated signature
            const response = await axios.get(`http://${ip_address}:8081/users/${userID}`);
            setUser(response.data[0]);
        } catch (error) {
            console.error('Error uploading signature:', error);
            toast({
                title: "Signature Upload Failed",
                description: "Failed to update your e-signature.",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 max-w-[5xl] gap-4 mb-8">
                {user && (
                    <Card className="w-full flex flex-col h-full">
                        <CardHeader>
                            <CardTitle>Account Details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 gap-4">
                            <p><strong>Name:</strong> {user.user_fname} {user.user_lname}</p>
                            <p><strong>E-mail Address:</strong> {user.user_email}</p>
                            <p><strong>Contact Number:</strong> {user.user_contact}</p>
                            <p><strong>Department:</strong> {user.dept_name}</p>
                            <p><strong>Position:</strong> {user.user_position}</p>
                            <p><strong>Access Type:</strong> {user.user_type}</p>
                        </CardContent>
                        <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 mt-auto">
                            <Button onClick={() => setIsEditing(true)}>Edit Details</Button>
                            <Button onClick={() => setIsChangingPassword(true)}>Change Password</Button>
                        </CardFooter>
                    </Card>
                )}

                {user && (
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>E-Signature</CardTitle>
                            <CardDescription>
                                Upload your e-signature. This will be used in request-related transactions.
                                <p className="text-sm text-muted-foreground mt-1">
                                    Accepted formats: PNG, JPG, JPEG (Max size: 2MB)
                                </p>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Signature preview */}
                            <div className="border rounded-lg p-4 flex justify-center items-center min-h-[200px]">
                                {(signaturePreview || user?.user_sign) ? (
                                    <Image
                                        src={signaturePreview || `data:image/png;base64,${user?.user_sign}`}
                                        alt="E-signature"
                                        width={300}
                                        height={150}
                                        className="object-contain"
                                    />
                                ) : (
                                    <p className="text-gray-400">No e-signature uploaded</p>
                                )}
                            </div>
                            
                            {/* Upload button */}
                            <div className="flex flex-col items-center gap-2">
                                <Label
                                    htmlFor="signature-upload"
                                    className="cursor-pointer inline-flex items-center px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md"
                                >
                                    Upload E-Signature
                                    <Input
                                        id="signature-upload"
                                        type="file"
                                        accept=".png,.jpg,.jpeg"
                                        className="hidden"
                                        onChange={handleSignatureUpload}
                                    />
                                </Label>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Edit User Details Dialog */}
                <Dialog open={isEditing} onOpenChange={setIsEditing}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit User Details</DialogTitle>
                            <DialogDescription>Update your account information below.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={(e) => { e.preventDefault(); handleEdit(); }} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="user_fname">First Name:</Label>
                                <Input
                                    id="user_fname"
                                    value={formData.user_fname}
                                    onChange={(e) => setFormData({ ...formData, user_fname: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="user_lname">Last Name:</Label>
                                <Input
                                    id="user_lname"
                                    value={formData.user_lname}
                                    onChange={(e) => setFormData({ ...formData, user_lname: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="user_email">E-mail Address:</Label>
                                <Input
                                    id="user_email"
                                    value={formData.user_email}
                                    onChange={(e) => setFormData({ ...formData, user_email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="user_contact">Contact Number:</Label>
                                <Input
                                    id="user_contact"
                                    value={formData.user_contact}
                                    onChange={(e) => setFormData({ ...formData, user_contact: e.target.value })}
                                    required
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit">Save Changes</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Change Password Dialog */}
                <Dialog open={isChangingPassword} onOpenChange={setIsChangingPassword}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Change Password</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={(e) => { e.preventDefault(); handleChangePassword(); }} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="old_password">Current Password:</Label>
                                <Input
                                    id="old_password"
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new_password">New Password:</Label>
                                <Input
                                    id="new_password"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm_password">Confirm New Password:</Label>
                                <Input
                                    id="confirm_password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            
                            {/* Error message display */}
                            {passwordError && (
                                <p className="text-red-500 mt-2">{passwordError}</p> // Added margin for spacing
                            )}
                            
                            <DialogFooter>
                                <Button type="submit">Update Password</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
                <Toaster />
            </div>
        </div>
    );
};
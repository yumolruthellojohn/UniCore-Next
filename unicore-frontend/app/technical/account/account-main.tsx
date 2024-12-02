"use client";

import { Session } from "next-auth";
import { handleSignOut } from "@/app/actions/authActions";
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
}

export default function AccountPage({ session }: { session: Session | null }) {
    const userID = session?.user.user_id;
    const [user, setUser] = useState<User | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
    const [isDeactivationDialogOpen, setIsDeactivationDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        user_password: '',
        user_fname: '',
        user_lname: '',
        user_email: '',
        user_contact: '',
    });
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
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

    const handleDeactivate = async () => {
        setIsConfirmationDialogOpen(true);
    };

    const handleDeactivateConfirmed = async () => {
        try {
            setIsConfirmationDialogOpen(false);
            await axios.put(`http://${ip_address}:8081/users/deactivate/${userID}`);
            setIsDeactivationDialogOpen(true);
        } catch (error) {
            console.error('Error deactivating account:', error);
        }
    };

    return (
        <div className="container mx-auto">
            <div className="w-full max-w-[600px]">
                {user && (
                    <Card className="w-full">
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
                        <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
                            <Button onClick={() => setIsEditing(true)}>Edit Details</Button>
                            <Button onClick={() => setIsChangingPassword(true)}>Change Password</Button>
                            <Button variant={"destructive"} onClick={handleDeactivate}>Deactivate Account</Button>
                        </CardFooter>
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
                                <Button type="submit">Change Password</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
                
                {/* Deactivation Confirmation Dialog */}
                <Dialog open={isConfirmationDialogOpen} onOpenChange={setIsConfirmationDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Are you sure?</DialogTitle>
                            <DialogDescription>This will deactivate your account. By doing so, you will no longer have access to this web application.</DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button onClick={() => setIsConfirmationDialogOpen(false)}>Cancel</Button>
                            <Button variant={"destructive"} onClick={handleDeactivateConfirmed}>Yes, Deactivate my account</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Deactivation Dialog */}
                <Dialog open={isDeactivationDialogOpen} onOpenChange={setIsDeactivationDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Account Deactivated</DialogTitle>
                            <DialogDescription>Your account is deactivated and will automatically log out. For further concerns, please contact the Administrator.</DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button onClick={() => {
                                setIsDeactivationDialogOpen(false);
                                handleSignOut();
                            }}>OK</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Toaster />
            </div>
        </div>
    );
};
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
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
import { Checkbox } from "@/components/ui/checkbox"
import { ip_address } from '@/app/ipconfig';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Session } from 'next-auth';

interface Department {
    dept_id: number;
    dept_name: string;
}

interface User {
    user_id: number;
    user_fname: string;
    user_lname: string;
}

interface WorkDays {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
}

export default function EditWorkSchedule({ session }: { session: Session | null }) {
    const router = useRouter();

    console.log('Session data:', session)
    const userID = session?.user?.user_id;
    const userDept = session?.user?.dept_id;
    const userPosition = session?.user?.user_position;

    const searchParams = useSearchParams();
    const scheduleId = searchParams.get('id');
    
    const [formData, setFormData] = useState({
        sched_id: '',
        sched_user_id: '',
        sched_dept_id: '',
        sched_days_of_week: '',
        sched_time_in: '',
        sched_time_out: '',
        sched_start_date: '',
        sched_end_date: '',
        sched_notes: ''
    });

    const [departments, setDepartments] = useState<Department[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [workDays, setWorkDays] = useState<WorkDays>({
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
    });
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch schedule data along with departments and users
                const [deptResponse, usersResponse, scheduleResponse] = await Promise.all([
                    axios.get(`http://${ip_address}:8081/departments`),
                    axios.get(`http://${ip_address}:8081/users/position/working`),
                    axios.get(`http://${ip_address}:8081/schedules/${scheduleId}`)
                ]);

                setDepartments(deptResponse.data);
                setUsers(usersResponse.data);

                // Set form data from existing schedule
                const schedule = scheduleResponse.data[0];
                setFormData(schedule);

                // Set workDays based on sched_days_of_week
                const days = schedule.sched_days_of_week.split(', ').map((day: string) => day.toLowerCase());
                setWorkDays({
                    monday: days.includes('monday'),
                    tuesday: days.includes('tuesday'),
                    wednesday: days.includes('wednesday'),
                    thursday: days.includes('thursday'),
                    friday: days.includes('friday'),
                    saturday: days.includes('saturday'),
                    sunday: days.includes('sunday'),
                });

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (scheduleId) {
            fetchData();
        }
    }, [scheduleId]);

    const handleChange = (name: string, value: string) => {
        if (name === 'sched_time_in' || name === 'sched_time_out') {
            // Convert time to minutes for easy comparison
            const [hours, minutes] = value.split(':').map(Number);
            const timeInMinutes = hours * 60 + minutes;
            
            if (timeInMinutes < 6 * 60 || timeInMinutes > 21 * 60) {
                setAlertMessage('Please select a time between 6:00 AM and 9:00 PM');
                setShowAlert(true);
                return;
            }
        }
        
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await axios.put(`http://${ip_address}:8081/schedules/${scheduleId}`, formData);

            //Create notification for staff
            await axios.post(`http://${ip_address}:8081/notifications/add`, {
                notif_user_id: formData.sched_user_id,
                notif_type: "schedule_update",
                notif_content: `Your schedule has been updated.`,
                notif_related_id: formData.sched_id
            });

            setShowSuccessDialog(true);
        } catch (err) {
            console.log(err);
        }
    };

    const handleDialogClose = () => {
        setShowSuccessDialog(false);
        router.push('/admin/wschedules');
    };

    const handleDayChange = (day: keyof WorkDays) => {
        setWorkDays(prev => ({
            ...prev,
            [day]: !prev[day]
        }));
        
        // Update formData with selected days
        const selectedDays = Object.entries({
            ...workDays,
            [day]: !workDays[day]
        })
            .filter(([_, selected]) => selected)
            .map(([day]) => day.charAt(0).toUpperCase() + day.slice(1))
            .join(', ');
        
        handleChange('sched_days_of_week', selectedDays);
    };

    return (
        <div className="container mx-auto p-4">
            <Card className="max-w-4xl">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Edit Work Schedule</CardTitle>
                    <Link href="/admin/wschedules" className="text-blue-500 hover:text-blue-700">
                        Back to Schedules
                    </Link>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="sched_user_id">Staff Member:</Label>
                                <Select onValueChange={(value) => handleChange('sched_user_id', value)} value={formData.sched_user_id.toString()} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select staff member" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map((user) => (
                                            <SelectItem key={user.user_id} value={user.user_id.toString()}>
                                                {`${user.user_fname} ${user.user_lname}`}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sched_dept_id">Assigned Department:</Label>
                                <Select onValueChange={(value) => handleChange('sched_dept_id', value)} value={formData.sched_dept_id.toString()} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select department" />
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
                                <Label htmlFor="sched_time_in">Time In:</Label>
                                <Input
                                    type="time"
                                    id="sched_time_in"
                                    value={formData.sched_time_in}
                                    onChange={(e) => handleChange('sched_time_in', e.target.value)}
                                    min="06:00"
                                    max="21:00"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sched_time_out">Time Out:</Label>
                                <Input
                                    type="time"
                                    id="sched_time_out"
                                    value={formData.sched_time_out}
                                    onChange={(e) => handleChange('sched_time_out', e.target.value)}
                                    min="06:00"
                                    max="21:00"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sched_start">Schedule Start Date:</Label>
                                <Input
                                    type="date"
                                    id="sched_start_date"
                                    value={formData.sched_start_date}
                                    onChange={(e) => handleChange('sched_start_date', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sched_end">Schedule End Date:</Label>
                                <Input
                                    type="date"
                                    id="sched_end_date"
                                    value={formData.sched_end_date}
                                    onChange={(e) => handleChange('sched_end_date', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Working Days:</Label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                                    <div className="flex items-center space-x-2 min-w-[120px]">
                                        <Checkbox 
                                            id="monday" 
                                            checked={workDays.monday}
                                            onCheckedChange={() => handleDayChange('monday')}
                                        />
                                        <Label htmlFor="monday" className="font-normal whitespace-nowrap">Monday</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 min-w-[120px]">
                                        <Checkbox 
                                            id="tuesday" 
                                            checked={workDays.tuesday}
                                            onCheckedChange={() => handleDayChange('tuesday')}
                                        />
                                        <Label htmlFor="tuesday" className="font-normal whitespace-nowrap">Tuesday</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 min-w-[120px]">
                                        <Checkbox 
                                            id="wednesday" 
                                            checked={workDays.wednesday}
                                            onCheckedChange={() => handleDayChange('wednesday')}
                                        />
                                        <Label htmlFor="wednesday" className="font-normal whitespace-nowrap">Wednesday</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 min-w-[120px]">
                                        <Checkbox 
                                            id="thursday" 
                                            checked={workDays.thursday}
                                            onCheckedChange={() => handleDayChange('thursday')}
                                        />
                                        <Label htmlFor="thursday" className="font-normal whitespace-nowrap">Thursday</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 min-w-[120px]">
                                        <Checkbox 
                                            id="friday" 
                                            checked={workDays.friday}
                                            onCheckedChange={() => handleDayChange('friday')}
                                        />
                                        <Label htmlFor="friday" className="font-normal whitespace-nowrap">Friday</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 min-w-[120px]">
                                        <Checkbox 
                                            id="saturday" 
                                            checked={workDays.saturday}
                                            onCheckedChange={() => handleDayChange('saturday')}
                                        />
                                        <Label htmlFor="saturday" className="font-normal whitespace-nowrap">Saturday</Label>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="sched_notes">Notes:</Label>
                                <Textarea
                                    id="sched_notes"
                                    value={formData.sched_notes}
                                    onChange={(e) => handleChange('sched_notes', e.target.value)}
                                    placeholder="Add any additional notes about the schedule"
                                />
                            </div>
                        </div>
                        <Button type="submit" className="w-full">Update Schedule</Button>
                    </form>
                </CardContent>
            </Card>

            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-green-500">Success</DialogTitle>
                        <DialogDescription>
                            Work schedule has been successfully updated.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={handleDialogClose}>OK</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Invalid Time</AlertDialogTitle>
                        <AlertDialogDescription>
                            {alertMessage}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setShowAlert(false)}>
                            OK
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

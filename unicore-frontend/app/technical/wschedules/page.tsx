'use client';

import { useEffect, useState } from 'react';
import { DataTableAdd } from "@/components/data-table/data-table-add-button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from "axios";
import { ip_address } from '@/app/ipconfig';
import { useRouter } from 'next/navigation';


export default function Schedules() {
    const router = useRouter();
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const response = await axios.get(`http://${ip_address}:8081/schedules`);
                console.log('Raw API response:', response.data); // Debug log

                if (!response.data.Message) {
                    // Transform the data into FullCalendar format
                    const formattedEvents = response.data.map((schedule: any) => {
                        const daysOfWeek = schedule.sched_days_of_week.split(', ').map((day: string) => {
                            const dayMap: { [key: string]: number } = {
                                'Sunday': 0,
                                'Monday': 1,
                                'Tuesday': 2,
                                'Wednesday': 3,
                                'Thursday': 4,
                                'Friday': 5,
                                'Saturday': 6
                            };
                            return dayMap[day.trim()];
                        });

                        return {
                            id: schedule.sched_id,
                            title: `${schedule.user_fname} ${schedule.user_lname}`,
                            startTime: schedule.sched_time_in,
                            endTime: schedule.sched_time_out,
                            daysOfWeek: daysOfWeek,
                            startRecur: schedule.sched_start_date,
                            endRecur: schedule.sched_end_date,
                            extendedProps: {
                                notes: schedule.sched_notes,
                                department: schedule.dept_name
                            }
                        };
                    });

                    console.log('Formatted events:', formattedEvents); // Debug log
                    setEvents(formattedEvents);
                }
            } catch (error) {
                console.error('Error fetching schedules:', error);
            }
        };

        fetchSchedules();
    }, []);

    const handleEventClick = (clickInfo: any) => {
        const scheduleId = clickInfo.event.id;
        router.push(`/technical/wschedules/view?id=${scheduleId}`);
    };

    return (
        <div className="container mx-auto py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
                <Card className="w-full">
                    <CardHeader className="pb-3">
                        <CardTitle>Working Student Schedules</CardTitle>
                        <CardDescription className="text-balance leading-relaxed">
                            Manage the schedules of the working students.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <DataTableAdd text="Add New Schedule" href="/technical/wschedules/new" />
                    </CardFooter>
                </Card>
            </div>
            <br/>
            <Card className="w-full p-4">
                <div className="overflow-x-auto [&_.fc]:min-w-[800px] [&_.fc]:h-auto">
                    <FullCalendar
                        plugins={[timeGridPlugin, interactionPlugin]}
                        initialView="timeGridWeek"
                        events={events}
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'timeGridWeek,timeGridDay'
                        }}
                        allDaySlot={false}
                        slotMinTime="06:00:00"
                        slotMaxTime="22:00:00"
                        height="auto"
                        eventClick={handleEventClick}
                        eventContent={(eventInfo) => {
                            return (
                                <div className="p-1">
                                    <div className="font-semibold">{eventInfo.event.title}</div>
                                    <div className="text-sm">{eventInfo.event.extendedProps.department}</div>
                                    {eventInfo.event.extendedProps.notes && (
                                        <div className="text-xs">{eventInfo.event.extendedProps.notes}</div>
                                    )}
                                </div>
                            );
                        }}
                    />
                </div>
            </Card>
        </div>
    );
}
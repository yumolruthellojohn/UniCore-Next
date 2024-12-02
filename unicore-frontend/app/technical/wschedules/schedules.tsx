'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createColumns, Schedule } from "./schedule-columns"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableAdd } from "@/components/data-table/data-table-add-button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Toaster } from "@/components/ui/toaster"
import axios from "axios"
import { Session } from 'next-auth'
import { useRouter } from 'next/navigation'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { ip_address } from '@/app/ipconfig'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import GenerateSchedulesPDFReport from './report'

const filterScheduleColumn = {
    id: "user_fname",
    title: "Staff Name",
}

export default function Schedules({ session }: { session: Session | null }) {
    const router = useRouter()
    console.log('Session data:', session)
    const userID = session?.user?.user_id;
    const userDept = session?.user?.dept_id;
    const userPosition = session?.user?.user_position;
    const [scheduleData, setScheduleData] = useState<Schedule[]>([])
    const [events, setEvents] = useState([])

    const getScheduleData = useCallback(async () => {
        if (userDept) {
            try {
                const sched_response = await axios.get(`http://${ip_address}:8081/schedules`)
                return sched_response.data
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        } else {
            console.log('Unable to set dept_id. User ID:', session?.user?.user_id)
            return null
        }
    }, [session])

    const getEvents = useCallback(async () => {
        try {
            const response = await axios.get(
                userPosition === "Working Student"
                    ? `http://${ip_address}:8081/schedules/userID/${userID}`
                    : `http://${ip_address}:8081/schedules`
            )

            const formattedEvents = response.data.map((event: any) => ({
                id: event.sched_id,
                title: `${event.user_fname} ${event.user_lname}`,
                daysOfWeek: event.sched_days_of_week.split(', ').map((day: string) => {
                    const days: { [key: string]: number } = {
                        'Sunday': 0,
                        'Monday': 1,
                        'Tuesday': 2,
                        'Wednesday': 3,
                        'Thursday': 4,
                        'Friday': 5,
                        'Saturday': 6
                    }
                    return days[day]
                }),
                startTime: event.sched_time_in,
                endTime: event.sched_time_out,
                startRecur: event.sched_start_date,
                endRecur: event.sched_end_date,
                extendedProps: {
                    notes: event.sched_notes,
                    department: event.dept_name
                }
            }))
            setEvents(formattedEvents)
        } catch (error) {
            console.error('Error fetching events:', error)
        }
    }, [])

    // render custom event content
    const renderEventContent = (eventInfo: any) => {
        return (
            <div className="p-1">
                <div className="font-semibold">{eventInfo.event.title}</div>
                <div className="text-sm">{eventInfo.event.extendedProps.department}</div>
                {eventInfo.event.extendedProps.notes && (
                    <div className="text-xs">{eventInfo.event.extendedProps.notes}</div>
                )}
            </div>
        );
    }

    const refreshData = useCallback(async () => {
        const freshScheduleData = await getScheduleData()
        setScheduleData(freshScheduleData || [])
        await getEvents()
    }, [getScheduleData, getEvents])

    useEffect(() => {
        refreshData()
    }, [refreshData])

    const scheduleColumns = useMemo(() => createColumns(refreshData), [refreshData])

    const handleEventClick = useCallback((clickInfo: any) => {
        const scheduleId = clickInfo.event.id
        router.push(`/technical/wschedules/view?id=${scheduleId}`)
    }, [router])

    return (
        <div className="container mx-auto py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
                <Card className="w-full">
                    <CardHeader className="pb-3">
                        <CardTitle>Working Student Schedules</CardTitle>
                        <CardDescription className="max-w-lg text-balance leading-relaxed">
                            Manage schedules of working students and view their details.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                    {userPosition !== "Working Student" ? (
                        <DataTableAdd text="Create New Schedule" href="/technical/wschedules/new" />
                    ) : (
                        <h3>For concenrns about your schedule, please contact your supervisor.</h3>
                    )}
                    </CardFooter>
                </Card>
                {userPosition !== "Working Student" && (
                    <Card className="w-full">
                        <CardHeader className="pb-3">
                            <CardTitle>Export Data</CardTitle>
                            <CardDescription className="text-balance leading-relaxed">
                                Fetch all data and export to PDF.
                            </CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <GenerateSchedulesPDFReport></GenerateSchedulesPDFReport>
                        </CardFooter>
                    </Card>
                )}
            </div>
            <br />
            {userPosition !== "Working Student" && (
                <Accordion type="single" collapsible className='bg-white px-2 py-1 rounded'>
                    <AccordionItem value='table-1'>
                        <AccordionTrigger>
                            <h1 className="text-2xl font-bold px-2">Schedules Table</h1>
                        </AccordionTrigger>
                        <AccordionContent>
                            <DataTable 
                                columns={scheduleColumns}
                                data={scheduleData} 
                                filterColumn={filterScheduleColumn}
                                onDataChange={refreshData}
                            />
                        </AccordionContent>
                    </AccordionItem>
            </Accordion>
            )}

            <div className="mt-6 bg-white p-4 rounded-lg shadow overflow-x-auto">
                <div className="min-w-[800px]">
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay'
                        }}
                        events={events}
                        eventContent={renderEventContent}
                        eventClick={handleEventClick}
                        height={'auto'}
                        allDaySlot={false}
                        slotMinTime={'07:00:00'}
                        slotMaxTime={'22:00:00'}
                        slotEventOverlap={true}
                        eventDidMount={(info) => {
                            if (info.view.type === 'dayGridMonth') {
                                info.el.style.whiteSpace = 'wrap';
                                info.el.style.overflow = 'hidden';
                                info.el.style.textOverflow = 'ellipsis';
                            }
                        }}
                    />
                </div>
            </div>
            <Toaster />
        </div>
    )
}
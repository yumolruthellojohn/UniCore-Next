'use client';

import { useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ip_address } from '@/app/ipconfig';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';


export function formatDateToWords(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
}

export default function GenerateRequestPDFReport({ username }: { username: string | null }) {
    const [selectFilter, setSelectFilter] = useState({ filter: "Request Type" });
    const [selectRequestTypeFilter, setSelectRequestTypeFilter] = useState({filter: "Item Reservation"})
    const [createdStartDate, setCreatedStartDate] = useState({start_date: ""});
    const [createdEndDate, setCreatedEndDate] = useState({end_date: ""});
    const [completedStartDate, setCompletedStartDate] = useState({start_date: ""});
    const [completedEndDate, setCompletedEndDate] = useState({end_date: ""});
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    //Current Date
    const today = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = monthNames[today.getMonth()];
    const day = today.getDate();
    const year = today.getFullYear();

    const handleSelectFilterChange = (name: string, value: string) => {
        setSelectFilter(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSelectReqeustTypeFilterChange = (name: string, value: string) => {
        setSelectRequestTypeFilter(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleCreatedStartDateChange = (name: string, value: string) => {
        setCreatedStartDate(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleCreatedEndDateChange = (name: string, value: string) => {
        setCreatedEndDate(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleCompletedStartDateChange = (name: string, value: string) => {
        setCompletedStartDate(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleCompletedEndDateChange = (name: string, value: string) => {
        setCompletedEndDate(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const generatePDF = async () => {
        const doc = new jsPDF();
        let currentPage = 0; // Initialize current page count

        doc.setFontSize(10);

        const img = new Image();
        img.src = '/images/uclm_icon.png';
        await new Promise((resolve) => {
            img.onload = () => {
                doc.addImage(img, 'PNG', 12, 5, 35, 23);
                resolve(null);
            };
        });

        const campus_name = "UNIVERSITY OF CEBU LAPU-LAPU MANDAUE";
        const campus_address = "A.C. Cortez Ave., Looc, Mandaue City";
        const report_title = "STANDARD REQUESTS INFORMATION REPORT";
        const report_date = `As of ${month} ${day}, ${year}`;

        const campus_name_width = doc.getTextWidth(campus_name);
        const campus_name_align = (doc.internal.pageSize.getWidth() - campus_name_width) / 2;

        const campus_address_width = doc.getTextWidth(campus_address);
        const campus_address_align = (doc.internal.pageSize.getWidth() - campus_address_width) / 2;

        const report_title_width = doc.getTextWidth(report_title);
        const report_title_align = (doc.internal.pageSize.getWidth() - report_title_width) / 2;

        const report_date_width = doc.getTextWidth(report_date);
        const report_date_align = (doc.internal.pageSize.getWidth() - report_date_width) / 2;

        let tableData: any[] = [];
        let headers: string[] = [];
        let endpoint = '';

        try {
            switch(selectFilter.filter) {
                case 'Request Type':
                    switch(selectRequestTypeFilter.filter) {
                        case 'Item Reservation':
                            endpoint = `http://${ip_address}:8081/requests/reserve_item`;
                            headers = ['Request ID', 'Department', 'Item', 'Quantity', 'Date Submitted', 'Date Completed', 'Status'];
                            break;
                        case 'Facility Reservation':
                            endpoint = `http://${ip_address}:8081/requests/reserve_room`;
                            headers = ['Request ID', 'Department', 'Room', 'Date Submitted', 'Date Completed', 'Status'];
                            break;
                        case 'Service for Item':
                            endpoint = `http://${ip_address}:8081/requests/service_item`;
                            headers = ['Request ID', 'Department', 'Item', 'Quantity', 'Service Type', 'Date Submitted', 'Date Completed', 'Status'];
                            break;
                        case 'Service for Facility':
                            endpoint = `http://${ip_address}:8081/requests/service_room`;
                            headers = ['Request ID', 'Department', 'Room', 'Service Type', 'Date Submitted', 'Date Completed', 'Status'];
                            break;
                    }
                    break;
                case 'Date Submitted':
                    endpoint = `http://${ip_address}:8081/requests/created_date/${createdStartDate.start_date}/${createdEndDate.end_date}`;
                    headers = ['Request ID', 'Type', 'Department', 'Priority', 'Submitted by', 'Status'];
                    break;
                case 'Date Completed':
                    endpoint = `http://${ip_address}:8081/requests/completed_date/${completedStartDate.start_date}/${completedEndDate.end_date}`;
                    headers = ['Request ID', 'Type', 'Department', 'Priority', 'Submitted by', 'Status'];
                    break;
            }

            const response = await axios.get(endpoint);
            tableData = response.data;

            let body: any[] = [];
            switch (selectFilter.filter) {
                case 'Request Type':
                    switch(selectRequestTypeFilter.filter) {
                        case 'Item Reservation':
                            body = tableData.map(item => [
                                item.rq_id,
                                item.dept_name,
                                item.item_name,
                                item.rq_quantity,
                                item.rq_create_date,
                                item.rq_complete_date,
                                item.rq_status
                            ]);
                            break;
                        case 'Facility Reservation':
                            body = tableData.map(item => [
                                item.rq_id,
                                item.dept_name,
                                item.room_name,
                                item.rq_create_date,
                                item.rq_complete_date,
                                item.rq_status
                            ]);
                            break;
                        case 'Service for Item':
                            body = tableData.map(item => [
                                item.rq_id,
                                item.dept_name,
                                item.item_name,
                                item.rq_quantity,
                                item.rq_service_type,
                                item.rq_create_date,
                                item.rq_complete_date,
                                item.rq_status
                            ]);
                            break;
                        case 'Service for Facility':
                            body = tableData.map(item => [
                                item.rq_id,
                                item.dept_name,
                                item.room_name,
                                item.rq_service_type,
                                item.rq_create_date,
                                item.rq_complete_date,
                                item.rq_status
                            ]);
                            break;
                    }
                    break;
                case 'Date Submitted':
                    body = tableData.map(item => [
                        item.rq_id,
                        item.rq_type,
                        item.dept_name,
                        item.rq_prio_level,
                        item.user_fname + " " + item.user_lname,
                        item.rq_status
                    ]);
                    break;
                case 'Date Completed':
                    body = tableData.map(item => [
                        item.rq_id,
                        item.rq_type,
                        item.dept_name,
                        item.rq_prio_level,
                        item.user_fname + " " + item.user_lname,
                        item.rq_status
                    ]);
                    break;
            }

            doc.text(campus_name, campus_name_align, 10);
            doc.text(campus_address, campus_address_align, 15);
            doc.text(report_title, report_title_align, 20);
            doc.text(report_date, report_date_align, 25);

            const reportType = selectFilter.filter;

            let reportTypeValue = '';

            switch (selectFilter.filter) {
                case 'Request Type':
                    reportTypeValue = selectRequestTypeFilter.filter;
                    break;
                case 'Date Submitted':
                    reportTypeValue = `From ${formatDateToWords(createdStartDate.start_date)} to ${formatDateToWords(createdEndDate.end_date)}`;
                    break;
                case 'Date Completed':
                    reportTypeValue = `From ${formatDateToWords(completedStartDate.start_date)} to ${formatDateToWords(completedEndDate.end_date)}`;
                    break;
            }

            const reportTypeText = `${reportType}: ${reportTypeValue}`;
            const reportTypeWidth = doc.getTextWidth(reportTypeText);
            const reportTypeAlign = (doc.internal.pageSize.getWidth() - reportTypeWidth) / 2;
            doc.text(reportTypeText, reportTypeAlign, 35);

            (doc as any).autoTable({
                startY: 40,
                head: [headers],
                body: body,
                didDrawCell: (data: any) => {
                    // Check if the current cell is the last cell of the last row
                    if (body.length == 1 && data.row.index === body.length - 1 && data.column.index === headers.length - 1) {
                        currentPage = 1;
                    }
                    else if (body.length > 1 && data.row.index === body.length - 1 && data.column.index === headers.length - 1) {
                        // Increment the current page count
                        currentPage++;
                    }
                },
                margin: { bottom: 20 }, // Add margin to avoid overlap with footer
            });

            // Add page number footer
            const totalPages = currentPage; // Use the tracked current page count
            for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                const pageNumberText = `Page ${i} of ${totalPages}`;
                const textWidth = doc.getTextWidth(pageNumberText);
                const x = doc.internal.pageSize.getWidth() - textWidth - 10; // 10 units from the right
                const y = doc.internal.pageSize.getHeight() - 10; // 10 units from the bottom
                doc.text(pageNumberText, x, y);

                // Add username at the bottom left
                const usernameText = `Generated by: ${username}`;
                doc.text(usernameText, 10, y); // 10 units from the left
            }

            doc.save("unicore_requests_report.pdf");
            setShowSuccessDialog(false);
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
    };

    return (
        <div className="container mx-auto">
            <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded" onClick={() => setShowSuccessDialog(true)}>
                Generate PDF
            </Button>

            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Select Request Type</DialogTitle>
                        <DialogDescription>
                            Please select the type of requests for the report.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={(e) => { e.preventDefault(); generatePDF(); }} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-4">
                                <h3>Filter Type:</h3>
                                <RadioGroup value={selectFilter.filter} defaultValue="request_type" onValueChange={(value) => handleSelectFilterChange('filter', value)}>
                                    <div className="flex items-center space-x-2 px-5">
                                        <RadioGroupItem id="r1" value="Request Type" />
                                        <Label htmlFor="r1">Request Type</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 px-5">
                                        <RadioGroupItem id="r2" value="Date Submitted" />
                                        <Label htmlFor="r2">Date Submitted</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 px-5">
                                        <RadioGroupItem id="r3" value="Date Completed" />
                                        <Label htmlFor="r3">Date Completed</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            {selectFilter.filter === 'Request Type' && (
                                <div className="space-y-2">
                                    <h3>Select Request Type:</h3>
                                    <Select onValueChange={(value) => handleSelectReqeustTypeFilterChange('filter', value)} defaultValue={selectRequestTypeFilter.filter} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Item Reservation">Item Reservation</SelectItem>
                                            <SelectItem value="Facility Reservation">Facility Reservation</SelectItem>
                                            <SelectItem value="Service for Item">Service for Item</SelectItem>
                                            <SelectItem value="Service for Facility">Service for Facility</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {selectFilter.filter === 'Date Submitted' && (
                                <div className="space-y-2">
                                    <h3>Select Date Range:</h3>
                                    <div className="space-y-2">
                                        <Label htmlFor="startDate">Start Date:</Label>
                                        <Input
                                            type="date"
                                            id="start_date"
                                            value={createdStartDate.start_date}
                                            onChange={(e) => handleCreatedStartDateChange('start_date', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="endDate">End Date:</Label>
                                        <Input
                                            type="date"
                                            id="end_date"
                                            value={createdEndDate.end_date}
                                            onChange={(e) => handleCreatedEndDateChange('end_date', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {selectFilter.filter === 'Date Completed' && (
                                <div className="space-y-2">
                                    <h3>Select Date Range:</h3>
                                    <div className="space-y-2">
                                        <Label htmlFor="startDate">Start Date:</Label>
                                        <Input
                                            type="date"
                                            id="start_date"
                                            value={completedStartDate.start_date}
                                            onChange={(e) => handleCompletedStartDateChange('start_date', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="endDate">End Date:</Label>
                                        <Input
                                            type="date"
                                            id="end_date"
                                            value={completedEndDate.end_date}
                                            onChange={(e) => handleCompletedEndDateChange('end_date', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button type="submit">Download PDF</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

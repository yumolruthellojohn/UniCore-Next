'use client';

import { useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ip_address } from '@/app/ipconfig';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export default function GenerateRequestPDFReport() {
    const [selectFilter, setSelectFilter] = useState({ filter: "Item Reservation" });
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

            const response = await axios.get(endpoint);
            tableData = response.data;

            let body: any[] = [];
            switch(selectFilter.filter) {
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

            doc.text(campus_name, campus_name_align, 10);
            doc.text(campus_address, campus_address_align, 15);
            doc.text(report_title, report_title_align, 20);
            doc.text(report_date, report_date_align, 25);

            const reportType = selectFilter.filter;
            const reportTypeText = `Request Type: ${reportType}`;
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
                                <h3>Request Type:</h3>
                                <RadioGroup value={selectFilter.filter} defaultValue="Item Reservation" onValueChange={(value) => handleSelectFilterChange('filter', value)}>
                                    <div className="flex items-center space-x-2 px-5">
                                        <RadioGroupItem id="r1" value="Item Reservation" />
                                        <Label htmlFor="r1">Item Reservation</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 px-5">
                                        <RadioGroupItem id="r2" value="Facility Reservation" />
                                        <Label htmlFor="r2">Facility Reservation</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 px-5">
                                        <RadioGroupItem id="r3" value="Service for Item" />
                                        <Label htmlFor="r3">Service for Item</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 px-5">
                                        <RadioGroupItem id="r4" value="Service for Facility" />
                                        <Label htmlFor="r4">Service for Facility</Label>
                                    </div>
                                </RadioGroup>
                            </div>
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

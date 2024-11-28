'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ip_address } from '@/app/ipconfig';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface Departments {
    dept_id: number;
    dept_name: string;
}

export default function GenerateFacilityPDFReport() {
    const [selectFilter, setSelectFilter] = useState({ filter: "department" });
    const [filter, setFilter] = useState({ dept_id: '' });
    const [departments, setDepartments] = useState<Departments[]>([]);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    //Current Date
    const today = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = monthNames[today.getMonth()];
    const day = today.getDate();
    const year = today.getFullYear();

    useEffect(() => {
        // Fetch departments from your API
        const fetchDepartments = async () => {
            try {
                const response = await axios.get(`http://${ip_address}:8081/departments`);
                setDepartments(response.data);
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };

        fetchDepartments();
    }, []);

    const handleSelectFilterChange = (name: string, value: string) => {
        setSelectFilter(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFilterChange = (name: string, value: string) => {
        setFilter(prevState => ({
            ...prevState,
            [name]: value,
        }));
    }

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
        const report_title = "FACILITIES INFORMATION REPORT";
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

        try {
            if (selectFilter.filter === 'department' && filter.dept_id) {
                const response = await axios.get(`http://${ip_address}:8081/rooms/deptID/${filter.dept_id}`);
                tableData = response.data;
            } else if (selectFilter.filter === 'all') {
                const response = await axios.get(`http://${ip_address}:8081/rooms`);
                tableData = response.data;
            }

            // Add text at the top of the table
            let topText = "";
            if (selectFilter.filter === 'department' && filter.dept_id) {
                try {
                    const response = await axios.get(`http://${ip_address}:8081/departments/${filter.dept_id}`);
                    topText = "Department: " + response.data[0].dept_name;
                }
                catch (error) {
                    console.error('Error fetching department name:', error);
                }
            }

            const topTextWidth = doc.getTextWidth(topText);
            const topTextAlign = (doc.internal.pageSize.getWidth() - topTextWidth) / 2;

            doc.text(campus_name, campus_name_align, 10);
            doc.text(campus_address, campus_address_align, 15);
            doc.text(report_title, report_title_align, 20);
            doc.text(report_date, report_date_align, 25);
            doc.text(topText, topTextAlign, 35);

            // Define headers and body
            const headers = ['Building', 'Floor Level', 'Type', 'Name', 'Description', 'Status'];
            const body = tableData.map(room => [
                room.room_bldg,
                room.room_floor,
                room.room_type,
                room.room_name,
                room.room_desc,
                room.room_status
            ]);

            // Add table to PDF with autoTable
            (doc as any).autoTable({
                startY: 40,
                head: [headers],
                body: body,
                didDrawCell: (data: any) => {
                    // Check if the current cell is the last cell of the last row
                    if (data.row.index === body.length - 1 && data.column.index === headers.length - 1) {
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

            doc.save("unicore_facilities_report.pdf");
            setShowSuccessDialog(false);
        } catch (error) {
            console.error('Error fetching facilities:', error);
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
                        <DialogTitle>Select Filters</DialogTitle>
                        <DialogDescription>
                            Please select the filters for the report.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={(e) => { e.preventDefault(); generatePDF(); }} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-4">
                                <h3>Filter Type:</h3>
                                <RadioGroup value={selectFilter.filter} defaultValue="department" onValueChange={(value) => handleSelectFilterChange('filter', value)}>
                                    <div className="flex items-center space-x-2 px-5">
                                        <RadioGroupItem id="r1" value="department" />
                                        <Label htmlFor="r1">Department</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 px-5">
                                        <RadioGroupItem id="r2" value="all" />
                                        <Label htmlFor="r2">All</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            {selectFilter.filter === 'department' && (
                                <div className="space-y-2">
                                    <h3>Select Department:</h3>
                                    <Select onValueChange={(value) => handleFilterChange('dept_id', value)} defaultValue={filter.dept_id} required>
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
                            )}

                            {selectFilter.filter === 'all' && (
                                <div className="space-y-2">
                                    <h3>Report will include all facilities</h3>
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

'use client';

import { Button } from "@/components/ui/button";
import { jsPDF } from 'jspdf';
import { ip_address } from '@/app/ipconfig';
import axios from 'axios';

export function formatDateToWords(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
}

export default function DownloadRequestPDF({ requestId, requestType }: { requestId: string, requestType: string }) {
    const generatePDF = async () => {
        // Create PDF in A5 landscape orientation
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a5'  // 148 x 210 mm
        });

        doc.setFontSize(10);  // Reduced font size for smaller format

        // Add UCLM logo (scaled down for smaller format)
        const img = new Image();
        img.src = '/images/uclm_icon.png';
        await new Promise((resolve) => {
            img.onload = () => {
                doc.addImage(img, 'PNG', 12, 5, 25, 16);  // Reduced size
                resolve(null);
            };
        });

        // Header text
        const campus_name = "UNIVERSITY OF CEBU LAPU-LAPU MANDAUE";
        const campus_address = "A.C. Cortez Ave., Looc, Mandaue City";
        const report_title = "STANDARD REQUEST INFORMATION SLIP";

        // Center align header text
        const campus_name_width = doc.getTextWidth(campus_name);
        const campus_name_align = (doc.internal.pageSize.getWidth() - campus_name_width) / 2;
        const campus_address_width = doc.getTextWidth(campus_address);
        const campus_address_align = (doc.internal.pageSize.getWidth() - campus_address_width) / 2;
        const report_title_width = doc.getTextWidth(report_title);
        const report_title_align = (doc.internal.pageSize.getWidth() - report_title_width) / 2;

        // Draw header text
        doc.text(campus_name, campus_name_align, 10);
        doc.text(campus_address, campus_address_align, 15);
        doc.text(report_title, report_title_align, 20);

        try {
            // Determine endpoint based on request type
            let endpoint = '';
            switch(requestType) {
                case 'Reserve Item':
                    endpoint = `http://${ip_address}:8081/requests/reserve_item/${requestId}`;
                    break;
                case 'Reserve Facility':
                    endpoint = `http://${ip_address}:8081/requests/reserve_room/${requestId}`;
                    break;
                case 'Service for Item':
                    endpoint = `http://${ip_address}:8081/requests/service_item/${requestId}`;
                    break;
                case 'Service for Facility':
                    endpoint = `http://${ip_address}:8081/requests/service_room/${requestId}`;
                    break;
            }

            const response = await axios.get(endpoint);
            const request = response.data[0];

            // Start Y position after header
            let yPos = 30;

            // Request Details in 2 columns
            doc.setFontSize(10);  // Smaller font for details
            
            // Left column
            const leftX = 20;
            doc.text(`Request ID: ${request.rq_id}`, leftX, yPos);
            doc.text(`Request Type: ${request.rq_type}`, leftX, yPos + 7);
            doc.text(`Department: ${request.dept_name}`, leftX, yPos + 14);
            doc.text(`Date Submitted: ${formatDateToWords(request.rq_create_date)}`, leftX, yPos + 21);
            doc.text(`Date Completed: ${request.rq_complete_date ? formatDateToWords(request.rq_complete_date) : "(Not completed yet)"}`, leftX, yPos + 28);
            doc.text(`Status: ${request.rq_status}`, leftX, yPos + 35);
            
            // Right column (start halfway across the page)
            const rightX = doc.internal.pageSize.getWidth() / 2;

            doc.text(`Start Date: ${formatDateToWords(request.rq_start_date)}`, rightX, yPos);
            doc.text(`End Date: ${formatDateToWords(request.rq_end_date)}`, rightX, yPos + 7);
            doc.text(`Time: ${request.rq_start_time} - ${request.rq_end_time}`, rightX, yPos + 14);

            // Type-specific details
            if (requestType === 'Reserve Item' || requestType === 'Service for Item') {
                doc.text(`Item: ${request.item_name}`, rightX, yPos + 21);
                doc.text(`Quantity: ${request.rq_quantity}`, rightX, yPos + 28);
            } else {
                doc.text(`Facility: ${request.room_name}`, rightX, yPos + 21);
            }

            if (requestType.includes('Service')) {
                doc.text(`Service Type: ${request.rq_service_type}`, rightX, yPos + 35);
            }

            // Purpose/Notes with word wrap
            const maxWidth = 80;
            const splitNotes = doc.splitTextToSize(`Purpose/Notes: ${request.rq_notes}`, maxWidth);
            doc.text(splitNotes, 20, yPos + 42);

            // Respondent notes with word wrap
            const splitNotesRespondent = doc.splitTextToSize(`Respondent Notes: ${request.rq_accept_notes || "(No notes yet)"}`, maxWidth);
            doc.text(splitNotesRespondent, rightX, yPos + 42);

            // Signatures section (adjusted Y position for smaller format)
            const signatureY = yPos + 60;

            // Get user signatures from the database
            let requestorSignature = null;
            let respondentSignature = null;
            let servicestaffSignature = null;

            try {
                // Get requestor signature if available
                const requestor = await axios.get(`http://${ip_address}:8081/users/${request.rq_create_user_id}`);
                if (requestor.data[0]?.user_sign) {
                    requestorSignature = requestor.data[0];
                }

                // Get respondent signature if available
                if (request.rq_accept_user_id) {
                    const respondent = await axios.get(`http://${ip_address}:8081/users/${request.rq_accept_user_id}`);
                    if (respondent.data[0]?.user_sign) {
                        respondentSignature = respondent.data[0];
                    }
                }

                // Get service staff signature if available
                if (request.rq_service_user_id) {
                    const servicestaff = await axios.get(`http://${ip_address}:8081/users/${request.rq_service_user_id}`);
                    if (servicestaff.data[0]?.user_sign) {
                        servicestaffSignature = servicestaff.data[0];
                    }
                }

                // Add signatures section header
                doc.setFontSize(10);

                // Add signatures with proper spacing (adjusted for smaller format)
                // Requestor signature
                if (requestorSignature?.user_sign) {
                    doc.addImage(requestorSignature.user_sign, 'PNG', 20, signatureY + 10, 35, 15);
                }
                doc.text('_____________________', 20, signatureY + 25);
                doc.text(`${requestorSignature?.user_fname || request.rq_create_user_fname} ${requestorSignature?.user_lname || request.rq_create_user_lname}`, 20, signatureY + 35);
                doc.text('Requestor', 20, signatureY + 45);

                // Respondent signature
                if (respondentSignature?.user_sign) {
                    doc.addImage(respondentSignature.user_sign, 'PNG', 80, signatureY + 10, 35, 15);
                }

                if (request.rq_accept_user_id) {
                    doc.text('_____________________', 80, signatureY + 25);
                    doc.text(`${respondentSignature?.user_fname || request.rq_accept_user_fname || 'Pending'} ${respondentSignature?.user_lname || request.rq_accept_user_lname || ''}`, 80, signatureY + 35);
                    doc.text('Respondent', 80, signatureY + 45);
                }

                // Service staff signature (only for service requests)
                if (request.rq_type?.includes('Service')) {
                    if (servicestaffSignature?.user_sign) {
                        doc.addImage(servicestaffSignature.user_sign, 'PNG', 150, signatureY + 10, 35, 15);
                    }

                    if (request.rq_service_user_id) {
                        doc.text('_____________________', 150, signatureY + 25);
                        doc.text(`${servicestaffSignature?.user_fname || request.rq_service_user_fname || 'Pending'} ${servicestaffSignature?.user_lname || request.rq_service_user_lname || ''}`, 150, signatureY + 35);
                        doc.text('Service Staff', 150, signatureY + 45);
                    }
                }

            } catch (error) {
                console.error('Error loading signatures:', error);
            }

            doc.save(`unicore_request_${requestId}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    return (
        <Button 
            onClick={generatePDF}
            className="w-full sm:w-auto"
            variant="default"
        >
            Download Request (PDF)
        </Button>
    );
}

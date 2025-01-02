'use client';

import { Button } from "@/components/ui/button";
import { jsPDF } from 'jspdf';
import { ip_address } from '@/app/ipconfig';
import { Download } from 'lucide-react'
import axios from 'axios';
import 'jspdf-autotable';

// Add this type declaration for jsPDF
declare module 'jspdf' {
    interface jsPDF {
        lastAutoTable?: {
            finalY: number;
        };
        autoTable: (options: any) => void;
    }
}

export function formatDateToWords(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
}

export default function DownloadJobRequestPDFIcon({ requestId }: { requestId: string }) {
    const generatePDF = async () => {
        // Create PDF in A4 portrait orientation
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        doc.setFontSize(10);

        // Add UCLM logo
        const img = new Image();
        img.src = '/images/uclm_icon.png';
        await new Promise((resolve) => {
            img.onload = () => {
                doc.addImage(img, 'PNG', 12, 5, 25, 16);
                resolve(null);
            };
        });

        // Header text
        const campus_name = "UNIVERSITY OF CEBU LAPU-LAPU MANDAUE";
        const campus_address = "A.C. Cortez Ave., Looc, Mandaue City";
        const report_title = "BMO JOB REQUEST INFORMATION SLIP";

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
            // Get job request data with user information
            const response = await axios.get(`http://${ip_address}:8081/jobrequests/${requestId}`);
            const request = response.data[0];

            // Fetch user signatures
            let requestorSignature = null;
            let bmoSignature = null;
            let custodianSignature = null;
            let cadsSignature = null;

            try {
                // Get requestor signature
                const requestor = await axios.get(`http://${ip_address}:8081/users/${request.job_create_user_id}`);
                requestorSignature = requestor.data[0];

                // Get BMO signature if available
                if (request.job_bmo_user_id) {
                    const bmo = await axios.get(`http://${ip_address}:8081/users/${request.job_bmo_user_id}`);
                    bmoSignature = bmo.data[0];
                }

                // Get custodian signature if available
                if (request.job_custodian_user_id) {
                    const custodian = await axios.get(`http://${ip_address}:8081/users/${request.job_custodian_user_id}`);
                    custodianSignature = custodian.data[0];
                }

                // Get CADS signature if available
                if (request.job_cads_user_id) {
                    const cads = await axios.get(`http://${ip_address}:8081/users/${request.job_cads_user_id}`);
                    cadsSignature = cads.data[0];
                }
            } catch (error) {
                console.error('Error loading signatures:', error);
            }

            // Start Y position after header
            let yPos = 30;

            // Request Details in 2 columns
            doc.setFontSize(10);
            
            // Left column
            const leftX = 20;
            doc.text(`Job Request ID: ${request.job_rq_id}`, leftX, yPos);
            doc.text(`Department: ${request.dept_name}`, leftX, yPos + 7);
            doc.text(`Purpose: ${request.job_purpose}`, leftX, yPos + 14);
            doc.text(`Date Created: ${formatDateToWords(request.job_create_date)}`, leftX, yPos + 21);

            // Right column
            const rightX = doc.internal.pageSize.getWidth() / 2 + 10;
            doc.text(`Status: ${request.job_status}`, rightX, yPos);
            
            if (request.job_estimated_cost) {
                doc.text(`Estimated Cost: ${request.job_estimated_cost}`, rightX, yPos + 7);
            }

            if (request.job_remarks) {
                doc.text(`Remarks: ${request.job_remarks}`, rightX, yPos + 14);
            }

            if (request.job_complete_date) {
                doc.text(`Date Completed: ${formatDateToWords(request.job_complete_date)}`, rightX, yPos + 21);
            }

            // Items table
            const items = JSON.parse(request.job_items);
            yPos += 35;
            
            doc.autoTable({
                startY: yPos,
                head: [['Quantity', 'Item Description']],
                body: items.map((item: any) => [
                    item.quantity,
                    item.name_desc
                ]),
                margin: { left: 20, right: 20 },
                theme: 'grid'
            });

            // Update yPos after table
            yPos = doc.lastAutoTable?.finalY || yPos + 40;

            // Recommendation section (if exists)
            if (request.job_recommendation) {
                yPos += 10;
                const maxWidth = doc.internal.pageSize.getWidth() - 40; // 20mm margins on each side
                const splitRecommendation = doc.splitTextToSize(`Recommendation: ${request.job_recommendation}`, maxWidth);
                doc.text(splitRecommendation, leftX, yPos);
                yPos += (splitRecommendation.length * 5) + 10; // Add space based on number of lines
            }

            // Signatures section
            doc.setFontSize(10);
            const signatureY = yPos + 10;

            // Requestor signature (left side)
            if (requestorSignature?.user_sign) {
                doc.addImage(requestorSignature.user_sign, 'PNG', leftX, signatureY, 35, 15);
            }
            doc.text('_____________________', leftX, signatureY + 15);
            doc.text(`${requestorSignature?.user_fname || ''} ${requestorSignature?.user_lname || ''}`, leftX, signatureY + 20);
            doc.text('Requestor', leftX, signatureY + 25);

            // BMO signature (right side)
            if (request.job_bmo_approval === "Approved") {
                if (bmoSignature?.user_sign) {
                    doc.addImage(bmoSignature.user_sign, 'PNG', rightX, signatureY, 35, 15);
                }
                doc.text('_____________________', rightX, signatureY + 15);
                doc.text(`${bmoSignature?.user_fname || ''} ${bmoSignature?.user_lname || ''}`, rightX, signatureY + 20);
                doc.text('BMO In Charge', rightX, signatureY + 25);
            }

            // Custodian signature (left side, next row)
            if (request.job_custodian_approval === "Approved") {
                if (custodianSignature?.user_sign) {
                    doc.addImage(custodianSignature.user_sign, 'PNG', leftX, signatureY + 40, 35, 15);
                }
                doc.text('_____________________', leftX, signatureY + 55);
                doc.text(`${custodianSignature?.user_fname || ''} ${custodianSignature?.user_lname || ''}`, leftX, signatureY + 60);
                doc.text('Property Custodian', leftX, signatureY + 65);
            }

            // CADS signature (right side, next row)
            if (request.job_cads_approval === "Approved") {
                if (cadsSignature?.user_sign) {
                    doc.addImage(cadsSignature.user_sign, 'PNG', rightX, signatureY + 40, 35, 15);
                }
                doc.text('_____________________', rightX, signatureY + 55);
                doc.text(`${cadsSignature?.user_fname || ''} ${cadsSignature?.user_lname || ''}`, rightX, signatureY + 60);
                doc.text('CADS Director', rightX, signatureY + 65);
            }

            doc.save(`unicore_job_request_${requestId}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    return (
        <Button 
            variant='ghost' 
            size="icon" 
            title="Download Job Request"
            onClick={generatePDF}
          >
            <Download className="h-4 w-4" />
        </Button>
    );
}

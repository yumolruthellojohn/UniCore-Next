declare module 'jspdf-autotable' {
    import { jsPDF } from 'jspdf';

    interface AutoTableOptions{
        head?: any[][];
        body?: any[][];
        startY?: number;
        margin?: { top?: number; bottom?: number; left?: number; right?: number };
        styles?: { [key: string]: any };
        // Add other options as needed
    }

    export function autoTable(doc: jsPDF, options: AutoTableOptions): void;
}
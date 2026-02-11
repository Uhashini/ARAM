import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateFIRPacket = (data) => {
    const doc = jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(44, 62, 80);
    doc.text('OFFICIAL FIR PACKET', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(127, 140, 141);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, 28, { align: 'center' });
    doc.text(`Report ID: ${data.reportId || 'N/A'}`, pageWidth / 2, 33, { align: 'center' });

    // Divider
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 38, pageWidth - 20, 38);

    // A. Metadata & Risk
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text('1. REPORT METADATA & RISK', 20, 50);

    autoTable(doc, {
        startY: 55,
        head: [['Field', 'Details']],
        body: [
            ['Reporter Mode', data.reporterMode?.toUpperCase()],
            ['Privacy Mode', data.privacyMode?.toUpperCase()],
            ['Risk Level', data.riskAssessment?.riskScore || 'PENDING'],
            ['Jurisdiction', 'Police Station (Local via Pincode)'],
        ],
        theme: 'striped',
        headStyles: { fillStyle: [102, 126, 234] }
    });

    // B. Incident Details
    doc.setFontSize(14);
    doc.text('2. INCIDENT DETAILS', 20, doc.lastAutoTable.finalY + 15);

    autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 20,
        body: [
            ['Abuse Type', data.abuseType?.join(', ') || 'None'],
            ['Frequency', data.frequency],
            ['Date/Time', data.dateTime ? new Date(data.dateTime).toLocaleString() : 'N/A'],
            ['Location', data.location || 'N/A']
        ]
    });

    // C & D. Parties
    doc.setFontSize(14);
    doc.text('3. PARTIES INVOLVED', 20, doc.lastAutoTable.finalY + 15);

    autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 20,
        head: [['Category', 'Victim Name', 'Accused Name', 'Relationship']],
        body: [
            ['Primary', data.victim?.name || 'Unknown', data.accused?.name || 'Unknown', data.accused?.relationshipToVictim || 'N/A'],
        ]
    });

    // E. Detailed Narrative
    doc.setFontSize(14);
    doc.text('4. INCIDENT NARRATIVE', 20, doc.lastAutoTable.finalY + 15);
    doc.setFontSize(10);
    const splitNarrative = doc.splitTextToSize(data.incidentDescription || 'No description provided.', pageWidth - 40);
    doc.text(splitNarrative, 20, doc.lastAutoTable.finalY + 25);

    // F. Recommended Legal Sections
    if (data.suggestedLegalSections?.length > 0) {
        doc.setFontSize(14);
        doc.text('5. SUGGESTED LEGAL PROVISIONS (INDIA)', 20, doc.lastAutoTable.finalY + 60);
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 65,
            body: data.suggestedLegalSections.map(s => [s])
        });
    }

    // Footer / Disclaimer
    const finalY = doc.lastAutoTable.finalY + 30;
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text('DISCLAIMER: This is a digitally generated summary of the witness report. It is intended for triage and official records. False reporting is punishable under IPC Section 182/211.', 20, finalY, { maxWidth: pageWidth - 40 });

    // Signature
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Digital Signature: ${data.consent?.digitalSignature || 'ELECTRONICALLY SIGNED'}`, pageWidth - 80, finalY + 20);

    // Save the PDF
    doc.save(`FIR_Packet_${data.reportId || 'Report'}.pdf`);
};

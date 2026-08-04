import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const getBase64FromUrl = async (url: string) => {
    const data = await fetch(url);
    const blob = await data.blob();

    return new Promise<string>((resolve) => {

        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            resolve(reader.result as string);
        };
    });
};

export const exportBillingInvoice = async (data: any) => {

    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a5",
    });

    // =====================================================
    // Logo
    // =====================================================

    const logo = await getBase64FromUrl("/logo2.png");

    doc.addImage(
        logo,
        "PNG",
        51,
        8,
        46,
        14
    );

    // =====================================================
    // Header Divider
    // =====================================================

    doc.setDrawColor(37, 150, 190);
    doc.setLineWidth(0.4);

    doc.line(
        10,
        26,
        138,
        26
    );

    // =====================================================
    // Clinic Card
    // =====================================================

    doc.setFillColor(248, 250, 252);

    doc.roundedRect(
        10,
        31,
        60,
        33,
        2,
        2,
        "F"
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);

    doc.text(
        "Clinic Information",
        14,
        38
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);

    doc.text(
        `Name : ${data[0].clinic.name}`,
        14,
        45
    );

    doc.text(
        `Address : ${data[0].clinic.address}`,
        14,
        51,
        {
            maxWidth: 52
        }
    );

    doc.text(
        `Mobile : ${data[0].clinic.mobile}`,
        14,
        60
    );

    // =====================================================
    // Patient Card
    // =====================================================

    doc.setFillColor(248, 250, 252);

    doc.roundedRect(
        76,
        31,
        60,
        33,
        2,
        2,
        "F"
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);

    doc.text(
        "Patient Information",
        80,
        38
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);

    doc.text(
        `Name : ${data[0].patient.name}`,
        80,
        45
    );

    doc.text(
        `Address : ${data[0].patient.address}`,
        80,
        51,
        {
            maxWidth: 52
        }
    );

    doc.text(
        `Mobile : ${data[0].patient.mobile}`,
        80,
        60
    );

    // =====================================================
    // Invoice Details Card
    // =====================================================

    doc.setFillColor(245, 250, 255);

    doc.roundedRect(
        10,
        70,
        126,
        42,
        2,
        2,
        "F"
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);

    doc.text(
        "Invoice Details",
        14,
        77
    );

    // Divider

    doc.setDrawColor(220);

    doc.line(
        14,
        80,
        132,
        80
    );

    // -----------------------------------------------------
    // Labels
    // -----------------------------------------------------

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);

    doc.text(
        "Invoice No",
        14,
        87
    );

    doc.text(
        "Paid Date",
        14,
        100
    );

    doc.text(
        "Doctor",
        74,
        87
    );


    // -----------------------------------------------------
    // Values
    // -----------------------------------------------------

    doc.setFont("helvetica", "normal");

    // Full Invoice Number
    doc.text(
        `INV-${data[0].billingId}`,
        14,
        92,
        {
            maxWidth: 56
        }
    );

    // Invoice Date
    doc.text(
        new Date(data[0].createdAt).toLocaleDateString("en-GB"),
        14,
        105
    );

    // Doctor
    doc.text(
        data[0].doctor.name,
        74,
        92,
        {
            maxWidth: 55
        }
    );


    // =====================================================
    // Billing Title
    // =====================================================

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(37, 150, 190);
    doc.text(
        "Billing Details",
        74,
        108,
        {
            align: "center"
        }
    );
    doc.setTextColor(0);

    // =====================================================
    // Billing Table
    // =====================================================

    autoTable(doc, {
        startY: 114,
        margin: {
            left: 10,
            right: 10,
        },
        pageBreak: "auto",
        rowPageBreak: "avoid",
        showHead: "everyPage",

        head: [[
            "#",
            "Treatment",
            "Amount (Rs.)"
        ]],

        body: [
            ...data[0].treatments.map((item: any, index: number) => [
                index + 1,
                item.name,
                Number(item.price).toLocaleString("en-LK", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })
            ]),

            [
                data[0].treatments.length + 1,
                "Doctor Fee",
                Number(data[0].appointment.fee || 0).toLocaleString("en-LK", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })
            ]
        ],

        theme: "grid",
        styles: {

            font: "helvetica",
            fontSize: 8.5,
            cellPadding: 3,
            minCellHeight: 9,
            overflow: "linebreak",
            valign: "middle",
            lineColor: [220, 220, 220],
            lineWidth: 0.15,
            textColor: [40, 40, 40],
        },

        headStyles: {
            fillColor: [37, 150, 190],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            fontSize: 9,
            halign: "center",
            valign: "middle",
            minCellHeight: 10,

        },

        alternateRowStyles: {
            fillColor: [248, 249, 250],

        },

        bodyStyles: {
            fillColor: [255, 255, 255],

        },

        columnStyles: {
            0: {
                cellWidth: 12,
                halign: "center",
            },
            1: {
                cellWidth: 76,
                halign: "left",
            },
            2: {
                cellWidth: 30,
                halign: "right",
            },

        },

        didParseCell: (hookData) => {
            if (
                hookData.section === "body" &&
                hookData.row.index === data[0].treatments.length
            ) {
                hookData.cell.styles.fontStyle = "bold";
            }

        },

        didDrawPage: () => {
            doc.setDrawColor(170);
            doc.setLineWidth(0.1);
            doc.rect(
                6,
                6,
                136,
                198
            );
        }

    });

    // =====================================================
    // Grand Total
    // =====================================================

    const tableEnd =
        (doc as any).lastAutoTable.finalY + 6;

    doc.setFillColor(
        240,
        248,
        255
    );

    doc.roundedRect(
        78,
        tableEnd,
        55,
        10,
        2,
        2,
        "F"
    );

    doc.setFont(
        "helvetica",
        "bold"
    );

    doc.setFontSize(10);

    doc.text(
        "Grand Total",
        82,
        tableEnd + 6
    );

    doc.setTextColor(
        33,
        162,
        98
    );

    doc.text(
        `Rs. ${data[0].amount.toLocaleString("en-LK", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`,
        126,
        tableEnd + 6,
        {
            align: "right",
        }
    );

    doc.setTextColor(
        0,
        0,
        0
    );


    // =====================================================
    // Dynamic Positioning
    // =====================================================

    const pageHeight = doc.internal.pageSize.getHeight();

    let currentY = (doc as any).lastAutoTable.finalY + 10;

    // Helper to move to a new page only when required
    const ensureSpace = (requiredHeight: number) => {

        if (currentY + requiredHeight > pageHeight - 8) {

            doc.addPage();

            // Page Border
            doc.setDrawColor(170);
            doc.setLineWidth(0.1);
            doc.rect(6, 6, 136, 198);

            currentY = 18;
        }

    };

    // =====================================================
    // Notes Section
    // =====================================================

    ensureSpace(32);

    /*     doc.setDrawColor(180);
        doc.line(
            8,
            currentY,
            140,
            currentY
        ); */

    currentY += 8;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);

    doc.text(
        "Special Notes",
        12,
        currentY
    );

    currentY += 4;

    // Notes Box

    doc.setFillColor(252, 252, 252);

    doc.roundedRect(
        12,
        currentY,
        123,
        18,
        2,
        2,
        "FD"
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    doc.text(
        data[0].specialNotes || "No special notes provided.",
        15,
        currentY + 7,
        {
            maxWidth: 116
        }
    );

    currentY += 28;

    // =====================================================
    // Signature Section
    // =====================================================

    ensureSpace(30);

    doc.setDrawColor(180);

    doc.line(
        8,
        currentY,
        140,
        currentY
    );

    currentY += 12;

    const signatureLineY = currentY;

    //
    // Signature Lines
    //

    for (let x = 15; x <= 65; x += 3) {

        doc.line(
            x,
            signatureLineY,
            x + 1.5,
            signatureLineY
        );

    }

    for (let x = 95; x <= 130; x += 3) {

        doc.line(
            x,
            signatureLineY,
            x + 1.5,
            signatureLineY
        );

    }

    currentY += 8;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);

    doc.text(
        "Doctor's Signature",
        40,
        currentY,
        {
            align: "center"
        }
    );

    doc.text(
        "Date",
        112,
        currentY,
        {
            align: "center"
        }
    );

    currentY += 18;

    // =====================================================
    // Footer
    // =====================================================

    ensureSpace(24);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);

    doc.text(
        "Thank You For Choosing",
        74,
        currentY,
        {
            align: "center"
        }
    );

    currentY += 7;

    doc.setTextColor(37, 150, 190);

    doc.setFontSize(12);

    doc.text(
        data[0].clinic.name,
        74,
        currentY,
        {
            align: "center"
        }
    );

    currentY += 7;

    doc.setTextColor(120);

    doc.setFontSize(8);

    doc.text(
        "Powered by Odora • Smiles Made Simple",
        74,
        currentY,
        {
            align: "center"
        }
    );

    doc.setTextColor(0);

    currentY += 7;

    doc.setTextColor(120);

    doc.setFontSize(5);

    doc.text(
        ` Printed Date : ${new Date().toLocaleString()}`,
        74,
        currentY,
        {
            align: "center"
        }
    );

    // =====================================================
    // Border (Last Page)
    // =====================================================

    doc.setDrawColor(170);

    doc.setLineWidth(0.1);

    doc.rect(
        6,
        6,
        136,
        198
    );

    // =====================================================
    // Save
    // =====================================================

    doc.save(
        `Invoice-${data[0].billingId}-${new Date().toDateString()}.pdf`
    );

};
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Summary {
    totalPatients: number;
    malePatients: number;
    femalePatients: number;
    averageAge: number;
    newPatients: number;
    returningPatients: number;
    oneTimePatients: number;
    averageVisits: number;
}

interface PatientDetail {
    name: string;
    birthDay: string;
    address: string;
    mobileNumber: string;
    gender?: string;
    age?: number;
    visits?: number;
    patientType?: string;
}

interface GenderDistribution {
    gender: string;
    count: number;
    percentage: number;
}

interface AgeDistribution {
    ageGroup: string;
    count: number;
    percentage: number;
}

interface TopPatient {
    name: string;
    visits: number;
}

interface PatientDemographicReport {
    summary: Summary;
    PatientsDetals: PatientDetail[];
    genderDistribution: GenderDistribution[];
    ageDistribution: AgeDistribution[];
    topPatients: TopPatient[];
}

const PRIMARY: [number, number, number] = [37, 99, 235];
const SUCCESS: [number, number, number] = [34, 197, 94];
const WARNING: [number, number, number] = [249, 115, 22];
const PURPLE: [number, number, number] = [147, 51, 234];
const DARK: [number, number, number] = [55, 65, 81];

const getBase64FromUrl = async (url: string) => {
    const data = await fetch(url);
    const blob = await data.blob();

    return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => resolve(reader.result as string);
    });
};

const formatDate = (date: string) =>
    new Date(date).toLocaleDateString();

const calculateAge = (birthday: string) => {
    const birth = new Date(birthday);

    return Math.floor(
        (Date.now() - birth.getTime()) /
        (365.25 * 24 * 60 * 60 * 1000)
    );
};

export const exportPatientDemographicReport = async (
    report: PatientDemographicReport,
    filter: string,
    from?: string,
    to?: string
) => {

    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    const logo = await getBase64FromUrl("/public/logo2.png");

    doc.addImage(
        logo,
        "PNG",
        15,
        10,
        42,
        12
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);

    doc.text(
        "Patient Demographic Report",
        15,
        32
    );

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    if (from && to) {
        doc.text(`From : ${from}`, 15, 42);
        doc.text(`To : ${to}`, 15, 48);
    } else {
        doc.text(`Filter : ${filter}`, 15, 42);
    }

    doc.text(
        `Generated : ${new Date().toLocaleString()}`,
        15,
        from && to ? 55 : 48
    );

    let currentY = from && to ? 63 : 56;

    // ============================================
    // EXECUTIVE SUMMARY
    // ============================================

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(
        "Executive Summary",
        15,
        currentY
    );

    currentY += 4;
    autoTable(doc, {
        startY: currentY,
        head: [[
            "Metric",
            "Value"
        ]],
        body: [
            ["Total Patients", report.summary.totalPatients],
            ["Male Patients", report.summary.malePatients],
            ["Female Patients", report.summary.femalePatients],
            ["Average Age", `${report.summary.averageAge} Years`],
            ["New Patients", report.summary.newPatients],
            ["Returning Patients", report.summary.returningPatients],
            ["One-Time Patients", report.summary.oneTimePatients],
            ["Average Visits", report.summary.averageVisits]
        ],

        theme: "grid",
        headStyles: {
            fillColor: PRIMARY,
            textColor: 255,
            halign: "center",
            fontStyle: "bold"
        },
        styles: {
            fontSize: 10,
            cellPadding: 3,
            valign: "middle"
        },
        columnStyles: {
            0: {
                fontStyle: "bold",
                cellWidth: 90
            },
            1: {
                halign: "center"
            }
        }
    });
    currentY =
        (doc as any).lastAutoTable.finalY + 10;

    // ============================================
    // GENDER DISTRIBUTION
    // ============================================

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);

    doc.text(
        "Gender Distribution",
        15,
        currentY
    );
    currentY += 4;
    autoTable(doc, {
        startY: currentY,
        head: [[
            "Gender",
            "Patient Count",
            "Percentage"
        ]],
        body: report.genderDistribution.map((item) => [
            item.gender,
            item.count,
            `${item.percentage}%`
        ]),
        theme: "grid",
        headStyles: {
            fillColor: SUCCESS,
            textColor: 255,
            halign: "center",
            fontStyle: "bold"
        },
        styles: {
            fontSize: 10,
            cellPadding: 3,
            valign: "middle"
        },
        columnStyles: {
            0: {
                fontStyle: "bold",
                cellWidth: 70
            },
            1: {
                halign: "center"
            },
            2: {
                halign: "center"
            }
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245]
        }
    });
    currentY =
        (doc as any).lastAutoTable.finalY + 10;

    // ============================================
    // AGE DISTRIBUTION
    // ============================================

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);

    doc.text(
        "Age Distribution",
        15,
        currentY
    );

    currentY += 4;
    autoTable(doc, {
        startY: currentY,
        head: [[
            "Age Group",
            "Patient Count",
            "Percentage"
        ]],
        body: report.ageDistribution.map((item) => [
            item.ageGroup,
            item.count,
            `${item.percentage}%`
        ]),
        theme: "grid",
        headStyles: {
            fillColor: WARNING,
            textColor: 255,
            halign: "center",
            fontStyle: "bold"
        },
        styles: {
            fontSize: 10,
            cellPadding: 3,
            valign: "middle"
        },
        columnStyles: {
            0: {
                fontStyle: "bold",
                cellWidth: 70
            },
            1: {
                halign: "center"
            },
            2: {

                halign: "center"
            }
        },
        alternateRowStyles: {
            fillColor: [248, 250, 252]
        }
    });
    currentY =
        (doc as any).lastAutoTable.finalY + 10;

    // ============================================
    // TOP FREQUENT PATIENTS
    // ============================================

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(
        "Top Frequent Patients",
        15,
        currentY
    );
    currentY += 4;
    autoTable(doc, {
        startY: currentY,
        head: [[
            "Rank",
            "Patient Name",
            "Visits"
        ]],
        body: report.topPatients.map((patient, index) => [
            index + 1,
            patient.name,
            patient.visits
        ]),

        theme: "grid",
        headStyles: {
            fillColor: PURPLE,
            textColor: 255,
            halign: "center",
            fontStyle: "bold"
        },
        styles: {
            fontSize: 10,
            cellPadding: 3,
            valign: "middle"
        },
        columnStyles: {
            0: {
                halign: "center",
                cellWidth: 20,
                fontStyle: "bold"
            },
            1: {
               cellWidth: 110
            },
            2: {
                halign: "center",
                cellWidth: 35,
                fontStyle: "bold"
            }
        },

        alternateRowStyles: {
            fillColor: [248, 250, 252]
        },
        didParseCell: (data) => {
            if (
                data.section === "body" &&
                data.column.index === 0
            ) {
                if (data.row.index === 0) {
                    data.cell.styles.fillColor = [255, 243, 205];
                } else if (data.row.index === 1) {
                    data.cell.styles.fillColor = [230, 230, 230];
                } else if (data.row.index === 2) {
                    data.cell.styles.fillColor = [255, 229, 180];
                }
            }
        }
    });
    currentY =
        (doc as any).lastAutoTable.finalY + 10;

    // ============================================
    // PATIENT DIRECTORY
    // ============================================

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(
        "Patient Directory",
        15,
        currentY
    );
    currentY += 4;
    autoTable(doc, {
        startY: currentY,
        head: [[
            "No",
            "Patient Name",
            "Age",
            "Birth Date",
            "Mobile",
            "Address"
        ]],
        body: report.PatientsDetals.map((patient, index) => [
            index + 1,
            patient.name,
            calculateAge(patient.birthDay),
            formatDate(patient.birthDay),
            patient.mobileNumber,
            patient.address
        ]),

        theme: "striped",
        headStyles: {
            fillColor: PRIMARY,
            textColor: 255,
            halign: "center",
            fontStyle: "bold"
        },
        styles: {
            fontSize: 8,
            cellPadding: 2.5,
            overflow: "linebreak",
            valign: "middle"
        },
        alternateRowStyles: {
            fillColor: [248, 250, 252]
        },
        columnStyles: {
            0: {
                cellWidth: 12,
                halign: "center"
            },
            1: {
                cellWidth: 48
            },
            2: {
                cellWidth: 15,
                halign: "center"
            },
            3: {
                cellWidth: 28,
                halign: "center"
            },
            4: {
                cellWidth: 32,
                halign: "center"
            },
            5: {
                cellWidth: 55
            }
        },

        didDrawPage: () => {
            doc.setFontSize(9);
            doc.setTextColor(120);
            doc.text(
                "Odora Dental Management System",
                15,
                292
            );
        }
    });
    currentY =
        (doc as any).lastAutoTable.finalY + 10;

    // ============================================
    // FOOTER & PAGE NUMBERING
    // ============================================

    const totalPages = doc.getNumberOfPages();
    for (let page = 1; page <= totalPages; page++) {
        doc.setPage(page);

        // Footer separator line
        doc.setDrawColor(220);
        doc.setLineWidth(0.2);
        doc.line(15, 287, 195, 287);

        // Left Footer
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(120);

        doc.text(
            "Odora Dental Management System",
            15,
            292
        );

        // Center Footer
        doc.text(
            "Patient Demographic Report • Confidential",
            105,
            292,
            {
                align: "center"
            }
        );

        // Right Footer
        doc.text(
            `Page ${page} of ${totalPages}`,
            195,
            292,
            {
                align: "right"
            }
        );

    }

    // ============================================
    // SAVE PDF
    // ============================================
    const fileName =
        from && to
            ? `Patient_Demographic_Report_${from}_to_${to}.pdf`
            : `Patient_Demographic_Report_${filter}.pdf`;
    doc.save(fileName);
};
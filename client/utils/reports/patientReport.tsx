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

export const exportPatientReport = async (
  data: any[],
  filter: string,
  from?: string,
  to?: string
) => {

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  // =========================
  // LOGO
  // =========================

  const logo = await getBase64FromUrl("/public/logo2.png");

  doc.addImage(
    logo,
    "PNG",
    14,
    10,
    45,
    12
  );

  // =========================
  // TITLE
  // =========================

  doc.setFontSize(20);

  doc.text(
    "Patient Report",
    14,
    35
  );

  // =========================
  // FILTER INFO
  // =========================

  doc.setFontSize(11);


  if (from && to) {
  } else {
    doc.text(
      `Filter : ${filter}`,
      14,
      45
    );
  }


  if (from && to) {

    doc.text(
      `From : ${from}`,
      14,
      52
    );

    doc.text(
      `To : ${to}`,
      14,
      59
    );
  }

  doc.text(
    `Generated : ${new Date().toLocaleString()}`,
    14,
    from && to ? 67 : 52
  );

  // =========================
  // TABLE
  // =========================

  autoTable(doc, {

    startY: from && to ? 75 : 60,

    head: [[
      "Id",
      "Name",
      "Address",
      "Contact",
      "Appointments",
      "Last visited"
    ]],

    body: data.map((item) => [
      item.patientId,
      item.fullName,
      item.address,
      item.contact,
      item.appointments,
      item.lastVisited
    ]),

    theme: "grid",

    styles: {
      fontSize: 10,
    },

    headStyles: {
      fillColor: [37, 99, 235],
    },

    didDrawPage: () => {

      const pageCount = doc.getNumberOfPages();

      doc.setFontSize(10);

      doc.text(
        `Page ${pageCount}`,
        180,
        287
      );
    }
  });

  // =========================
  // SAVE
  // =========================

  doc.save(
    `patient-report-${new Date().toLocaleDateString()}-${new Date().toLocaleTimeString()}.pdf`
  );
};
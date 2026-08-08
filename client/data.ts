import type { adminCardType, AdminchartData, AdminDoctor, AdminDoctorCard, AdminStaff, AdminstaffCard, AdminTableColumn, AdminUser, AdminUserCard, AppointmentDetailsType, AppointmentType, CardType, compoedChartType, docAdminJoin, docJoin, docPast, doctorAppointmentType, DoctorListType, DoctorPerChartData, DoctorRevChartData, editViewDoctor, editViewStaff, editViewUser, MyData, PatientType, Refund, revenueChartType, RevenueModelDoctor, SessionType, staffAppointmentType, StaffCardType, StaffPerChartData, StaffRevChartData } from "./types/types";


/* user data */
export const appointments: AppointmentType[] = [
  {
    clinic: "Shine Dental Care",
    doctor: "Dr. Anya Jhones",
    date: "2026 Thursday March 03",
    status: "Approved",
  },
  {
    clinic: "City Dental",
    doctor: "Dr. John Doe",
    date: "2026 Friday March 05",
    status: "Pending",
  },
  {
    clinic: "Smile Hub",
    doctor: "Dr. Sarah Lee",
    date: "2026 Saturday March 06",
    status: "Canceled",
  },
];

export const cardDetails: CardType[] = [
  { img: "./userDash/calendar.png", desc: "Upcomming Appoinments", subDesc: "2", color: "bg-blue-600" },
  { img: "./userDash/checked.png", desc: "Completed Treatments", subDesc: "0", color: "bg-green-600" },
  { img: "./userDash/coin.png", desc: "LKR.3500", subDesc: "Pending Bills", color: "bg-yellow-600" },
  { img: "./userDash/nextDay.png", desc: "Next Visit Date", subDesc: "2026-03-25", color: "bg-teal-600" }
];

/* staff data */

export const staffCardDetails: StaffCardType[] = [
  { img: "./userDash/calendar.png", desc: "Upcomming Appoinments", subDesc: "10", color: "bg-blue-600" },
  { img: "./userDash/checked.png", desc: "Completed Appoinments", subDesc: "5", color: "bg-green-600" },
  { img: "./userDash/coin.png", desc: "LKR.35,000", subDesc: "Pending Bills", color: "bg-yellow-600" },
  { img: "./userDash/payment-done.png", desc: "LKR.20,000", subDesc: "Completed Bills", color: "bg-teal-600" }
];

export const Staffappointments: staffAppointmentType[] = [
  {
    patient: "Jhon jones",
    doctor: "Dr. Anya Jhones",
    date: "2026 Thursday March 03",
    status: "Approved",
  },
  {
    patient: "Adrea Karapathi",
    doctor: "Dr. John Doe",
    date: "2026 Friday March 05",
    status: "Pending",
  },
  {
    patient: " Garry Steve",
    doctor: "Dr. Sarah Lee",
    date: "2026 Saturday March 06",
    status: "Canceled",
  },
];

export const PatientsDetails: PatientType[] = [
  {
    patient: "Jhon jones",
    address: "Colombo",
    date: "2026 Thursday March 03",
    total: 10,
  },
  {
    patient: "Adrea Karapathi",
    address: "Kegalle",
    date: "2026 Friday March 05",
    total: 1,
  },
  {
    patient: " Garry Steve",
    address: "Jaffna",
    date: "2026 Saturday March 06",
    total: 4,
  },
];

export const AppointmentDetails: AppointmentDetailsType[] = [
  {
    doctor: "Dr. John Doe",
    date: "2026 Saturday March 06",
    treatment: ["Scaling", "Polishing"],
    amount: 10000,
  },
  {
    doctor: "Dr. John Doe",
    date: "2026 Friday March 05",
    treatment: ["RCT", "Composite", "Root planing"],
    amount: 5800,
  },
  {
    doctor: "Dr. Anya Jhones",
    date: "2026 Friday March 05",
    treatment: ["Implant"],
    amount: 1150,
  },
];

/* chartdata */
export const data: MyData[] = [
  { month: 'JAN', patients: 100 },
  { month: 'FEB', patients: 30 },
  { month: 'MAR', patients: 20 },
  { month: 'APR', patients: 27 },
  { month: 'MAY', patients: 18 },
  { month: 'JUN', patients: 23 },
  { month: 'JUL', patients: 34 },
  { month: 'AUG', patients: 80 },
  { month: 'SEP', patients: 34 },
  { month: 'OCT', patients: 90 },
  { month: 'NOV', patients: 34 },
  { month: 'DEC', patients: 75 },
];

/* chartdata admin */
export const adminData: AdminchartData[] = [
  { month: 'JAN', revenue: 100000 },
  { month: 'FEB', revenue: 53000 },
  { month: 'MAR', revenue: 75000 },
  { month: 'APR', revenue: 0 },
  { month: 'MAY', revenue: 0 },
  { month: 'JUN', revenue: 0 },
  { month: 'JUL', revenue: 0 },
  { month: 'AUG', revenue: 0 },
  { month: 'SEP', revenue: 0 },
  { month: 'OCT', revenue: 0 },
  { month: 'NOV', revenue: 0 },
  { month: 'DEC', revenue: 0 },
];

/* Chart data doctor performance  */
export const doctorPerData: DoctorPerChartData[] = [
  { month: 'JAN', patients: 100 },
  { month: 'FEB', patients: 45 },
  { month: 'MAR', patients: 30 },
  { month: 'APR', patients: 50 },
  { month: 'MAY', patients: 25 },
  { month: 'JUN', patients: 75 },
  { month: 'JUL', patients: 0 },
  { month: 'AUG', patients: 0 },
  { month: 'SEP', patients: 0 },
  { month: 'OCT', patients: 0 },
  { month: 'NOV', patients: 0 },
  { month: 'DEC', patients: 0 },
];

export const revData: DoctorRevChartData[] = [
  { month: 'JAN', revenue: 100000 },
  { month: 'FEB', revenue: 53000 },
  { month: 'MAR', revenue: 75000 },
  { month: 'APR', revenue: 0 },
  { month: 'MAY', revenue: 0 },
  { month: 'JUN', revenue: 0 },
  { month: 'JUL', revenue: 0 },
  { month: 'AUG', revenue: 0 },
  { month: 'SEP', revenue: 0 },
  { month: 'OCT', revenue: 0 },
  { month: 'NOV', revenue: 0 },
  { month: 'DEC', revenue: 0 },
];

/* doctor */
export const DoctorAppointments: doctorAppointmentType[] = [
  {
    patient: "Jhon jones",
    bday: "1998/11/23",
    date: "2026 Thursday March 03",
    status: "Ongoing",
  },
  {
    patient: "Adrea Karapathi",
    bday: "2005/05/12",
    date: "2026 Friday March 05",
    status: "Upcomming",
  },
  {
    patient: " Garry Steve",
    bday: "1985/01/02",
    date: "2026 Saturday March 06",
    status: "Completed",
  },
];


/* admin */

export const adminCardDetails: adminCardType[] = [
  { img: "./userDash/calendar.png", desc: "Upcomming Appoinments", subDesc: "100", color: "bg-blue-600" },
  { img: "./userDash/checked.png", desc: "Completed Appoinments", subDesc: "580+", color: "bg-green-600" },
  { img: "./userDash/money-back.png", desc: "Refunded Appoinments", subDesc: "1", color: "bg-red-600" },
  { img: "./userDash/coin.png", desc: "LKR.35,000", subDesc: "Pending Bills", color: "bg-orange-500" },
  { img: "./userDash/payment-done.png", desc: "LKR.200,000", subDesc: "Completed Bills", color: "bg-teal-500" },
  { img: "./userDash/medical-team.png", desc: "15+", subDesc: "Registed Doctors", color: "bg-lime-600" },
  { img: "./userDash/growth.png", desc: "LKR.10,000,000", subDesc: "Last moth revenue", color: "bg-sky-600" },
  { img: "./userDash/group.png", desc: "10000+", subDesc: "Registed Users", color: "bg-rose-600" },
];



/* start of test data for prototype table component */


export const adminUsersTable = {
  columns: [
    { key: "name", label: "Name" },
    { key: "date", label: "BirthDay" },
    { key: "tpnum", label: "Mobile" },
    { key: "address", label: "Address" },
  ],
  data: [
    {
      name: "Jone Moriwaki",
      date: "1997/02/28",
      tpnum: "0758945781",
      address: "Kegalle",
    },
    {
      name: "Satoshi Nakamoto",
      date: "1945/02/28",
      tpnum: "0758945781",
      address: "Colombo",
    },
    {
      name: "Abby Carter",
      date: "1956/02/28",
      tpnum: "0758945781",
      address: "Kandy",
    },
  ],
};

export const columns: AdminTableColumn<AdminUser>[] = [
  { key: "name", label: "Name" },
  { key: "birthDay", label: "BirthDay" },
  { key: "mobileNumber", label: "Mobile" },
  { key: "address", label: "Address" },
];
/* end of test data for prototype table component */

/* start of test data for prototype user edit view component */
export const userEditViewColumns: AdminTableColumn<editViewUser>[] = [
  { key: "doctor", label: "Dcotor" },
  { key: "date", label: "appointment Date" },
  { key: "treatments", label: "Treatments" },
  { key: "amount", label: "Paid Amount" },
];
export const adminEditViewUserTitle = "All Appointments";

export const adminUserEditViewTable: editViewUser[] = [
  {
    doctor: "Dr . Jone Moriwaki",
    date: "2026 Friday March 05",
    treatments: ["RCT", "Composite", "Root planing"],
    amount: 5800,
  },
  {
    doctor: "Dr . Jone Moriwaki",
    date: "2026 Friday March 05",
    treatments: ["RCT", "Composite", "Root planing"],
    amount: 5800,
  },
  {
    doctor: "Dr . Jone Moriwaki",
    date: "2026 Friday March 05",
    treatments: ["RCT ,", "Composite ,", "Root planing"],
    amount: 5800,
  },

];
/* end of test data for prototype user edit view component */

/* start of test data for prototype user card component */
export const userCardLabel = [
  { key: "name", label: "Name :" },
  { key: "email", label: "Email :" },
  { key: "bday", label: "Birth day :" },
  { key: "tpnum", label: "Mobile number :" },
] as const;

export const userCardTitle = "Patient Details";

export const userCard: AdminUserCard = {
  name: "Michel Garcia",
  email: "Ichel@gmail.com",
  bday: "1995/02/01",
  tpnum: "0777859647",
};
/* end of test data for prototype user card component */

/* start of test data for prototype user update component */
export const userUpdateLabel = [
  { key: "First name", label: "First name :" },
  { key: "Last name", label: "Last name :" },
  { key: "Email", label: "Email" },
  { key: "Mobile number", label: "Mobile number :" },
  { key: "Address", label: "Address :" },
  { key: "Passowrd", label: "Passowrd :" },
];

/* end of test data for prototype user update component */

/* *********************DOCTOR******************************************************************* */

/* start of test data for prototype doctor table component */


export const adminDoctorTable = {
  columns: [
    { key: "name", label: "Dcotor" },
    { key: "slmc", label: "SLMC" },
    { key: "tpnum", label: "Mobile" },
    { key: "address", label: "Address" },
  ],
  data: [
    {
      name: "Dr.Jone Moriwaki",
      slmc: "2156",
      tpnum: "0758945781",
      address: "Kegalle",
    },
    {
      name: "Dr.Satoshi Nakamoto",
      slmc: "2856",
      tpnum: "0758945781",
      address: "Colombo",
    },
    {
      name: "Dr.Abby Carter",
      slmc: "2176",
      tpnum: "0758945781",
      address: "Kandy",
    },
  ],
};

export const DoctorColumns: AdminTableColumn<AdminDoctor>[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "tpnum", label: "Mobile" },
  { key: "address", label: "Address" },
];
/* end of test data for prototype table component */

export const RefundColumns: AdminTableColumn<Refund>[] = [
  { key: "name", label: "Patient " },
  { key: "doctor", label: "Doctor " },
  { key: "contact", label: "Mobile Number " },
  { key: "reason", label: "Reason" },
  { key: "amount", label: "Amount" },

];

/* start of test data for prototype user edit view component */
export const DoctorEditViewColumns: AdminTableColumn<editViewDoctor>[] = [
  { key: "appNumber", label: "Appointment Number" },
  { key: "patient", label: "Patient" },
  { key: "date", label: "Appointment Date" },
  { key: "treatments", label: "Treatments" },
  { key: "amount", label: "Paid Amount" },
];
export const adminEditViewDoctorTitle = "All Appointments";

export const adminDoctorEditViewTable: editViewDoctor[] = [
  {
    appNumber: 1235,
    patient: "Jone Moriwaki",
    date: "2026 Friday March 05",
    treatments: ["RCT", "Composite", "Root planing"],
    amount: 14800,
  },
  {
    appNumber: 1236,
    patient: "Jone Moriwaki",
    date: "2026 Friday March 05",
    treatments: ["RCT", "Composite", "Root planing"],
    amount: 7000,
  },
  {
    appNumber: 1237,
    patient: "Jone Moriwaki",
    date: "2026 Friday March 05",
    treatments: ["RCT", "Composite", "Root planing"],
    amount: 6600,
  },
  {
    appNumber: 1235,
    patient: "Jone Moriwaki",
    date: "2026 Friday March 05",
    treatments: ["RCT", "Composite", "Root planing"],
    amount: 14800,
  },
  {
    appNumber: 1236,
    patient: "Jone Moriwaki",
    date: "2026 Friday March 05",
    treatments: ["RCT", "Composite", "Root planing"],
    amount: 7000,
  },
  {
    appNumber: 1237,
    patient: "Jone Moriwaki",
    date: "2026 Friday March 05",
    treatments: ["RCT", "Composite", "Root planing"],
    amount: 6600,
  },

];
/* end of test data for prototype user edit view component */

/* start of test data for prototype user card component */
export const doctorCardLabel = [
  { key: "name", label: "Name :" },
  { key: "email", label: "Email :" },
  { key: "slmc", label: "SLMC :" },
  { key: "tpnum", label: "Mobile number :" },
] as const;

export const doctorCardTitle = "Doctor Details";

export const doctorCard: AdminDoctorCard = {
  name: "Dr.Michel Garcia",
  email: "Ichel@gmail.com",
  slmc: "2154",
  tpnum: "0777859647",
};
/* end of test data for prototype user card component */

/* start of test data for prototype user update component */
export const doctorUpdateLabel = [
  { key: "First name", label: "First name :" },
  { key: "Last name", label: "Last name :" },
  { key: "Email", label: "Email" },
  { key: "Mobile number", label: "Mobile number :" },
  { key: "SLMC", label: "SLMC :" },
  { key: "University", label: "University :" },
  { key: "Address", label: "Address :" },
  { key: "Passowrd", label: "Passowrd :" },
];

/* end of test data for prototype user update component */

/* ***************STAFF*********************************************************** */

/* start of test data for prototype Staff table component */


export const adminStaffTable = {
  columns: [
    { key: "account", label: "Account Name" },
    { key: "clinic", label: "Clinic" },
    { key: "transactions", label: "Today Transactions" },
  ],
  data: [
    {
      account: "Sakuki Reception",
      clinic: "Sakuki Dental Hospital",
      transactions: "50000",
    },
    {
      account: "Shine Reception",
      clinic: "Shine Dental Hospital",
      transactions: "35600",
    },
  ],
};

export const StaffColumns: AdminTableColumn<AdminStaff>[] = [
  { key: "account", label: "Account Name" },
  { key: "clinic", label: "Clinic" },
  { key: "transactions", label: "Today Transactions" },
];
/* end of test data for prototype table component */

/* start of test data for prototype staff edit view component */
export const StaffEditViewColumns: AdminTableColumn<editViewStaff>[] = [
  { key: "appNumber", label: "Appointment Number" },
  { key: "doctor", label: "Doctor" },
  { key: "patient", label: "Patient" },
  { key: "date", label: "Appointment Date" },
  { key: "treatments", label: "Treatments" },
  { key: "amount", label: "Paid Amount" },
];
export const adminEditViewStaffTitle = "All Appointments";

export const adminStaffEditViewTable: editViewStaff[] = [
  {
    appNumber: 1235,
    doctor: "Dr. Steffany widow",
    patient: "Jone Moriwaki",
    date: "2026 Friday March 05",
    treatments: ["RCT", "Composite", "Root planing"],
    amount: 14800,
  },
  {
    appNumber: 1235,
    doctor: "Dr. Jhon williams",
    patient: "Abby carter",
    date: "2026 Friday april 10",
    treatments: ["RCT", "Root planing"],
    amount: 1260,
  },
  {
    appNumber: 1235,
    doctor: "Dr. Steffany widow",
    patient: "Jone Moriwaki",
    date: "2026 monday january 01",
    treatments: ["RCT", "Composite", "Root planing"],
    amount: 45860,
  },

];
/* end of test data for prototype staff edit view component */

/* start of test data for prototype user card component */
export const staffCardLabel = [
  { key: "name", label: "Name :" },
  { key: "clinic", label: "Clinic :" },
  { key: "tpnum", label: "Mobile Number :" },
  { key: "createdAt", label: "Registered at :" },
] as const;

export const staffCardTitle = "Staff Details";

export const staffCard: AdminstaffCard = {
  name: "Reception",
  clinic: "Shine Dental Care",
  tpnum: "0777859647",
  createdAt: "2026 monday january 02",
};
/* end of test data for prototype user card component */
/* start of test data for prototype user update component */
export const StaffUpdateLabel = [
  { key: "First name", label: "First name :" },
  { key: "Last name", label: "Last name :" },
  { key: "Email", label: "Email" },
  { key: "Mobile number", label: "Mobile number :" },
  { key: "clinic", label: "Clinic :" },
  { key: "Address", label: "Address :" },
  { key: "Passowrd", label: "Passowrd :" },
];

/* end of test data for prototype user update component */

/* Chart data staff performance  */
export const staffPerData: StaffPerChartData[] = [
  { month: 'JAN', revenue: 100025 },
  { month: 'FEB', revenue: 45666 },
  { month: 'MAR', revenue: 305163 },
  { month: 'APR', revenue: 50545 },
  { month: 'MAY', revenue: 25023 },
  { month: 'JUN', revenue: 76545 },
  { month: 'JUL', revenue: 0 },
  { month: 'AUG', revenue: 0 },
  { month: 'SEP', revenue: 0 },
  { month: 'OCT', revenue: 0 },
  { month: 'NOV', revenue: 0 },
  { month: 'DEC', revenue: 0 },
];

export const StaffRevData: StaffRevChartData[] = [
  { day: 'MON', revenue: 10000 },
  { day: 'TUE', revenue: 53000 },
  { day: 'WED', revenue: 75000 },
  { day: 'THU', revenue: 0 },
  { day: 'FRI', revenue: 0 },
  { day: 'SAT', revenue: 0 },
  { day: 'SUN', revenue: 0 },

];

/* end admin staff management  */

/* start admn report module data */

export const reportCardDetails: StaffCardType[] = [
  { img: "./userDash/patient (2).png", desc: "Total Patients", subDesc: "10", color: "bg-blue-600" },
  { img: "./userDash/doctor (2).png", desc: "Total Doctors", subDesc: "5", color: "bg-green-600" },
  { img: "./userDash/appointment (1).png", desc: "Total Appointments", subDesc: "105", color: "bg-orange-600" },
  { img: "./userDash/coin.png", desc: "Total Revenue", subDesc: "LKR.20,000", color: "bg-sky-600" }
];

export const composeChartData: compoedChartType[] = [
  { month: "JAN", date: "2026-03-30", approved: "20", total: "10", completed: "15", canceled: "2" },
  { month: "FEB", date: "2026-01-15", approved: "45", total: "78", completed: "10", canceled: "5" },
  { month: "MAR", date: "2026-01-15", approved: "30", total: "50", completed: "25", canceled: "2" },
  { month: "APR", date: "2026-03-28", approved: "70", total: "40", completed: "35", canceled: "2" },
  { month: "MAY", date: "2026-04-01", approved: "28", total: "12", completed: "17", canceled: "2" },
  { month: "JUN", date: "2026-04-01", approved: "28", total: "80", completed: "17", canceled: "4" },
  { month: "JUL", date: "2026-03-30", approved: "28", total: "50", completed: "17", canceled: "2" },
  { month: "AUG", date: "2026-03-29", approved: "28", total: "74", completed: "17", canceled: "2" },
  { month: "SEP", date: "2026-03-10", approved: "28", total: "25", completed: "17", canceled: "1" },
  { month: "OCT", date: "2026-03-30", approved: "28", total: "45", completed: "17", canceled: "0" },
  { month: "NOV", date: "2026-03-31", approved: "28", total: "36", completed: "17", canceled: "0" },
  { month: "DEC", date: "2026-03-31", approved: "28", total: "22", completed: "17", canceled: "0" },
];

export const revenueChartData: revenueChartType[] = [
  { month: "JAN", date: "2026-01-30", revenue: "100000" },
  { month: "FEB", date: "2026-02-15", revenue: "50000" },
  { month: "MAR", date: "2026-03-31", revenue: "23000" },
  { month: "APR", date: "2026-04-15", revenue: "98000" },
  { month: "MAY", date: "2026-03-29", revenue: "100000" },
  { month: "JUN", date: "2026-03-29", revenue: "23000" },
  { month: "JUL", date: "2026-03-29", revenue: "0" },
  { month: "AUG", date: "2026-03-29", revenue: "0" },
  { month: "SEP", date: "2026-03-31", revenue: "0" },
  { month: "OCT", date: "2026-03-31", revenue: "0" },
  { month: "NOV", date: "2026-03-31", revenue: "0" },
  { month: "DEC", date: "2026-03-31", revenue: "1000" },
];

/* doctor table data in report model */
export const DoctorRevenueColumns: AdminTableColumn<RevenueModelDoctor>[] = [
  { key: "name", label: "Name" },
  { key: "slmc", label: "SLMC" },
  { key: "totalApp", label: "Total Appointments" },
  { key: "revenue", label: "Generated Revenue(total)" },
];

export const DoctorRevenueTable = [
  {
    name: "Dr.Jone Moriwaki",
    slmc: "2156",
    date: "2026/03/26",
    patients: "10",
    revenue: "Rs:35000.00",
  },
  {
    name: "Dr.Satoshi Nakamoto",
    slmc: "2856",
    date: "2026/02/20",
    patients: "50",
    revenue: "Rs:120000.00",
  },
  {
    name: "Dr.Abby Carter",
    slmc: "2176",
    date: "2026/03/26",
    patients: "21",
    revenue: "Rs:46000.00",
  },
];

/* end admn report module data */

/* start of the front end session table data */
export const SessionColumns: AdminTableColumn<SessionType>[] = [
  { key: "clinic", label: "Clinic Name" },
  { key: "date", label: "Date" },
  { key: "stime", label: "Start Time" },
  { key: "etime", label: "End Time" },
];

export const DoctorListColumns: AdminTableColumn<DoctorListType>[] = [
  { key: "clinic", label: "Clinic Name" },
  { key: "doctor", label: "Doctor" },
];

export const sessionTable = [
  {
    clinic: "Sakuki Dental Hospital",
    date: "2026/03/26",
    stime: "02/00 PM",
    etime: "05.00PM",
  },
  {
    clinic: "Shine Dental Hospital",
    date: "2026/03/26",
    stime: "02/00 PM",
    etime: "05.00PM",
  },
];

/* table heading for past appointment doctor */
export const PastappointmentColumns: AdminTableColumn<docPast>[] = [
  { key: "doctor", label: "Doctor" },
  { key: "appointmentDate", label: "Date" },
  { key: "treatments", label: "Treatments" },
  { key: "note", label: "Note" },
];


/* table heading for join request doctor */
export const JoinColumns: AdminTableColumn<docJoin>[] = [
  { key: "name", label: "Clinic Name" },
  { key: "address", label: "Address" },
  { key: "contact", label: "Contact" },
  { key: "registered", label: "Registered Doctors" },
];

/* table heading for join request admin */
export const JoinAdminColumns: AdminTableColumn<docAdminJoin>[] = [
  { key: "name", label: "Doctor Name" },
  { key: "email", label: "Email " },
  { key: "contact", label: "Contact" },

];
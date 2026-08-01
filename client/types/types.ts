

/* user types */
export type CardType = {
  img: string;
  desc: string;
  subDesc: string;
  color: string;
};

export type StatusType = "approved" | "pending" | "canceled" | "completed" | "paid";

export type AppointmentType = {
  clinic: string;
  doctor: string;
  date: string;
  status: StatusType;
};

/* staff types */

export type StaffCardType = {
  img: string;
  desc: string;
  subDesc: string;
  color: string;
};

export type staffAppointmentType = {
  patient: string;
  doctor: string;
  date: string;
  status: StatusType;
};

export type PatientType = {
  patient: string;
  address: string;
  date: string;
  total: number;
};

export type AppointmentDetailsType = {
  doctor: string;
  date: string;
  treatment: string[];
  amount: number;
};


/* chart */

export type MyData = {
  month: string;
  patients: number;
};

export type AdminchartData = {
  month: string;
  revenue: number;
};

export type DoctorPerChartData = {
  month: string;
  patients: number;
};

export type StaffPerChartData = {
  month: string;
  revenue: number;
};

export type DoctorRevChartData = {
  month: string;
  revenue: number;
};

export type StaffRevChartData = {
  day: string;
  revenue: number;
};


export type ChartConfig = {
  xKey: string;
  areas: {
    key: string;
    color: string;
  }[];
};

export type Props = {
  data: any[];
  config: ChartConfig;
};

export type TableColumn = {
  key: string;
  label: string;
}

/* start of admin table types */

export type AdminTableColumn<T> = {
  key: keyof T;
  label: string;
  render?: (value: any, row: T, index: number) => React.ReactNode;
};
export type AdminTableProps<T> = {
  columns: AdminTableColumn<T>[];
  data: T[];
  title: any;
  actions?: (row: T, index: number) => React.ReactNode;
};
/* end of admin table types */

/* start of admin table types */

/* export type AdminEditViewTableColumn<T> = {
    key: keyof T;
    label: string;
    render?: (value: any, row: T, index: number) => React.ReactNode;
};
export type AdminEditViewTableProps<T> = {
    columns: AdminTableColumn<T>[];
    data: T[];
    actions?: (row: T, index: number) => React.ReactNode;
}; */
/* end of admin table types */


/* doctor */

export type doctorAppointmentType = {
  patient: string;
  bday: string;
  date: string;
  status: doctorStatusType;
};
export type doctorStatusType = "ongoing" | "approved" | "completed" | "upcomming";

/* admin */

export type adminCardType = {
  img: string;
  desc: string;
  subDesc: string;
  color: string;
};

export type adminUsersTableType = {
  name: string;
  date: string;
  tpnum: string;
  address: string;
};

export type AdminUser = {
  _id?: string;
  name: string;
  birthDay: string;
  mobileNumber: string;
  address: string;
};

export type AdminDoctor = {
  _id?: string;
  name: string;
  email: string;
  tpnum: string;
  address: string;
};

export type AdminStaff = {
  account: string;
  clinic: string;
  transactions: string;

};

export type RevenueModelDoctor = {
  name: string;
  slmc: string;
  totalApp: string;
  revenue: string;
};

/* test types for user, doctor ,staff edit view component and page */

export type editViewUser = {
  doctor: string;
  date: string;
  treatments: string[];
  amount: number;
};

export type editViewUserProps = {
  dataColumns: any;
  tableData: any;
  tableTitle: string;
  title: any;
  label: any;
  data: any;
  staff?:boolean;
  updateLabel: any;
  isUser: boolean;
  userId ?: any;
  onRefresh ?: any;
};

export type AdminUserCardProps<T> = {
  title: any;
  label: readonly { key: keyof T; label: string }[];
  data: T;
  type?: string;
  img: string;
  staff?:boolean;
  userId?: string;
  onRefresh ?: any;
  updateLabel: readonly { key: keyof T; label: string; placeholder: any }[];
};

export type AdminUserCard = {
  name: string;
  email: string;
  bday: string;
  tpnum: string;
};

export type AdminDoctorCard = {
  name: string;
  email: string;
  slmc: string;
  tpnum: string;
};

export type editViewDoctor = {
  appNumber: number;
  patient: string;
  date: string;
  treatments: string[];
  amount: number;
};

export type editViewStaff = {
  appNumber: number;
  doctor: string;
  patient: string;
  date: string;
  treatments: string[];
  amount: number;
};

export type AdminstaffCard = {
  name: string;
  clinic: string;
  createdAt: string;
  tpnum: string;
  img:string;
};

/* admin omposed chart data types */

export type ChartDataType = {
  month: string;
  total: number;
  approved: number;
  completed: number;
  canceled: number;
  paid: number;
};
export type FilterType = "Today" | "Weekly" | "Monthly" | "Yearly";

export type revenueChartType = {
  month: string;
  revenue: string;
  date: String;
}

/* start frontend session data table */
export type SessionType = {
  clinic: string;
  date: string;
  stime: string;
  etime: string;
};

export type DoctorListType = {
  _id: any;
  clinic: string;
  doctor: string;
};
/* end frontend session data table */

export type PatientDetailsProps = {
  data: any;
};

export type AppointmentProps = {
  data: any[];
  refreshAppointments?: () => void;
};

export type UserFormData = {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  birthDay: string;
  gender: string;
  address: string;
  password: string;
  role: "user";
};

export type UpdateLabelType = {
  key?: keyof UserFormData;
  label?: string;
  value?: string;
  placeholder?: string;
  type?: string;
  disabled?:boolean;
};

export type DoctorFormData = {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  birthDay: string;
  gender: string;
  address: string;
  password: string;
  role: "user";

  slmcReg: number;
  university: string;
  experience: number;
  consultationFee: number;
  specialization: [string];
  desc: string;
  degree: string;
};

export type DoctorUpdateLabelType = {
  key: keyof DoctorFormData;
  label: string;
  placeholder: string;
  type?: string;
};

export interface DashNavType {
  name: string;
  path: string;
  image: string;
}

export type docPast = {
  doctor:string;
  birthDay:number;
  appointmentDate:string;
  treatments:[string];
  note:string;
}

export type docJoin = {
  name:string;
  address:string;
  contact:string;
  registered:number;
}
export type docAdminJoin = {
  name:string;
  email:string;
  contact:string;
}
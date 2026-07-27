import type { doctorStatusType, StatusType } from "./types";

export const statusStyles: Record<StatusType, string> = {
  approved: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  canceled: "bg-red-100 text-red-700",
  completed: "bg-blue-100 text-blue-700",
  paid: "bg-emerald-100 text-emerald-700",
};
export const doctorConfig = {
  xKey: 'month',
  areas: [
    { key: 'patients', color: '#828fca' }
  ]
};

export const adminConfig = {
  xKey: 'month',
  areas: [
    { key: 'revenue', color: '#32a840' }
  ]
};

export const doctorPerConfig = {
  title: "Doctor Performance",
  xKey: 'month',
  areas: [
    { key: 'patients', color: '#35a830' }
  ]
};

export const doctorRevConfig = {
  title: "Generated Revenue",
  xKey: 'month',
  areas: [
    { key: 'revenue', color: '#eb7831' }
  ]
};

export const staffPerConfig = {
  title: "Monthly Revenue",
  xKey: 'month',
  areas: [
    { key: 'revenue', color: '#33b830' }
  ]
};

export const staffRevConfig = {
  title: "Last week Revenue",
  xKey: 'day',
  areas: [
    { key: 'revenue', color: '#eb2631' }
  ]
};


export const doctorStatusStyles: Record<doctorStatusType, string> = {
  approved: "bg-green-100 text-green-700",
  upcomming: "bg-yellow-100 text-yellow-700",
  completed: "bg-blue-100 text-blue-700",
  ongoing: "bg-emerald-100 text-emerald-700",
};
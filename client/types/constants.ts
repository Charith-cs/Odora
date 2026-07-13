import type { doctorStatusType, StatusType } from "./types";

export const statusStyles: Record<StatusType, string> = {
  approved: "text-green-600 ",
  pending: "text-yellow-600 ",
  canceled: "text-red-600 ",
  completed : "text-blue-600"
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
  title:"Doctor Performance",
  xKey: 'month',
  areas: [
    { key: 'patients', color: '#35a830' }
  ]
};

export const doctorRevConfig = {
  title:"Generated Revenue",
  xKey: 'month',
  areas: [
    { key: 'revenue', color: '#eb7831' }
  ]
};

export const staffPerConfig = {
  title:"Monthly Revenue",
  xKey: 'month',
  areas: [
    { key: 'revenue', color: '#33b830' }
  ]
};

export const staffRevConfig = {
  title:"Last week Revenue",
  xKey: 'day',
  areas: [
    { key: 'revenue', color: '#eb2631' }
  ]
};


export const doctorStatusStyles: Record<doctorStatusType, string> = {
  Completed: "text-green-600 ",
  Ongoing: "text-sky-600 ",
  Upcomming: "text-yellow-600 ",
};
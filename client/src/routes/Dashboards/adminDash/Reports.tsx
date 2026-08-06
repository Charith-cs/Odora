import { Link } from "react-router-dom"
import { DoctorRevenueColumns } from "../../../../data"
import ComposeChart from "../../../components/dashComponents/adminDash/ComposeChart"
import RevenueAreaChart from "../../../components/dashComponents/adminDash/RevenueAreaChart"
import Table from "../../../components/dashComponents/adminDash/Table"
import DashCard from "../../../components/dashComponents/userDash/DashCard"
import { useEffect, useState } from "react"
import type { FilterType } from "../../../../types/types"
import UserChart from "../../../components/dashComponents/adminDash/UserChart"
import { toast } from "react-hot-toast";
import API from "../../../../api/axios";
import { exportDoctorPerformanceReport } from "../../../../utils/reports/doctorPerformanceReport";
import { exportPatientReport } from "../../../../utils/reports/patientReport";
import { exportRevenueReport } from "../../../../utils/reports/revenueReport";
import { exportAppointmentReport } from "../../../../utils/reports/appointmentReport";
import { exportPatientDemographicReport } from "../../../../utils/reports/demographicReport";


const Reports = () => {

  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const [filter, setFilter] = useState<FilterType>('Monthly');
  const [filterReport, setFilterReport] = useState<FilterType>('Monthly');
  const [reports, setReports] = useState<any[]>([]);
  const [performance, setPerformance] = useState<any[]>([]);
  const [pieChart, setPieChart] = useState<any[]>([]);

  //report states
  const [selectedReport, setSelectedReport] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [clinic, setClinic] = useState<any>();

  useEffect(() => {
    const getClinic = async () => {
      try {
        const res = await API.get(`/dash/clinic/${currentUser._id}`);
        setClinic(res.data);
      } catch (err: any) {
        console.error(err);
      }
    }
    getClinic();
  }, [currentUser]);

  //report download 
  const handleDownload = async () => {

    try {

      if (!selectedReport) {
        return toast.error("Please select report type");
      }

      if (selectedReport === "doctor") {

        toast.loading("Generating report...", { id: "report" });

        const res = await API.get(
          `/dash/doctor_performance/${currentUser._id}`,
          {
            params: {
              filterReport,
              from: startDate,
              to: endDate
            }
          }
        );
        exportDoctorPerformanceReport(
          res.data,
          filterReport,
          startDate,
          endDate
        );
        toast.success("Doctor report downloaded", { id: "report" });

      } else if (selectedReport === "patient") {

        toast.loading("Generating report...", { id: "report" });
        const res = await API.get(
          `/dash/patient_report/${currentUser._id}`,
          {
            params: {
              filterReport,
              from: startDate,
              to: endDate
            }
          }
        );
        exportPatientReport(
          res.data,
          filterReport,
          startDate,
          endDate
        );
        toast.success("Patients report downloaded", { id: "report" });

      } else if (selectedReport === "revenue") {

        toast.loading("Generating report...", { id: "report" });
        const res = await API.get(
          `/dash/revenue_report/${currentUser._id}`,
          {
            params: {
              filterReport,
              from: startDate,
              to: endDate
            }
          }
        );
        exportRevenueReport(
          res.data,
          filterReport,
          startDate,
          endDate
        );
        toast.success("Revenue report downloaded", { id: "report" });
      } else if (selectedReport === "appointment") {

        toast.loading("Generating report...", { id: "report" });
        const res = await API.get(
          `/dash/appointment_report/${currentUser._id}`,
          {
            params: {
              filterReport,
              from: startDate,
              to: endDate
            }
          }
        );
        exportAppointmentReport(
          res.data,
          filterReport,
          startDate,
          endDate
        );
        toast.success("Appointment report downloaded", { id: "report" });
      } else if (selectedReport === "demographic") {

        toast.loading("Generating report...", { id: "report" });
        const res = await API.get(
          `/dash/demographic_report`,
          {
            params: {
              filterReport,
              from: startDate,
              to: endDate
            }
          }
        );
        exportPatientDemographicReport(
          res.data,
          filterReport,
          startDate,
          endDate
        );
        toast.success("Patient demographic report downloaded", { id: "report" });
      }

    } catch (err) {
      console.log(err);
      toast.error("Failed to generate report", { id: "report" });
    }
  };


  const fetchReportDashCard = async () => {
    try {
      const res = await API.get(`/dash/report_dash/${currentUser._id}`);
      setReports(res.data);
    } catch (err) {
      console.error("Oops! Something went wrong");
    }
  }

  const fetchDoctorPerformance = async () => {
    try {
      const res = await API.get(`/dash/doctor_performance/${currentUser._id}`, {
        params: {
          filter,
          from: startDate,
          to: endDate
        }
      }
      );
      setPerformance(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPieChart = async () => {
    try {
      const res = await API.get(`/dash/users/${currentUser._id}`);
      console.log(res.data)
      setPieChart(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchReportDashCard();
    fetchPieChart();
  }, [currentUser._id]);

  useEffect(() => {
    fetchDoctorPerformance();
  }, [filter, startDate, endDate]);

  const handleCancel = () => {
    setSelectedReport("");
    setStartDate("");
    setEndDate("");
  };

  const reportCardDetails = [
    { img: "./userDash/patient (2).png", desc: "Total Patients", subDesc: `${reports?.totalPatients ?? 0} +`, color: "bg-blue-600" },
    { img: "./userDash/doctor (2).png", desc: "Total Doctors", subDesc: `${reports?.totalDoctors ?? 0} +`, color: "bg-green-600" },
    { img: "./userDash/appointment (1).png", desc: "Total Appointments", subDesc: `${reports?.totalAppointments ?? 0} +`, color: "bg-orange-600" },
    { img: "./userDash/coin.png", desc: "Total Revenue", subDesc: `LKR : ${reports?.formattedRevenue ?? 0}.00`, color: "bg-sky-600" }
  ];

  const DoctorRevenueTable = performance.map((p: any) => ({
    name: `Dr. ${p?.doctorName}`,
    slmc: `${p?.slmc}`,
    totalApp: `${p?.totalAppointments}`,
    revenue: `LKR . ${p?.totalRevenue}.00`,
    _id: `${p?._id}`
  }))


  return (
    <div className=" space-y-8 pb-5">

      {/* Dashboard Cards */}
      <section className="flex flex-wrap justify-center gap-6">
        <DashCard cardDetails={reportCardDetails} />
      </section>

      <section className="space-y-6">

        <div className="grid grid-cols-1 gap-6 ">

          <div className="min-w-0 rounded-3xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl md:p-7">
            <ComposeChart />
          </div>

          <div className="min-w-0 rounded-3xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl md:p-7">
            <RevenueAreaChart />
          </div>

        </div>


        <div className="min-w-0 rounded-3xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl md:p-7">
          <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#2596be] md:text-3xl">Doctor Performance</h2>
              <p className="mt-1 text-sm text-gray-500">Review doctor appointments and generated revenue.</p>
            </div>

            <div className="flex w-fit flex-wrap items-center gap-1 rounded-2xl border border-gray-100 bg-gray-50 p-1.5">
              {["Today", "Weekly", "Monthly", "Yearly"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item as FilterType)}
                  className={`
              rounded-xl px-4 py-2
              text-sm font-medium
              transition-all duration-300
              ${filter === item
                      ? "bg-[#2596be] text-white shadow-md"
                      : "text-gray-500 hover:bg-white hover:text-[#2596be]"
                    }
            `}
                >
                  {item}
                </button>

              ))}
            </div>
          </div>


          <div className="w-full overflow-x-auto">
            <Table
              columns={DoctorRevenueColumns}
              data={DoctorRevenueTable}
              title={null}
              actions={(_row) => (
                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/view_edit_doctor/${_row?._id}`}
                    className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-all duration-300 hover:border-[#2596be] hover:text-[#2596be]"
                  >
                    View
                  </Link>
                </div>
              )}
            />
          </div>
        </div>


        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

          <div className="min-w-0 rounded-3xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl md:p-7">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#2596be] md:text-3xl">User Registration</h2>
              <p className="mt-1 text-sm text-gray-500">Overview of registered users and account distribution.</p>
            </div>

            <div className="h-[340px] w-full md:h-[400px]">
              <UserChart data={pieChart} />
            </div>
          </div>

          <div className="min-w-0 rounded-3xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl md:p-7">
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-[#2596be] md:text-3xl">Download Reports</h2>
              <p className="mt-1 text-sm text-gray-500">Generate detailed clinic reports for a selected period.</p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="start" className="text-sm font-semibold text-gray-700">Start Date</label>

                  <input
                    id="start"
                    name="start"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 transition-all duration-300 focus:border-[#2596be] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2596be]/10"
                  />

                </div>


                <div className="flex flex-col gap-2">
                  <label htmlFor="end" className="text-sm font-semibold text-gray-700">End Date</label>
                  <input
                    id="end"
                    name="end"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 transition-all duration-300 focus:border-[#2596be] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2596be]/10"
                  />
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-semibold text-gray-700">Report Period</p>
                <div className="flex w-fit max-w-full flex-wrap items-center gap-1 rounded-2xl border border-gray-100 bg-gray-50 p-1.5">
                  {["Today", "Weekly", "Monthly", "Yearly"].map((item) => (

                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        setFilterReport(item as FilterType)
                      }
                      className={`
                  rounded-xl px-4 py-2
                  text-sm font-medium
                  transition-all duration-300

                  ${filterReport === item
                          ? "bg-[#2596be] text-white shadow-md"
                          : "text-gray-500 hover:bg-white hover:text-[#2596be]"
                        }
                `}
                    >
                      {item}
                    </button>

                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">Report Type</label>
                <select value={selectedReport} onChange={(e) => setSelectedReport(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 transition-all duration-300 focus:border-[#2596be] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2596be]/10">

                  <option value=""> Select Report</option>
                  <option value="doctor">Doctor Performance Report</option>
                  <option value="patient">Patient Report</option>
                  <option value="revenue">Revenue Report</option>
                  <option value="appointment">Appointment Report</option>
                  <option value="demographic">Patient Demographics Report</option>

                </select>
              </div>

              <div className="flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row">
               
                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled = {!clinic}
                    className={`flex-1 rounded-2xl ${clinic ? "bg-[#21a262] text-white hover:bg-[#1c8d53]" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}  px-5 py-3 font-semibold shadow-md transition-all duration-300  hover:shadow-lg`}
                  >
                    Download Report
                  </button>
                

                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 rounded-2xl border border-red-200 bg-white px-5 py-3 font-semibold text-red-500 transition-all duration-300 hover:bg-red-50"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Reports
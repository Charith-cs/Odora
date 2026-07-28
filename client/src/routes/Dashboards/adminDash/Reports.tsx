import { Link } from "react-router-dom"
import { DoctorRevenueColumns, DoctorRevenueTable, reportCardDetails } from "../../../../data"
import ComposeChart from "../../../components/dashComponents/adminDash/ComposeChart"
import RevenueAreaChart from "../../../components/dashComponents/adminDash/RevenueAreaChart"
import Table from "../../../components/dashComponents/adminDash/Table"
import DashCard from "../../../components/dashComponents/userDash/DashCard"
import { useEffect, useState } from "react"
import type { AdminTableColumn, FilterType, RevenueModelDoctor, StaffCardType } from "../../../../types/types"
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
      toast.error("Oops! Something went wrong");
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
    { img: "./userDash/patient (2).png", desc: "Total Patients", subDesc: `${reports.totalPatients}+`, color: "bg-blue-600" },
    { img: "./userDash/doctor (2).png", desc: "Total Doctors", subDesc: `${reports.totalDoctors}+`, color: "bg-green-600" },
    { img: "./userDash/appointment (1).png", desc: "Total Appointments", subDesc: `${reports.totalAppointments}+`, color: "bg-orange-600" },
    { img: "./userDash/coin.png", desc: "Total Revenue", subDesc: `LKR : ${reports.totalRevenue || 0}.00`, color: "bg-sky-600" }
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

      {/* Dashboard Content */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Appointment Chart */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <ComposeChart />
        </div>

        {/* Revenue Chart */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <RevenueAreaChart />
        </div>

        {/* Doctor Performance */}
        <div className="lg:col-span-2 rounded-3xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <h2 className="text-2xl md:text-3xl font-bold text-[#2596be]">
              Doctor Performance
            </h2>

            <div className="flex flex-wrap gap-2">
              {["Today", "Weekly", "Monthly", "Yearly"].map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item as FilterType)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ${filter === item
                    ? "bg-[#2596be] text-white shadow-md"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-[#2596be] hover:text-[#2596be]"
                    }`}
                >
                  {item}
                </button>
              ))}
            </div>

          </div>

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

        {/* User Statistics */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

          <h2 className="mb-6 text-2xl md:text-3xl font-bold text-[#2596be]">
            User Registration and Others
          </h2>

          <div className="h-[320px] md:h-[380px]">
            <UserChart data={pieChart} />
          </div>

        </div>

        {/* Reports */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

          <h2 className="mb-6 text-2xl md:text-3xl font-bold text-[#2596be]">
            Download Reports
          </h2>

          <div className="space-y-6">

            {/* Date Pickers */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              <div className="flex flex-col gap-2">

                <label
                  htmlFor="start"
                  className="text-sm font-semibold text-gray-700"
                >
                  Start Date
                </label>

                <input
                  name="start"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 transition-all duration-300 focus:border-[#2596be] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2596be]/10"
                />

              </div>

              <div className="flex flex-col gap-2">

                <label
                  htmlFor="end"
                  className="text-sm font-semibold text-gray-700"
                >
                  End Date
                </label>

                <input
                  name="end"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 transition-all duration-300 focus:border-[#2596be] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2596be]/10"
                />

              </div>
            </div>

            {/* Report Filters */}
            <div className="flex flex-wrap gap-2">

              {["Today", "Weekly", "Monthly", "Yearly"].map((item) => (

                <button
                  key={item}
                  onClick={() => setFilterReport(item as FilterType)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ${filterReport === item
                    ? "bg-[#2596be] text-white shadow-md"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-[#2596be] hover:text-[#2596be]"
                    }`}
                >
                  {item}
                </button>

              ))}

            </div>

            {/* Report Selector */}
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 transition-all duration-300 focus:border-[#2596be] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2596be]/10"
            >
              <option value="">Select Report</option>

              <option value="doctor">
                Doctor Performance Report
              </option>

              <option value="patient">
                Patient Report
              </option>

              <option value="revenue">
                Revenue Report
              </option>

              <option value="appointment">
                Appointment Report
              </option>

              <option value="demographic">
                Patient Demographics Report
              </option>

            </select>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 pt-4 sm:flex-row ">

              <button
                onClick={handleDownload}
                className="flex-1 rounded-2xl bg-[#21a262] px-5 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1c8d53] hover:shadow-lg"
              >
                Download
              </button>

              <button
                onClick={handleCancel}
                className="flex-1 rounded-2xl bg-red-500 px-5 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-600 hover:shadow-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Reports
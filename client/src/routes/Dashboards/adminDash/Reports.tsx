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
      }else if (selectedReport === "appointment") {

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

      const res = await API.get(
        `/dash/doctor_performance/${currentUser._id}`,
        {
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
    <div className=" mt-6 grid grid-cols-1">
      <div className=" w-full h-full flex flex-row flex-wrap mt-5 justify-center">
        <DashCard cardDetails={reportCardDetails} />
      </div>
      <div className=" mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-5">

        <div className=" p-2 rounded-xl shadow-md hover:shadow-lg bg-gray-50">
          <ComposeChart />
        </div>

        <div className="p-2 rounded-xl shadow-md hover:shadow-lg bg-gray-50">
          <RevenueAreaChart />
        </div>

        <div className=" col-span-2 p-2 rounded-xl shadow-md hover:shadow-lg bg-gray-50">
          <div className=" flex justify-between items-center">
            <h1 className="text-2xl font-semibold my-5">
              Doctor Performance
            </h1>

          </div>
          <div className=" w-full ml-4">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex gap-2">
                {['Today', 'Weekly', 'Monthly', 'Yearly'].map((item) => (
                  <button
                    key={item}
                    onClick={() => setFilter(item as FilterType)}
                    className={`px-3 py-1 rounded-lg text-sm border transition ${filter === item
                      ? 'bg-blue-500 text-white shadow'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <Table
            columns={DoctorRevenueColumns}
            data={DoctorRevenueTable}
            title={null}
            actions={(_row) => (
              <div className="flex gap-2">
                <Link to={`/view_edit_doctor/${_row?._id}`} className="px-3 py-1 rounded-lg border text-gray-600 hover:text-sky-500 hover:border-sky-500 transition">View</Link>
                <button className="px-3 py-1 rounded-lg border text-gray-600 hover:text-red-500 hover:border-red-500 transition">Delete</button>
              </div>
            )} />
        </div>

        <div className=" p-2 rounded-xl shadow-md hover:shadow-lg bg-gray-50 ">
          <h1 className="text-2xl font-semibold my-5">User Registraton and Others</h1>
          <UserChart data={pieChart} />
        </div>

        <div className=" p-2 rounded-xl shadow-md hover:shadow-lg bg-gray-50">
          <h1 className="text-2xl font-semibold my-5">Download reports</h1>

          <div className=" mt-6 flex flex-col gap-8  ">
            <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 ml-5 ">
              <span className=" flex gap-5  items-center">
                <label htmlFor="start" className=" font-semibold">Start Date : </label>
                <input
                  name="start"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="p-1 rounded-xl shadow-md"
                />
              </span>
              <span className=" flex gap-5 items-center">
                <label htmlFor="end" className=" font-semibold">End Date : </label>
                <input
                  name="end"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="p-1 rounded-xl shadow-md"
                />
              </span>
            </div>

            <div className=" w-full">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex gap-2">
                  {['Today', 'Weekly', 'Monthly', 'Yearly'].map((item) => (
                    <button
                      key={item}
                      onClick={() => setFilterReport(item as FilterType)}
                      className={`px-3 py-1 rounded-lg text-sm border transition ${filterReport === item
                        ? 'bg-blue-500 text-white shadow'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>


            <div className="">
              <select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                className="p-2 rounded-xl shadow-md cursor-pointer w-full"
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
              </select>
            </div>

            <div className=" flex justify-between gap-5">
              <button
                onClick={handleDownload}
                className="w-1/2 mt-14 border-none bg-green-500 shadow:md hover:bg-green-600 hover:shadow-xl p-2 rounded-xl text-white font-semibold"> Download</button>
              <button onClick={handleCancel} className=" w-1/2 mt-14 border-none bg-red-500 shadow:md hover:bg-red-600 hover:shadow-xl p-2 rounded-xl text-white font-semibold" >Cancel</button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports
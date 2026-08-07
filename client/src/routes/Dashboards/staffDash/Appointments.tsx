import { useState, useEffect } from "react";
import type { AppointmentProps, StatusType } from "../../../../types/types";
import { statusStyles } from "../../../../types/constants";
import { toast } from "react-hot-toast";
import API from "../../../../api/axios";
import { exportBillingInvoice } from "../../../../utils/reports/BillingReport";

const Appointments = ({ data, refreshAppointments }: AppointmentProps) => {

    const [filter, setFilter] = useState<StatusType | "All">("All");
    const [selectedDate, setSelectedDate] = useState<string>("");
    const recordsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedDate, filter]);

    const filteredAppointments = data.filter((item: any) => {

        const statusMatch =
            filter === "All" ||
            item.status.toLowerCase() === filter.toLowerCase();

        let dateMatch = true;

        if (selectedDate) {

            const appointmentDate = new Date(item.dateTime);

            const year = appointmentDate.getFullYear();
            const month = String(
                appointmentDate.getMonth() + 1
            ).padStart(2, "0");

            const day = String(
                appointmentDate.getDate()
            ).padStart(2, "0");

            const formattedDate = `${year}-${month}-${day}`;

            /*             console.log({
                            original: item.dateTime,
                            formattedDate,
                            selectedDate,
                            match: formattedDate === selectedDate
                        }); */

            dateMatch = formattedDate === selectedDate;
        }


        return statusMatch && dateMatch;

    });


    const approveAppointment = async (id: any) => {
        try {
            const res = await API.put(`appointment/approve/${id}`);
            toast.success(res.data.message);
            refreshAppointments();
        } catch (err) {
            toast.error("Oops! something went wrong");
        }
    }

    const cancelAppointment = async (id: any) => {
        try {
            const res = await API.put(`appointment/cancel/${id}`);
            toast.success(res.data.message);
            refreshAppointments();
        } catch (err) {
            toast.error("Oops! something went wrong");
        }
    }

    const handleDownload = async (id: any) => {
        try {
            toast.loading("Generating invoice...", { id: "report" });

            const invoice = await API.get(`/billing/invoice/${id}`);
            console.log(invoice.data.invoice)
            exportBillingInvoice(invoice.data.invoice);
            toast.success("Invoice downloaded", { id: "report" });
        } catch (err: any) {
            toast.error("Oops! Something went wrong");
        }
    }


    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

    const currentRecords = filteredAppointments.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredAppointments.length / recordsPerPage);


    if (!currentRecords) {
        return <div className="mt-6 w-full">Loading...</div>;
    }

    /*     console.log("selectedDate:", selectedDate);
        console.log("filteredAppointments:", filteredAppointments);
        console.log("currentRecords:", currentRecords); */
    return (
        <div className="mt-6 w-full">

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-sm font-semibold text-gray-700">Appointment Date</span>

                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="px-4 py-2 rounded-xl border border-gray-300 text-sm text-gray-700 shadow-sm
                        focus:outline-none focus:ring-2 focus:ring-[#2596be] focus:border-[#2596be] transition"
                        />

                        <button
                            onClick={() => setSelectedDate("")}
                            className="px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-600 text-sm font-medium
                        hover:bg-gray-100 transition"
                        >
                            Clear
                        </button>

                    </div>

                    <div className="flex flex-wrap gap-2">
                        {["All", "Approved", "Pending", "Canceled", "Paid", "Completed"].map((item) => (

                            <button
                                key={item}
                                onClick={() => setFilter(item as StatusType | "All")}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                            ${filter === item
                                        ? "bg-[#2596be] text-white shadow-md"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="hidden md:block overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Patient</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Doctor</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Appointment</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                            <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">

                        {currentRecords.length === 0 ? (

                            <tr>
                                <td colSpan={5} className="py-12 text-center text-gray-400">
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="text-4xl"> 📅</span>
                                        <p className="font-semibold text-gray-500"> No appointments found</p>
                                        <p className="text-sm">Try changing the selected date or status.</p>
                                    </div>
                                </td>
                            </tr>

                        ) : (

                            currentRecords.map((item: any, index: number) => (
                                <tr key={index} className="hover:bg-sky-50 transition-colors duration-200">

                                    <td className="px-6 py-5">
                                        <div className="font-semibold text-gray-800">{item.userName}</div>
                                    </td>

                                    <td className="px-6 py-5">
                                        <div className="font-medium text-gray-700">Dr. {item.doctorName}</div>
                                    </td>

                                    <td className="px-6 py-5">
                                        <div className="font-medium text-gray-800">
                                            {new Date(item.dateTime).toLocaleDateString("en-GB"/* , { day: "2-digit", month: "short", year: "numeric", } */)}
                                        </div>
                                        <div className="text-sm text-gray-500 mt-1">
                                            {new Date(item.dateTime).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold uppercase border ${statusStyles[item.status as StatusType]}`}>
                                            {item.status}
                                        </span>
                                    </td>


                                    <td className="px-6 py-5">
                                        <div className="flex justify-center gap-2">

                                            {item.status === "pending" && (
                                                <>
                                                    <button
                                                        onClick={() => approveAppointment(item._id)}
                                                        className="px-3 py-1 rounded-lg border text-gray-600 hover:text-green-500 hover:border-green-600"
                                                    >
                                                        Approve
                                                    </button>

                                                    <button
                                                        onClick={() => cancelAppointment(item._id)}
                                                        className="px-3 py-1 rounded-lg border text-gray-600 hover:text-red-500 hover:border-red-500"
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            )}


                                            {item.status === "approved" && (
                                                <button
                                                    disabled
                                                    className="px-3 py-1 rounded-lg border cursor-not-allowed text-gray-400 border-gray-300"
                                                >
                                                    Approved
                                                </button>
                                            )}


                                            {item.status === "completed" && (
                                                <button
                                                    disabled
                                                    className="px-3 py-1 rounded-lg border cursor-not-allowed text-gray-400 border-gray-300"
                                                >
                                                    Completed
                                                </button>
                                            )}


                                            {item.status === "canceled" && (
                                                <button
                                                    disabled
                                                    className="px-3 py-1 rounded-lg border cursor-not-allowed text-gray-400 border-gray-300"
                                                >
                                                    Canceled
                                                </button>
                                            )}


                                            {item.status === "paid" && (
                                                <button
                                                    onClick={() => handleDownload(item.billingId)}
                                                    className="px-3 py-1 rounded-lg border text-gray-600 hover:text-[#2596be] hover:border-[#2596be]"
                                                >
                                                    Download
                                                </button>
                                            )}

                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>


                {totalPages > 0 && (
                    <div className="flex justify-center mt-6 gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="px-3 py-1 border rounded disabled:opacity-40"
                        >
                            Prev
                        </button>

                        <span>
                            {currentPage} / {totalPages}
                        </span>

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="px-3 py-1 border rounded disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>


            <div className="md:hidden flex flex-col gap-4">
                {currentRecords.length === 0 ? (
                    <p className="text-center text-gray-400">
                        No appointments found
                    </p>
                ) : (
                    currentRecords.map((item: any, index: any) => (
                        <div
                            key={index}
                            className="bg-white p-4 rounded-xl shadow-md flex flex-col gap-3"
                        >
                            <div className="flex justify-between items-center font-semibold">
                                <h2 className="font-semibold">{item.userName}</h2>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${statusStyles[item.status as StatusType]}`} >
                                    {item.status}
                                </span>
                            </div>

                            <div className="flex items-center font-semibold">
                                {item.doctorName}
                            </div>

                            <p className="text-gray-500 text-sm">
                                {new Date(item.dateTime).toLocaleString()}
                            </p>

                            <div className="flex gap-2">

                                {item.status === "pending" && (
                                    <>
                                        <button
                                            onClick={() => approveAppointment(item._id)}
                                            className="flex-1 px-3 py-2 rounded-lg border text-gray-600 hover:text-green-500 hover:border-green-600 transition"
                                        >
                                            Approve
                                        </button>

                                        <button
                                            onClick={() => cancelAppointment(item._id)}
                                            className="flex-1 px-3 py-2 rounded-lg border text-gray-600 hover:text-red-500 hover:border-red-500 transition"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                )}

                                {item.status === "approved" && (
                                    <button
                                        disabled
                                        className="flex-1 px-3 py-2 rounded-lg border cursor-not-allowed text-gray-400 border-gray-300"
                                    >
                                        Approved
                                    </button>
                                )}

                                {item.status === "completed" && (
                                    <button
                                        disabled
                                        className="flex-1 px-3 py-2 rounded-lg border cursor-not-allowed text-gray-400 border-gray-300"
                                    >
                                        Completed
                                    </button>
                                )}

                                {item.status === "canceled" && (
                                    <button
                                        disabled
                                        className="flex-1 px-3 py-2 rounded-lg border cursor-not-allowed text-gray-400 border-gray-300"
                                    >
                                        Canceled
                                    </button>
                                )}

                                {item.status === "paid" && (
                                    <button
                                        onClick={() => handleDownload(item.billingId)}
                                        className="flex-1 px-3 py-2 rounded-lg border text-gray-600 hover:text-[#2596be] hover:border-[#2596be] transition"
                                    >
                                        Download
                                    </button>
                                )}

                            </div>
                        </div>
                    ))

                )}
                {totalPages > 0 &&
                    <div className="flex justify-center mt-6 gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="px-3 py-1 border rounded"
                        >
                            Prev
                        </button>

                        <span>{currentPage} / {totalPages}</span>

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="px-3 py-1 border rounded"
                        >
                            Next
                        </button>
                    </div>}
            </div>
        </div>
    );
};

export default Appointments;
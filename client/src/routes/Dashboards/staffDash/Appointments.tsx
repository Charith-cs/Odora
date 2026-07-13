import { useState } from "react";
import type { AppointmentProps, StatusType } from "../../../../types/types";
import { statusStyles } from "../../../../types/constants";
import { toast } from "react-hot-toast";
import API from "../../../../api/axios";

const Appointments = ({ data, refreshAppointments }: AppointmentProps) => {
    const [filter, setFilter] = useState<StatusType | "All">("All");
    const [selectedDate, setSelectedDate] = useState<string>("");
    const recordsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

const filteredAppointments = data.filter((item: any) => {

    const statusMatch =
        filter === "All" ||
        item.status.toLowerCase() === filter.toLowerCase();

    let dateMatch = true;

    if (selectedDate) {
        const itemDate = new Date(item.dateTime);
        const selected = new Date(selectedDate);

        dateMatch =
            itemDate.getFullYear() === selected.getFullYear() &&
            itemDate.getMonth() === selected.getMonth() &&
            itemDate.getDate() === selected.getDate();
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


    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

    const currentRecords = filteredAppointments.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredAppointments.length / recordsPerPage);

    if (!currentRecords) {
        return <div className="mt-6 w-full">Loading...</div>;
    }


    return (
        <div className="mt-6 w-full">


            <div className="flex flex-wrap gap-2 mb-4 items-center">
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-4 py-1 rounded-full text-sm border border-gray-300 text-gray-600 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />

                <button
                    onClick={() => setSelectedDate("")}
                    className="px-4 py-1 rounded-full text-sm border text-gray-500 hover:bg-gray-100"
                >
                    Clear
                </button>
            </div>


            <div className="flex flex-wrap gap-2 mb-4">
                {["All", "Approved", "Pending", "Canceled" , "Paid"].map((item) => (
                    <button
                        key={item}
                        onClick={() => setFilter(item as StatusType | "All")}
                        className={`px-4 py-1 rounded-full text-sm font-medium border transition
              ${filter === item
                                ? "bg-sky-500 text-white border-sky-500 shadow"
                                : "text-gray-500 border-gray-300 hover:bg-gray-100"
                            }`}
                    >
                        {item}
                    </button>
                ))}
            </div>


            <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-separate border-spacing-y-3">
                    <thead>
                        <tr className="text-left text-gray-500 text-sm">
                            <th className="px-4">Patient</th>
                            <th className="px-4">Doctor</th>
                            <th className="px-4">Appointment Details</th>
                            <th className="px-4">Status</th>
                            <th className="px-4">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredAppointments.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-6 text-gray-400">
                                    No appointments found
                                </td>
                            </tr>
                        ) : (
                            filteredAppointments.map((item: any, index: any) => (
                                <tr
                                    key={index}
                                    className="bg-white shadow-md rounded-xl hover:shadow-lg transition"
                                >
                                    <td className="px-4 py-4 font-semibold">{item.userName}</td>
                                    <td className="px-4 py-4 font-semibold">Dr . {item.doctorName}</td>
                                    <td className="px-4 py-4 text-gray-500">
                                        {new Date(item.dateTime).toLocaleString()}
                                    </td>

                                    <td className="px-4 py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-semibold ${statusStyles[item.status]}`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>

                                    <td className="px-4 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => approveAppointment(item._id)}
                                                disabled={item.status === "approved" || item.status === "completed" || item.status === "paid"}
                                                className={`px-3 py-1 rounded-lg border${(item.status === "approved" || item.status === "completed" || item.status === "paid")
                                                    ? "cursor-not-allowed text-gray-600 border-gray-600"
                                                    : "text-gray-600 hover:text-green-500 hover:border-green-500"
                                                    }`}
                                            >
                                                {item.status === "approved"
                                                    ? "Approved"
                                                    : item.status === "completed"
                                                        ? "Completed"
                                                         : item.status === "paid"
                                                        ? "Paid"
                                                        : "Approve"}
                                            </button>


                                            <button
                                                onClick={() => cancelAppointment(item._id)}
                                                disabled={item.status === "canceled" || item.status === "completed" || item.status === "paid"}
                                                className={`px-3 py-1 rounded-lg border
                                                 ${(item.status === "canceled" || item.status === "completed"|| item.status === "paid")
                                                        ? "cursor-not-allowed text-gray-400 border-gray-300"
                                                        : "text-gray-600 hover:text-red-500 hover:border-red-500"
                                                    }`}
                                            >
                                                {item.status === "canceled"
                                                    ? "Canceled"
                                                    : item.status === "completed"
                                                        ? "Cancel"
                                                        : item.status === "paid"
                                                        ? "Cancel"
                                                        : "Cancel"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
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
                </div>
            </div>


            <div className="md:hidden flex flex-col gap-4">
                {filteredAppointments.length === 0 ? (
                    <p className="text-center text-gray-400">
                        No appointments found
                    </p>
                ) : (
                    filteredAppointments.map((item: any, index: any) => (
                        <div
                            key={index}
                            className="bg-white p-4 rounded-xl shadow-md flex flex-col gap-3"
                        >
                            <div className="flex justify-between items-center font-semibold">
                                <h2 className="font-semibold">{item.userName}</h2>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[item.status]}`}
                                >
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
                                <button onClick={() => approveAppointment(item._id)} className="flex-1 px-3 py-1 rounded-lg border text-gray-600 hover:text-green-500">
                                    Approve
                                </button>
                                <button onClick={() => cancelAppointment(item.id)} className="flex-1 px-3 py-1 rounded-lg border text-gray-600 hover:text-red-500">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ))

                )}
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
                </div>
            </div>
        </div>
    );
};

export default Appointments;
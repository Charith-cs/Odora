import { useEffect, useState } from 'react'
import type { StatusType } from '../../../../types/types';
import { statusStyles } from '../../../../types/constants';
import { Link } from 'react-router-dom';
import API from '../../../../api/axios';

const PaymentTable = () => {

    const [filter, setFilter] = useState<StatusType | "All">("All");
    const [search, setSearch] = useState("");
    const [fetched, setFetched] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;
    const currentUser = JSON.parse(localStorage.getItem("user") || "null");


    useEffect(() => {
        const fetchCompleted = async () => {
            try {
                const res = await API.get(`/billing/completed/${currentUser._id}`);
                setFetched(res.data)
            } catch (err) {
                console.error(err);
            }
        }
        fetchCompleted();
    }, [currentUser._id]);


    const filteredAppointments = fetched.filter((item: any) => {

        const matchesStatus =
            filter === "All" || item.status === filter;

        const patientName =
            `${item?.userId?.firstName || ""} ${item?.userId?.lastName || ""}`;

        const doctorName =
            `${item?.doctorId?.firstName || ""} ${item?.doctorId?.lastName || ""}`;

        const matchesSearch =
            patientName.toLowerCase().includes(search.toLowerCase()) ||
            doctorName.toLowerCase().includes(search.toLowerCase()) ||
            item?.dateTime?.toLowerCase().includes(search.toLowerCase());

        return matchesStatus && matchesSearch;
    });
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

    const currentRecords = filteredAppointments?.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredAppointments.length / recordsPerPage);

    if (!currentRecords) {
        return <div className="mt-6 w-full">Loading...</div>;
    }



    return (
        <div className="mt-6 w-full">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">

                <div className="relative w-full md:w-1/3">
                    <input
                        type="text"
                        placeholder="Search patient, doctor, date..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>

                </div>



                <div className="flex flex-wrap gap-2 ">
                    {["All", "completed", "paid"].map((item) => (
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
            </div>

            <div className=" flex justify-between items-center my-1 text-center">
                <p className="text-sm text-gray-400 mt-4">
                    Showing {currentRecords.length} results
                </p>
                <Link to="/walk_in_appointment" className="px-3 py-1 mt-6 rounded-lg border border-[#2596be] text-[#2596be] hover:text-white hover:bg-[#2596be] transition">Add Walk-In-Appointment</Link>
            </div>
            <hr className=" my-2" />

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
                        {currentRecords.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-6 text-gray-400">
                                    No appointments found
                                </td>
                            </tr>
                        ) : (
                            currentRecords.map((item, index) => (
                                <tr
                                    key={index}
                                    className="bg-white shadow-md rounded-xl hover:shadow-lg transition"
                                >
                                    <td className="px-4 py-4 font-semibold">{item?.userId?.firstName + " " + item?.userId?.lastName}</td>
                                    <td className="px-4 py-4 font-semibold">{item?.doctorId?.firstName + " " + item?.doctorId?.lastName}</td>
                                    <td className="px-4 py-4 text-gray-500">{item.dateTime}</td>

                                    <td className="px-4 py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-semibold ${statusStyles[item.status]}`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>

                                    <td className="px-4 py-4">
                                        <div className="flex gap-2">
                                            <Link
                                                to={item.status === "paid" ? "#" : `/billing/${item._id}`}
                                                onClick={(e) => {
                                                    if (item.status === "paid") {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                className={`px-3 py-1 rounded-lg border text-center transition-all duration-200 ${item.status === "paid"
                                                        ? "bg-green-50 text-green-600 border-green-500 cursor-not-allowed pointer-events-none"
                                                        : "text-gray-600 border-gray-300 hover:bg-green-50 hover:text-green-600 hover:border-green-500"
                                                    }`}
                                            >
                                                {item.status === "paid" ? "Completed" : "Proceed"}
                                            </Link>

                                            <button
                                                disabled={item.status === "paid"}
                                                className={`px-3 py-1 rounded-lg border transition-all duration-200 ${item.status === "paid"
                                                        ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                                                        : "text-gray-600 border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-500"
                                                    }`}
                                            >
                                                Cancel
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

            {/* 📱 Mobile Cards */}
            <div className="md:hidden flex flex-col gap-4">
                {currentRecords.length === 0 ? (
                    <p className="text-center text-gray-400">
                        No appointments found
                    </p>
                ) : (
                    currentRecords.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white p-4 rounded-xl shadow-md flex flex-col gap-3"
                        >
                            <div className="flex justify-between items-center font-semibold">
                                <h2>{item?.userId?.firstName + " " + item?.userId?.lastName}</h2>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[item.status]}`}
                                >
                                    {item.status}
                                </span>
                            </div>

                            <div className="font-semibold">{item?.doctorId?.firstName + " " + item?.doctorId?.lastName}</div>

                            <p className="text-gray-500 text-sm">{item.dateTime}</p>

                            <div className="flex gap-2">
                                <Link
                                    to={item.status === "paid" ? "#" : `/billing/${item._id}`}
                                    onClick={(e) => {
                                        if (item.status === "paid") {
                                            e.preventDefault();
                                        }
                                    }}
                                    className={`flex-1 text-center px-3 py-1 rounded-lg border transition-all duration-200 ${item.status === "paid"
                                        ? "bg-green-50 text-green-600 border-green-500 cursor-not-allowed pointer-events-none"
                                        : "text-gray-600 border-gray-300 hover:bg-green-50 hover:text-green-600 hover:border-green-500"
                                        }`}
                                >
                                    {item.status === "paid" ? "Completed" : "Proceed"}
                                </Link>

                                <button
                                    disabled={item.status === "paid"}
                                    className={`flex-1 px-3 py-1 rounded-lg border transition-all duration-200 ${item.status === "paid"
                                        ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                                        : "text-gray-600 border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-500"
                                        }`}
                                >
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
    )
}

export default PaymentTable
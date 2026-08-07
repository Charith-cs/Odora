import { useEffect, useState } from 'react'
import type { doctorStatusType } from '../../../../types/types';
import { doctorStatusStyles } from '../../../../types/constants';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../../../api/axios';
import toast from 'react-hot-toast';

const DoctorAppointment = () => {

    const [filter, setFilter] = useState<doctorStatusType | "All">("All");
    const [search, setSearch] = useState("");
    const [appointments, setAppointments] = useState<[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;
    const currentUser = JSON.parse(localStorage.getItem("user") || "null");
    const navigate = useNavigate();

    const fetchAppointment = async () => {
        try {
            const res = await API.get(`/appointment/my/${currentUser._id}`);
            setAppointments(res.data.docAppoiintment);
        } catch (err) {
            toast.error("Failed to load appointments");
        }
    };

    useEffect(() => {
        if (!currentUser._id) return;
        fetchAppointment();
    }, [currentUser._id]);

    const filteredAppointments = appointments.filter((item: any) => {
        const matchesStatus = filter === "All" || item.status === filter;

        const matchesSearch =
            item.userId.firstName.toLowerCase().includes(search.toLowerCase()) ||
            item.userId.lastName.toLowerCase().includes(search.toLowerCase()) ||
            item.birthDay.toLowerCase().includes(search.toLowerCase()) ||
            item.dateTime.toLowerCase().includes(search.toLowerCase());

        return matchesStatus && matchesSearch;
    });

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

    const currentRecords = filteredAppointments.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredAppointments.length / recordsPerPage);

    if (!currentRecords) {
        return <div className="mt-6 w-full">Loading...</div>;
    }

    return (
        <div className="mt-6 w-full">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                    <div className="relative w-full lg:w-1/3">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                        <input
                            type="text"
                            placeholder="Search patient, doctor or date..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-700 shadow-sm
                focus:outline-none focus:ring-2 focus:ring-[#2596be] focus:border-[#2596be] transition"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {["All", /* "ongoing",  */"approved", "completed"].map((item) => (
                            <button
                                key={item}
                                onClick={() => setFilter(item as doctorStatusType | "All")}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                    ${filter === item
                                        ? "bg-[#2596be] text-white shadow-md"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {item.charAt(0).toUpperCase() + item.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <p className="text-sm text-gray-400 mt-4">
                Showing {currentRecords.length} results
            </p>
            <hr className=" my-2" />
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"> Patient</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"> Birth Date </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Appointment</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                            <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500"> Action</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {currentRecords.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-12 text-center text-gray-400">
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="text-4xl">📅</span>
                                        <p className="font-semibold text-gray-500">No appointments found  </p>
                                        <p className="text-sm">There are no appointments matching your filters.</p>
                                    </div>
                                </td>
                            </tr>

                        ) : (

                            currentRecords.map((item: any) => (
                                <tr key={item._id} className="hover:bg-sky-50 transition-colors duration-200">
                                    <td className="px-6 py-5">
                                        <div className="font-semibold text-gray-800">{item.userId?.firstName} {item.userId?.lastName}</div>
                                    </td>

                                    <td className="px-6 py-5">
                                        <div className="text-gray-700">{item.userId?.birthDay}</div>
                                    </td>

                                    <td className="px-6 py-5">
                                        <div className="font-medium text-gray-800">
                                            {new Date(item.dateTime).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", })}
                                        </div>
                                        <div className="text-sm text-gray-500 mt-1">{new Date(item.dateTime).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", })}</div>
                                    </td>

                                    <td className="px-6 py-5">
                                        <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold uppercase border ${doctorStatusStyles[item.status as doctorStatusType]}`}>{item.status}</span>
                                    </td>

                                    <td className="px-6 py-5">
                                        <div className="flex justify-center">
                                            <Link

                                                to={item.status === "completed" ? "#" : new Date(item.dateTime).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0) ? "#" : `/add_treatment/${item._id}`}
                                                className={`px-4 py-2 rounded-xl border text-sm font-medium transition
                                                        ${item.status === "completed"
                                                        ? "pointer-events-none opacity-60 cursor-not-allowed border-green-300 text-green-500"
                                                        : new Date(item.dateTime).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0) ? "pointer-events-none opacity-60 cursor-not-allowed border-gray-300 text-gray-500"
                                                            : "border-[#2596be] text-[#2596be] hover:bg-[#2596be] hover:text-white"
                                                    }`}>
                                                {item.status === "completed" ? "Treatment Added" : new Date(item.dateTime).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0) ? "Waiting..." : "Add Treatment"}
                                            </Link>
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


            <div className="md:hidden flex flex-col gap-4 mt-5">
                {currentRecords.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-4xl">📅</span>
                            <h3 className="font-semibold text-gray-600"> No appointments found</h3>
                            <p className="text-sm text-gray-400">There are no appointments matching your filters.</p>
                        </div>
                    </div>

                ) : (

                    currentRecords.map((item: any) => (
                        <div key={item._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-gray-400"> Patient</p>
                                    <h3 className="font-semibold text-gray-800 text-lg">{item.userId.firstName} {item.userId.lastName}</h3>
                                </div>

                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase border ${doctorStatusStyles[item.status as doctorStatusType]}`}>{item.status}</span>
                            </div>

                            <div className="mb-4">
                                <p className="text-xs uppercase tracking-wide text-gray-400"> Birth Date</p>
                                <p className="text-gray-700 font-medium">{item.userId.birthDay}</p>
                            </div>

                            <div className="mb-5">
                                <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Appointment</p>
                                <p className="font-medium text-gray-800">
                                    {new Date(item.dateTime).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", })}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {new Date(item.dateTime).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", })}
                                </p>
                            </div>

                            <button
                                onClick={() => navigate(`/add_treatment/${item._id}`)}
                                disabled={item.status === "completed"}
                                className={`w-full py-2.5 rounded-xl border text-sm font-medium transition
                    ${item.status === "completed"
                                        ? "cursor-not-allowed opacity-60 border-gray-300 text-gray-500"
                                        : "border-[#2596be] text-[#2596be] hover:bg-[#2596be] hover:text-white"
                                    }`}>
                                {item.status === "completed" ? "Treatment Added" : "Add Treatment"}
                            </button>
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

export default DoctorAppointment
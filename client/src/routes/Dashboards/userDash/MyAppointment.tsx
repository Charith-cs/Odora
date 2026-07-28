import { useEffect, useState } from "react";
import type { StatusType } from "../../../../types/types";
import { statusStyles } from "../../../../types/constants";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../../api/axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import toast from "react-hot-toast";

dayjs.extend(relativeTime);

const MyAppointment = () => {
    const [filter, setFilter] = useState<StatusType | "All">("All");
    const [appointments, setAppointments] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const [button, setButtton] = useState(false);
    const [cancel, setCancel] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const navigate = useNavigate();
    const { id } = useParams();

    const recordsPerPage = 10;

    //Fetch appointments
    const fetchAppointment = async () => {
        try {
            const res = await API.get(`/appointment/my/${id}`);
            setAppointments(res.data);
        } catch (err) {
            toast.error("Failed to load appointments");
        }
    };

    useEffect(() => {
        if (!id) return;
        fetchAppointment();
    }, [id]);

    // Filter logic
    const filteredAppointments =
        filter === "All"
            ? appointments?.appointments || []
            : appointments?.appointments?.filter((item: any) =>
                item.status?.toLowerCase() === filter.toLowerCase()
            ) || [];

    //Pagination
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

    const currentRecords = filteredAppointments.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredAppointments.length / recordsPerPage);

    if (!appointments) {
        return <div className="mt-6 w-full">Loading...</div>;
    }

    const openCancel = (id: string) => {
        setSelectedId(id);
        setCancel(true);
    }

    const handleCancel = async () => {
        if (!selectedId) return;
        console.log(selectedId)
        try {
            const res = await API.delete(`/appointment/${selectedId}`);
            setCancel(false);
            setSelectedId(null);
            toast.success(res.data.message);
            fetchAppointment();

        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Cancel failed");
        }
    };


    const openReschedule = (id: string) => {
        setSelectedId(id);
        setButtton(true);
    };

    const handleReschedule = async () => {
        if (!selectedId) return;
        console.log(selectedId)
        try {
            const res = await API.delete(`/appointment/${selectedId}`);
            toast.success("Let's reschedule your appointment");

            setButtton(false);
            setSelectedId(null);

            navigate(`/${res.data.appointment.doctorId}`);

        } catch (err: any) {
            toast.error(err?.response?.data?.message);
        }
    };
    console.log(currentRecords);
    return (
        <div className="mt-6 w-full">


            {button && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-[420px] rounded-2xl bg-white p-6 shadow-2xl">

                        <div className="flex justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                                <span className="text-3xl">↻</span>
                            </div>
                        </div>

                        <h2 className="mt-5 text-center text-xl font-bold text-gray-800"> Confirm Reschedule</h2>
                        <p className="mt-3 text-center text-gray-500">This will delete your current appointment and allow you to book again.</p>
                        <p className="mt-2 text-center text-sm text-red-500"> This action cannot be undone.</p>

                        <div className="mt-8 flex gap-3">
                            <button
                                onClick={handleReschedule}
                                className="flex-1 rounded-xl border bg-green-500 py-3 font-semibold text-white transition hover:bg-green-600"
                            >
                                Confirm
                            </button>

                            <button
                                onClick={() => { setButtton(false); setSelectedId(null); }}
                                className="flex-1 rounded-xl bg-red-500 py-3 font-semibold text-white transition hover:bg-red-600"
                            >
                                Cancel
                            </button>

                        </div>
                    </div>
                </div>
            )}

            {cancel && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-[420px] rounded-2xl bg-white p-6 shadow-2xl">

                        <div className="flex justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                                <span className="text-3xl">🗑️</span>
                            </div>
                        </div>

                        <h2 className="mt-5 text-center text-xl font-bold text-gray-800"> Delete Appointment</h2>
                        <p className="mt-3 text-center text-gray-500">Are you sure you want to delete this appointment ?</p>
                        <p className="mt-2 text-center text-sm text-red-500"> This action cannot be undone.</p>

                        <div className="mt-8 flex gap-3">
                            <button

                                onClick={() => { setCancel(false); setSelectedId(null); }}
                                className="flex-1 rounded-xl border border-gray-300 py-3 font-semibold text-gray-600 transition hover:bg-gray-100"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleCancel}
                                className="flex-1 rounded-xl bg-red-500 py-3 font-semibold text-white transition hover:bg-red-600"
                            >
                                Remove
                            </button>

                        </div>
                    </div>
                </div>
            )}


            <div className="flex flex-wrap gap-2">

                {["All", "Approved", "Pending", "Canceled", "Completed", "Paid"].map((item) => (

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


            <div className="hidden md:block overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100 mt-5">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Clinic</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Doctor</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Appointment </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                            <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {currentRecords.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-12 text-center text-gray-400">
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="text-4xl">📅 </span>
                                        <p className="font-semibold text-gray-500">No appointments found</p>
                                        <p className="text-sm">You don't have any appointments for this filter.</p>
                                    </div>
                                </td>
                            </tr>

                        ) : (

                            currentRecords.map((item: any) => (
                                <tr key={item._id} className="hover:bg-sky-50 transition-colors duration-200">

                                    <td className="px-6 py-5">
                                        <div className="font-semibold text-gray-800">{item.clinicId?.clinicName}</div>
                                    </td>

                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <img src="/userDash/user.png" alt="Doctor" className="w-10 h-10 rounded-full border object-cover" />

                                            <div>
                                                <p className="font-semibold text-gray-800">Dr. {item.doctorId?.firstName} {item.doctorId?.lastName} </p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-5">
                                        <div className="font-medium text-gray-800">{dayjs(item.dateTime).format("DD MMM YYYY")}</div>
                                        <div className="text-sm text-gray-500 mt-1">{dayjs(item.dateTime).format("hh:mm A")}</div>
                                        <div className="text-xs text-gray-400 mt-1">{dayjs(item.dateTime).fromNow()}</div>
                                    </td>

                                    <td className="px-6 py-5">
                                        <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold uppercase border ${statusStyles[item.status as StatusType]}`}>{item.status}</span>
                                    </td>

                                    <td className="px-6 py-5">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => item && openReschedule(item._id)}
                                                disabled={item.status === "paid" || item.status === "approved" || item.status === "completed"}
                                                className={`px-4 py-2 rounded-xl border text-sm font-medium ${item.status === "paid" || item.status === "approved" || item.status === "completed" ? "cursor-not-allowed text-gray-600 border-gray-600" : "border-[#2596be] text-[#2596be]  hover:bg-[#2596be] hover:text-white transition"} `}
                                            >
                                                Reschedule
                                            </button>

                                            <button
                                                onClick={() => item && openCancel(item._id)}
                                                disabled={item.status === "paid" || item.status === "approved" || item.status === "completed"}
                                                className={`px-4 py-2 rounded-xl border ${item.status === "paid" || item.status === "approved" || item.status === "completed" ? "cursor-not-allowed text-gray-600 border-gray-600" : "border-red-500 text-red-500 text-sm font-medium hover:bg-red-500 hover:text-white transition"}`}
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
            </div>


            <div className="md:hidden flex flex-col gap-4 mt-5">
                {currentRecords.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-4xl">📅</span>
                            <h3 className="font-semibold text-gray-600">No appointments found</h3>
                            <p className="text-sm text-gray-400"> You don't have any appointments for this filter.</p>
                        </div>
                    </div>

                ) : (

                    currentRecords.map((item: any) => (
                        <div key={item._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                            <div className="mb-4">
                                <p className="text-xs uppercase tracking-wide text-gray-400">Clinic</p>
                                <h3 className="font-semibold text-gray-800 text-lg">{item.clinicId?.clinicName}</h3>
                            </div>

                            <div className="flex items-center gap-3 mb-4">
                                <img src="/userDash/user.png" alt="Doctor" className="w-11 h-11 rounded-full border object-cover" />
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-gray-400">Doctor</p>
                                    <p className="font-medium text-gray-700">Dr. {item.doctorId?.firstName} {item.doctorId?.lastName}</p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Appointment</p>
                                <p className="font-medium text-gray-800">{dayjs(item.dateTime).format("DD MMM YYYY")}</p>
                                <p className="text-sm text-gray-500">{dayjs(item.dateTime).format("hh:mm A")}</p>
                                <p className="text-xs text-gray-400 mt-1">{dayjs(item.dateTime).fromNow()}</p>
                            </div>

                            <div className="mb-5">
                                <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase border ${statusStyles[item.status as StatusType]}`}
                                >
                                    {item.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => openReschedule(item._id)}
                                    disabled={item.status === "paid" || item.status === "approved" || item.status === "completed"}
                                    className={`py-2.5 rounded-xl border ${item.status === "paid" || item.status === "approved" || item.status === "completed" ? "cursor-not-allowed text-gray-600 border-gray-600" : "border-[#2596be] text-[#2596be] font-medium hover:bg-[#2596be] hover:text-white transition"}`}
                                >
                                    Reschedule
                                </button>

                                <button
                                    onClick={() => openCancel(item._id)}
                                    disabled={item.status === "paid" || item.status === "approved" || item.status === "completed"}
                                    className={`py-2.5 rounded-xl border ${item.status === "paid" || item.status === "approved" || item.status === "completed" ? "cursor-not-allowed text-gray-600 border-gray-600" : "border-red-500 text-red-500 font-medium hover:bg-red-500 hover:text-white transition"}`}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>


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
    );
};

export default MyAppointment;
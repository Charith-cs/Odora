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
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const navigate = useNavigate();
    const { id } = useParams();

    const recordsPerPage = 10;

    // 🔹 Fetch appointments
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

    // 🔹 Filter logic
    const filteredAppointments =
        filter === "All"
            ? appointments?.appointments || []
            : appointments?.appointments?.filter((item: any) =>
                item.status?.toLowerCase() === filter.toLowerCase()
            ) || [];

    // 🔹 Pagination
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

    const currentRecords = filteredAppointments.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredAppointments.length / recordsPerPage);

    if (!appointments) {
        return <div className="mt-6 w-full">Loading...</div>;
    }


    const handleCancel = async (id: string) => {
        try {
            const res = await API.delete(`/appointment/${id}`);
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

    return (
        <div className="mt-6 w-full">


            {button && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white w-[90%] md:w-[400px] rounded-2xl shadow-xl p-6">

                        <h1 className="text-lg font-semibold text-center">
                            Confirm Reschedule
                        </h1>

                        <p className="text-sm text-gray-500 text-center mt-2">
                            This will delete your current appointment and allow you to book again.
                        </p>

                        <div className="flex justify-between gap-4 mt-6">

                            <button
                                onClick={handleReschedule}
                                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl font-semibold"
                            >
                                Confirm
                            </button>

                            <button
                                onClick={() => {
                                    setButtton(false);
                                    setSelectedId(null);
                                }}
                                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl font-semibold"
                            >
                                Cancel
                            </button>

                        </div>
                    </div>
                </div>
            )}


            <div className="flex flex-wrap gap-2 mb-4">
                {["All", "Approved", "Pending", "Canceled"].map((item) => (
                    <button
                        key={item}
                        onClick={() => setFilter(item as StatusType | "All")}
                        className={`px-4 py-1 rounded-full text-sm font-medium border transition
                        ${filter === item
                                ? "bg-sky-500 text-white border-sky-500"
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
                            <th className="px-4">Clinic</th>
                            <th className="px-4">Doctor</th>
                            <th className="px-4">Appointment</th>
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
                            currentRecords.map((item: any) => (
                                <tr key={item._id} className="shadow-md">

                                    <td className="px-4 py-4 font-semibold">
                                        {item.clinicId?.clinicName}
                                    </td>

                                    <td className="px-4 py-4 flex items-center gap-3">
                                        <img src="/userDash/user.png" className="w-10 h-10 rounded-full" />
                                        Dr. {item.doctorId?.firstName} {item.doctorId?.lastName}
                                    </td>

                                    <td className="px-4 py-4 text-gray-500">
                                        {dayjs(item.dateTime).fromNow()}
                                    </td>

                                    <td className="px-4 py-4">
                                        <span className={`px-3 py-1 rounded-full text-sm ${statusStyles[item.status as StatusType]}`}>
                                            {item.status}
                                        </span>
                                    </td>

                                    <td className="px-4 py-4 flex gap-2">

                                        <button
                                            onClick={() => item && openReschedule(item._id)}
                                            className="px-3 py-1 border rounded hover:text-sky-500"
                                        >
                                            Reschedule
                                        </button>

                                        <button
                                            onClick={() => handleCancel(item._id)}
                                            className="px-3 py-1 border rounded hover:text-red-500"
                                        >
                                            Cancel
                                        </button>

                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>


            <div className="md:hidden flex flex-col gap-4">

                {currentRecords.map((item: any) => (
                    <div key={item._id} className="bg-white p-4 rounded-xl shadow-md">

                        <h2>{item.clinicId?.clinicName}</h2>

                        <p>Dr. {item.doctorId?.firstName}</p>

                        <p className="text-sm text-gray-500">
                            {dayjs(item.dateTime).fromNow()}
                        </p>

                        <div className="flex gap-2 mt-3">

                            <button
                                onClick={() => openReschedule(item._id)}
                                className="flex-1 border p-2 rounded"
                            >
                                Reschedule
                            </button>

                            <button
                                onClick={() => handleCancel(item._id)}
                                className="flex-1 border p-2 rounded text-red-500"
                            >
                                Cancel
                            </button>

                        </div>
                    </div>
                ))}

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
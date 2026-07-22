import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { PatientDetailsProps } from "../../../../types/types";
import API from "../../../../api/axios";

const PatientDetails = ({ data }: PatientDetailsProps) => {
    const { state } = useLocation();
    const { id } = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const navigate = useNavigate();
    const [patientData, setPatientData] = useState<any>(data || null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                if (data?.history && data?.appointment) {
                    setPatientData(data);
                    return;
                }

                if (state?.history && state?.appointment) {
                    setPatientData(state);
                    return;
                }

                if (id) {
                    const res = await API.get(`/user/details/${id}`);
                    setPatientData(res.data);
                }

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id, state, data]);

    if (loading || !patientData) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    const history = patientData?.history || [];

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentHistory = history.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(history.length / itemsPerPage);

    return (
        <div className="mt-6 space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                Patient Information
            </h2>
            <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl">
                {/* Close Button */}
                <button
                    onClick={() => navigate("/patients")}
                    className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-red-400 hover:bg-red-50"
                >
                    <img src="/userDash/close.png" alt="close" className="h-4 w-4 object-contain" />
                </button>

                <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start">
                    <div className="flex w-full flex-col items-center lg:w-64">
                        <img
                            src={
                                patientData?.appointment?.userId?.img ||
                                "/userDash/user.png"
                            }
                            alt="profilepic"
                            className="h-36 w-36 rounded-full border-4 border-[#2596be]/20 object-cover shadow-lg"
                        />

                        <h3 className="mt-5 text-center text-xl font-bold text-gray-800">
                            {patientData?.appointment?.userId?.firstName +
                                " " +
                                patientData?.appointment?.userId?.lastName}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">Patient</p>
                    </div>

                    <div className="flex-1 w-full">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div className="rounded-2xl bg-gray-50 p-5">
                                <p className="text-sm font-medium text-gray-500">Full Name</p>
                                <p className="mt-2 font-semibold text-gray-800">
                                    {patientData?.appointment?.userId?.firstName +
                                        " " +
                                        patientData?.appointment?.userId?.lastName}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-gray-50 p-5">
                                <p className="text-sm font-medium text-gray-500">Email</p>
                                <p className="mt-2 break-all font-semibold text-gray-800">{patientData?.appointment?.userId?.email}</p>
                            </div>

                            <div className="rounded-2xl bg-gray-50 p-5">
                                <p className="text-sm font-medium text-gray-500">Mobile Number </p>
                                <p className="mt-2 font-semibold text-gray-800">{patientData?.appointment?.userId?.mobileNumber}</p>
                            </div>

                            <div className="rounded-2xl bg-gray-50 p-5">
                                <p className="text-sm font-medium text-gray-500">Address</p>
                                <p className="mt-2 font-semibold text-gray-800 break-words">{patientData?.appointment?.userId?.address}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* ================= APPOINTMENT HISTORY ================= */}

            <div className="mt-8 rounded-3xl border border-gray-100 bg-white p-5 shadow-md md:p-6">
                <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Appointment History</h2>
                        <p className="mt-2 text-sm text-gray-500">Showing {patientData?.history?.length || 0} results</p>
                    </div>
                </div>

                {/* Desktop Table */}

                <div className="hidden overflow-x-auto md:block">
                    <table className="min-w-full border-separate border-spacing-y-3">
                        <thead>
                            <tr className="text-left text-sm font-semibold text-gray-500">
                                <th className="px-5 py-3">Doctor</th>
                                <th className="px-5 py-3">Appointment Date</th>
                                <th className="px-5 py-3">Treatment Details</th>
                                <th className="px-5 py-3">Paid Amount</th>
                            </tr>
                        </thead>
                        <tbody>

                            {patientData?.history?.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="rounded-2xl bg-gray-50 py-10 text-center text-gray-400">No appointments found</td>
                                </tr>

                            ) : (

                                currentHistory.map((item: any, index: number) => (
                                    <tr
                                        key={index}
                                        className="rounded-2xl bg-gray-50 shadow-sm transition-all duration-300 hover:bg-white hover:shadow-lg"
                                    >
                                        <td className="rounded-l-2xl px-5 py-5 font-semibold text-gray-800">
                                            {item?.doctorId?.firstName + " " + item?.doctorId?.lastName}</td>
                                        <td className="px-5 py-5 text-gray-600">{item?.appointmentId?.dateTime}</td>
                                        <td className="px-5 py-5">
                                            <div className="space-y-2">
                                                {item.treatments?.map((treat: any, i: number) => (

                                                    <div
                                                        key={i}
                                                        className="rounded-xl bg-white px-3 py-2 text-sm text-gray-700 shadow-sm"
                                                    >
                                                        <span className="font-medium">{treat.name}</span>
                                                        <span className="text-gray-500">{" "}- Rs. {treat.price} </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="rounded-r-2xl px-5 py-5">
                                            <span className="inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700"> Rs. {item.amount} </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}

                    <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row ">
                        <button
                            className="rounded-xl border border-gray-200 bg-white px-5 py-2 font-medium text-gray-600 transition-all duration-300 hover:border-[#2596be] hover:text-[#2596be] disabled:cursor-not-allowed disabled:opacity-40"
                            onClick={() =>
                                setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>

                        <span className="text-sm font-medium text-gray-500">
                            Page {currentPage} of {totalPages || 1}
                        </span>

                        <button
                            className="rounded-xl border border-gray-200 bg-white px-5 py-2 font-medium text-gray-600 transition-all duration-300 hover:border-[#2596be] hover:text-[#2596be] disabled:cursor-not-allowed disabled:opacity-40"
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    Math.min(prev + 1, totalPages)
                                )
                            }
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>

                {/* ================= MOBILE ================= */}

                <div className="flex flex-col gap-5 md:hidden">
                    {patientData?.history?.length === 0 ? (
                        <div className="rounded-2xl bg-gray-50 py-10 text-center text-gray-400 shadow-sm"> No appointments found</div>

                    ) : (

                        currentHistory.map((item: any, index: number) => (

                            <div
                                key={index}
                                className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:shadow-lg"
                            >

                                <div className="border-b border-gray-100 bg-gray-50 p-5">
                                    <h3 className="text-lg font-bold text-gray-800">
                                        {item?.doctorId?.firstName}{" "}
                                        {item?.doctorId?.lastName}
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">{item?.appointmentId?.dateTime}</p>
                                </div>

                                <div className="space-y-5 p-5">
                                    <div>
                                        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Treatments</p>
                                        <div className="space-y-2">
                                            {item.treatments?.map((treat: any, i: number) => (
                                                <div
                                                    key={i}
                                                    className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3"
                                                >
                                                    <span className="font-medium text-gray-700">{treat.name}</span>
                                                    <span className="font-semibold text-gray-600"> Rs. {treat.price} </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between rounded-2xl bg-green-50 px-4 py-3">
                                        <span className="font-medium text-gray-600">Paid Amount</span>
                                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">Rs. {item.amount}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    {/* Pagination */}

                    <div className="mt-2 flex flex-col items-center gap-4">
                        <button
                            className="w-full rounded-2xl border border-gray-200 bg-white py-3 font-medium text-gray-600 transition-all duration-300 hover:border-[#2596be] hover:text-[#2596be] disabled:cursor-not-allowed disabled:opacity-40"
                            onClick={() =>
                                setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>

                        <span className="text-sm font-medium text-gray-500">
                            Page {currentPage} of {totalPages || 1}
                        </span>

                        <button
                            className="w-full rounded-2xl border border-gray-200 bg-white py-3 font-medium text-gray-600 transition-all duration-300 hover:border-[#2596be] hover:text-[#2596be] disabled:cursor-not-allowed disabled:opacity-40"
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    Math.min(prev + 1, totalPages)
                                )
                            }
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDetails;
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
        <div className=" mt-6 grid grid-cols-1 ">
            <h2 className="text-3xl mb-6 mt-6 font-semibold ">Patient Information</h2>

            <div className=" relative flex items-center gap-20 mx-auto w-full bg-gray-50 rounded-2xl h-full shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition duration-300">
                <img src={patientData?.appointment?.userId?.img || "/userDash/user.png"} alt="profilepic" className=" w-32 h-32 object-cover items-center " />

                <div className="flex flex-col ">
                    <section className="flex flex-col ">
                        <div className="grid grid-cols-2 gap-y-4 gap-x-6 items-center">
                            <div className="font-semibold">Full name :</div>
                            <span>
                                {patientData?.appointment?.userId?.firstName + " " +
                                    patientData?.appointment?.userId?.lastName}
                            </span>

                            <div className="font-semibold">Email :</div>
                            <span>{patientData?.appointment?.userId?.email}</span>

                            <div className="font-semibold">Mobile number :</div>
                            <span>{patientData?.appointment?.userId?.mobileNumber}</span>

                            <div className="font-semibold">Address :</div>
                            <span>{patientData?.appointment?.userId?.address}</span>
                        </div>
                    </section>
                </div>

                <img
                    onClick={()=>navigate("/patients")}
                    src="/userDash/close.png"
                    alt="closeimg"
                    className=" absolute top-4 right-4 w-5 h-5 object-contain cursor-pointer"
                />
            </div>

            {/* HISTORY */}
            <div className=" mt-8">
                <h2 className="text-3xl mb-6 font-semibold ">Appointment History</h2>

                <p className="text-sm text-gray-400 mb-2">
                    Showing {patientData?.history?.length || 0} results
                </p>

                {/* DESKTOP TABLE */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full border-separate border-spacing-y-3">
                        <thead>
                            <tr className="text-left text-gray-500 text-sm">
                                <th className="px-4">Doctor</th>
                                <th className="px-4">Appointment Date</th>
                                <th className="px-4">Treated Details</th>
                                <th className="px-4">Paid</th>
                            </tr>
                        </thead>

                        <tbody>
                            {patientData?.history?.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-6 text-gray-400">
                                        No appointments found
                                    </td>
                                </tr>
                            ) : (
                                currentHistory.map((item: any, index: number) => (
                                    <tr
                                        key={index}
                                        className="bg-white shadow-md rounded-xl hover:shadow-lg transition"
                                    >
                                        <td className="px-4 py-4 font-semibold">
                                            {item?.doctorId?.firstName + " " + item?.doctorId?.lastName}
                                        </td>

                                        <td className="px-4 py-4">
                                            {item?.appointmentId?.dateTime}
                                        </td>

                                        <td className="px-4 py-4 text-gray-500">
                                            {item.treatments?.map((treat: any, i: number) => (
                                                <p key={i}>
                                                    {treat.name} - Rs.{treat.price}
                                                </p>
                                            ))}
                                        </td>

                                        <td className="px-4 py-4">
                                            <span className="px-3 py-1 rounded-full text-sm font-semibold">
                                                {item.amount}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    <div className="flex justify-center items-center gap-3 mt-6">
                        <button
                            className="px-3 py-1 border rounded-lg text-gray-600 disabled:opacity-40"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Prev
                        </button>

                        <span className="text-sm text-gray-500">
                            Page {currentPage} of {totalPages || 1}
                        </span>

                        <button
                            className="px-3 py-1 border rounded-lg text-gray-600 disabled:opacity-40"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>

                {/* MOBILE */}
                <div className="md:hidden flex flex-col gap-4">
                    {patientData?.history?.length === 0 ? (
                        <p className="text-center text-gray-400">
                            No appointments found
                        </p>
                    ) : (
                        currentHistory.map((item: any, index: number) => (
                            <div
                                key={index}
                                className="bg-white p-4 rounded-xl shadow-md flex flex-col gap-3"
                            >
                                <div className="flex justify-between items-center font-semibold">
                                    <h2>
                                        {item?.doctorId?.firstName} {item?.doctorId?.lastName}
                                    </h2>
                                    <span className="px-2 py-1 rounded-full text-xs font-semibold">
                                        {item?.appointmentId?.dateTime}
                                    </span>
                                </div>

                                <div className="font-semibold">
                                    {item.treatments?.map((treat: any, i: number) => (
                                        <p key={i}>
                                            {treat.name} - Rs.{treat.price}
                                        </p>
                                    ))}
                                </div>

                                <p className="text-gray-500 text-sm">{item.amount}</p>
                            </div>
                        ))
                    )}
                    <div className="flex justify-center items-center gap-3 mt-6">
                        <button
                            className="px-3 py-1 border rounded-lg text-gray-600 disabled:opacity-40"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Prev
                        </button>

                        <span className="text-sm text-gray-500">
                            Page {currentPage} of {totalPages || 1}
                        </span>

                        <button
                            className="px-3 py-1 border rounded-lg text-gray-600 disabled:opacity-40"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
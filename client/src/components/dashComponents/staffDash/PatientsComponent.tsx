import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PatientsComponent = ({ data }: any) => {

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;
    const navigate = useNavigate();

    const filteredAppointments = data?.filter((item: any) => {
        const searchText = search.toLowerCase();

        return (
            (item.firstName ?? "").toLowerCase().includes(searchText) ||
            (item.lastName ?? "").toLowerCase().includes(searchText) ||
            (item.address ?? "").toLowerCase().includes(searchText) ||
            (item.lastVisitDate
                ? new Date(item.lastVisitDate)
                    .toLocaleDateString("en-GB")
                    .toLowerCase()
                    .includes(searchText)
                : false)
        );
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

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                    <div className="relative w-full lg:w-1/3">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                        <input
                            type="text"
                            placeholder="Search by patient name, address or date..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-700 shadow-sm
                focus:outline-none focus:ring-2 focus:ring-[#2596be] focus:border-[#2596be] transition"
                        />
                    </div>
                </div>
            </div>

            <p className="text-sm text-gray-400 mb-2">
                Showing {filteredAppointments?.length < 0 ? "0" : filteredAppointments?.length} results
            </p>

            <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Patient</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"> Address</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Last Appointment</th>
                            <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Total Appointments</th>
                            <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Action</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {filteredAppointments.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-12 text-center text-gray-400">
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="text-4xl">👥</span>
                                        <p className="font-semibold text-gray-500"> No patients found </p>
                                        <p className="text-sm"> Try searching with different keywords.</p>
                                    </div>
                                </td>
                            </tr>

                        ) : (

                            filteredAppointments.map((item: any, index: number) => (
                                <tr key={index} className="hover:bg-sky-50 transition-colors duration-200">

                                    <td className="px-6 py-5">
                                        <div className="font-semibold text-gray-800">{item.firstName} {item.lastName}</div>
                                    </td>

                                    <td className="px-6 py-5">
                                        <div className="text-gray-700 max-w-sm truncate">{item.address}</div>
                                    </td>

                                    <td className="px-6 py-5">
                                        <div className="font-medium text-gray-800">
                                            {new Date(item.lastVisitDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", })}
                                        </div>
                                    </td>

                                    <td className="px-6 py-5 text-center">
                                        <span className="inline-flex items-center justify-center min-w-[42px] px-3 py-1 rounded-full bg-[#2596be]/10 text-[#2596be] text-sm font-semibold">{item.totalCompleted}</span>
                                    </td>

                                    <td className="px-6 py-5">
                                        <div className="flex justify-center">
                                            <button onClick={() => navigate(`/patients/${item.userId}`)} className="px-4 py-2 rounded-xl border border-[#2596be] text-[#2596be] text-sm font-medium hover:bg-[#2596be] hover:text-white transition">
                                                View Details
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

            {/*  Mobile Cards */}

            <div className="md:hidden flex flex-col gap-4 mt-5">
                {filteredAppointments.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-4xl">👥</span>
                            <h3 className="font-semibold text-gray-600"> No patients found</h3>
                            <p className="text-sm text-gray-400"> Try searching with different keywords. </p>
                        </div>
                    </div>

                ) : (

                    filteredAppointments.map((item: any, index: number) => (
                        <div key={index} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-gray-400">Patient</p>
                                    <h3 className="font-semibold text-gray-800 text-lg">{item.firstName} {item.lastName}</h3>
                                </div>
                                <span className="inline-flex items-center justify-center min-w-[42px] px-3 py-1 rounded-full bg-[#2596be]/10 text-[#2596be] text-sm font-semibold">{item.totalCompleted}</span>
                            </div>

                            <div className="mb-4">
                                <p className="text-xs uppercase tracking-wide text-gray-400">Address</p>
                                <p className="text-gray-700 font-medium">{item.address}</p>
                            </div>

                            <div className="mb-5">
                                <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Last Appointment</p>
                                <p className="font-medium text-gray-800">
                                    {new Date(item.lastVisitDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", })}
                                </p>
                            </div>

                            <button
                                onClick={() => navigate(`/patients/${item.userId}`)}
                                className="w-full py-2.5 rounded-xl border border-[#2596be] text-[#2596be] font-medium hover:bg-[#2596be] hover:text-white transition"
                            >
                                View Details
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
    );
};

export default PatientsComponent;
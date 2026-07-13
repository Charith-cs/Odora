import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PatientsComponent = ({data}:any) => {

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;
    const navigate = useNavigate();

    const filteredAppointments = data?.filter((item:any) => {
        const matchesSearch =
            item.firstName.toLowerCase().includes(search.toLowerCase()) ||
            item.lastName.toLowerCase().includes(search.toLowerCase()) ||
            item.date.toLowerCase().includes(search.toLowerCase());

        return matchesSearch;
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
                                placeholder="Search by patient name, address, date..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                            />
                            <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
                        </div>

                    </div>

                    <p className="text-sm text-gray-400 mb-2">
                        Showing {filteredAppointments?.length < 0 ? "0" : filteredAppointments?.length } results
                    </p>

                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full border-separate border-spacing-y-3">
                            <thead>
                                <tr className="text-left text-gray-500 text-sm">
                                    <th className="px-4">Patient</th>
                                    <th className="px-4">Address</th>
                                    <th className="px-4"> Last Appointment</th>
                                    <th className="px-4">Total Appointments</th>
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
                                    filteredAppointments.map((item:any, index:any) => (
                                        <tr
                                            key={index}
                                            className="bg-white shadow-md rounded-xl hover:shadow-lg transition"
                                        >
                                            <td className="px-4 py-4 font-semibold">{item.firstName + " " + item.lastName}</td>
                                            <td className="px-4 py-4 ">{item.address}</td>
                                            <td className="px-4 py-4 text-gray-500">{item.lastVisitDate}</td>

                                            <td className="px-4 py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-semibold`}
                                                >
                                                    {item.totalCompleted}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4">
                                                <button onClick={()=>navigate(`/patients/${item.userId}`)} className="px-3 py-1 rounded-lg border text-gray-600 hover:text-sky-500 hover:border-sky-500 transition">
                                                    See More..
                                                </button>
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
                    <div className="md:hidden flex flex-col gap-4">
                        {filteredAppointments.length === 0 ? (
                            <p className="text-center text-gray-400">
                                No appointments found
                            </p>
                        ) : (
                            filteredAppointments.map((item:any, index:any) => (
                                <div
                                    key={index}
                                    className="bg-white p-4 rounded-xl shadow-md flex flex-col gap-3"
                                >
                                    <div className="flex justify-between items-center font-semibold">
                                        <h2>{item.firstName + " " + item.lastName}</h2>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-semibold `}
                                        >
                                            {item.totalCompleted}
                                        </span>
                                    </div>

                                    <div className="font-semibold">{item.address}</div>

                                    <p className="text-gray-500 text-sm">{item.lastVisitDate}</p>

                                    <button onClick={()=>navigate(`/patients/${item.userId}`)} className="flex-1 px-3 py-1 rounded-lg border text-gray-600 hover:text-sky-500 transition">
                                        See More..
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
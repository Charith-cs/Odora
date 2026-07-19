import { Link, useNavigate } from "react-router-dom";
import type { StatusType } from "../../../../types/types";
import { statusStyles } from "../../../../types/constants";

const UpComming = ({ data }: any) => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "null");
    const navigate = useNavigate();

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 gap-6">
                <Link to={`/my_appointment/${currentUser._id}`}>
                    <div className="group bg-white rounded-3xl border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-5 sm:p-6">

                        {/* Header */}

                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                            <div className="flex items-center gap-4 flex-1">

                                <img
                                    src={data?.img ? data?.img : "/public/userdash/user.png"}
                                    alt="doctor"
                                    className="w-16 h-16 rounded-2xl object-cover border border-gray-200 shadow-sm group-hover:scale-105 transition-all duration-300"
                                />

                                <div>

                                    <h2 className="text-xl font-bold">
                                        Dr. {data?.firstName} {data?.lastName}
                                    </h2>

                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {data?.specialization?.slice(0, 2).map((s: string, i: number) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1 rounded-full bg-cyan-50 text-[#2596be] text-xs font-medium"
                                            >
                                                {s}
                                            </span>
                                        ))}
                                    </div>

                                </div>

                            </div>

                            <div className={`inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-semibold ${statusStyles[data?.status as StatusType]}`}>
                                {data?.status}
                            </div>

                        </div>

                        {/* Appointment */}

                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mt-6">

                            <div className="flex items-center gap-3">
                                <img
                                    src="./userDash/appointment.png"
                                    alt=""
                                    className="w-5 h-5"
                                />

                                <p className="font-semibold text-gray-700">
                                    {data?.dateTime?.slice(0, 10)}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 w-full lg:w-auto">

                                <button
                                    onClick={() => navigate(`/my_appointment/${currentUser._id}`)}
                                    className="px-5 py-2.5 rounded-2xl border border-[#2596be] text-[#2596be] font-semibold hover:bg-[#2596be] hover:text-white transition-all duration-300"
                                >
                                    Reschedule
                                </button>

                                <button
                                    onClick={() => navigate(`/my_appointment/${currentUser._id}`)}
                                    className="px-5 py-2.5 rounded-2xl border border-red-400 text-red-500 font-semibold hover:bg-red-500 hover:text-white transition-all duration-300"
                                >
                                    Cancel
                                </button>

                            </div>

                        </div>

                        <hr className="my-6 border-gray-200" />

                        <div className="w-full flex items-center justify-center rounded-2xl bg-[#2596be] text-white font-semibold py-3 hover:bg-[#1d7fa3] transition-all duration-300">
                            Explore
                        </div>

                    </div>
                </Link>
            </div>
        </div>
    );
};

export default UpComming;
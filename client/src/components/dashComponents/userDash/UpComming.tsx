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
                    <div className="group rounded-2xl bg-white h-full w-full shadow-md p-4 flex flex-col hover:shadow-xl hover:-translate-y-1 transition duration-300">

                        <div className="flex justify-between items-center">
                            <div className="flex gap-8">
                                <img src={data?.img ? data?.img : "/public/userdash/user.png"} alt="" className="w-16 h-16 mb-4 group-hover:scale-110 transition" />

                                <h1 className="text-xl font-semibold">
                                    Dr. {data?.firstName} {data?.lastName}
                                    <br />
                                    {data?.specialization?.slice(0, 2).map((s: string, i: number) => (
                                        <span key={i} className="text-sm text-gray-500 mr-2">{s}</span>
                                    ))}
                                </h1>
                            </div>

                            <div className={`w-1/5 text-center ${statusStyles[data[0]?.status as StatusType]} font-semibold`}>
                                {data?.status}
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="flex gap-5 items-center">
                                <img src="./userDash/appointment.png" alt="" className="w-5 h-5 ml-2" />
                                <p className="font-bold text-sm">
                                    {data?.dateTime?.slice(0, 10)}
                                </p>
                            </div>

                            <div className="flex p-2 gap-2 w-2/5">
                                <button onClick={()=>navigate(`/my_appointment/${currentUser._id}`)} className="w-1/2 border border-gray-500 hover:text-sky-500 hover:border-sky-600 p-2 rounded-xl text-gray-500 font-semibold">
                                    Reschedule
                                </button>
                                <button onClick={()=>navigate(`/my_appointment/${currentUser._id}`)} className="w-1/2 border border-gray-500 hover:text-red-500 hover:border-red-600 p-2 rounded-xl text-gray-500 font-semibold">
                                    Cancel
                                </button>
                            </div>
                        </div>

                        <hr className="my-3" />

                        <div className="flex items-center justify-center text-center font-semibold w-full mt-5 rounded-xl p-3 border border-gray-500 text-gray-500 hover:text-green-500 hover:border-green-600">
                            Explore
                        </div>

                    </div>
                </Link>
            </div>
        </div>
    );
};

export default UpComming
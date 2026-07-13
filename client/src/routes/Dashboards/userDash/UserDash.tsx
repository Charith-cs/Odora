import { Link, useNavigate } from "react-router-dom";
import DashCard from "../../../components/dashComponents/userDash/DashCard.tsx";
import UpComming from "../../../components/dashComponents/userDash/UpComming.tsx";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../context/AuthContext.tsx";
import type { CardType } from "../../../../types/types.ts";
import API from "../../../../api/axios.ts";
import toast from "react-hot-toast";

const UserDash = () => {

    const [notify, setNotify] = useState(false);
    const [checked, setChecked] = useState(false);
    const [cardData, setCardData] = useState<any>(null);
    const [upcomming, setUpcomming] = useState<any>(null);
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem("user") || "null");

    const handleLogout = () => {
        try {
            auth?.logout();
            navigate("/");
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        const fetchCardData = async () => {
            try {
                const res = await API.get(`/dash/card/${currentUser._id}`)
                setCardData(res.data.appointment);
            } catch (err: any) {
                toast.error(err?.response?.data?.message || "Oops! Something went wrong");
            }
        }
        fetchCardData();
    }, [currentUser._id]);

    useEffect(() => {
        const Recent = async () => {
            try {
                const res = await API.get(`/appointment/${currentUser._id}`)
                setUpcomming(res.data.appointment);
            } catch (err) {
                toast.error("Oops! Something went wrong");
            }
        }
        Recent();
    }, [currentUser._id]);

    const cardDetails: CardType[] = [
        { img: "./userDash/calendar.png", desc: "Upcomming Appoinments", subDesc: cardData?.upcomming, color: "bg-blue-600" },
        { img: "./userDash/checked.png", desc: "Completed Appointments", subDesc: cardData?.completed, color: "bg-green-600" },
        { img: "./userDash/coin.png", desc: "Rs: " + cardData?.totalPayments + ".00", subDesc: "Total Payments", color: "bg-yellow-600" },
        { img: "./userDash/nextDay.png", desc: "Next Visit Date", subDesc: cardData?.nextDay?.slice(0, 10) ?? "--", color: "bg-teal-600" }
    ];


    return (
        <div className="mt-6  grid grid-cols-1 md:grid-cols-[1fr_4fr] w-full ">
            <div className=" hidden md:flex  flex-col gap-10  h-full sticky left-0 text-center ">
                <Link to="/" className=" flex gap-8 mt-7 items-center cursor-pointer  p-2 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 hover:scale-105 transition duration-300 ease-in-out"><img src="./userDash/home.png" alt="" className=" w-5 h-5 ml-5" />Home</Link>
                <Link to="/search?q=clinic" className=" flex gap-8 items-center cursor-pointer  p-2 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 hover:scale-105 transition duration-300 ease-in-out"><img src="./userDash/clinic.png" alt="dashimg" className=" w-5 h-5 ml-5" />Clinic</Link>
                <Link to="/search?q=doctor" className=" flex gap-8 items-center cursor-pointer  p-2 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 hover:scale-105 transition duration-300 ease-in-out"><img src="./userDash/doctor.png" alt="dashimg" className=" w-5 h-5 ml-5" />Doctors</Link>
                <Link to={`/my_appointment/${currentUser._id}`} className=" flex gap-8 items-center cursor-pointer p-2 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 hover:scale-105 transition duration-300 ease-in-out"><img src="./userDash/appointment.png" alt="dashimg" className=" w-5 h-5 ml-5" />Appointments</Link>
                <Link to="/my_profile" className=" flex gap-8 items-center cursor-pointer p-2 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 hover:scale-105 transition duration-300 ease-in-out"><img src="./userDash/profile.png" alt="dashimg" className=" w-5 h-5 ml-5" />Profile</Link>
                <div onClick={handleLogout} className=" flex gap-8 mb-7 items-center cursor-pointer p-2 rounded-xl shadow-md hover:shadow-xl hover:shadow-red-200 hover:-translate-y-1 hover:scale-105 transition duration-300 ease-in-out"><img src="./userDash/logout.png" alt="dashimg" className=" w-5 h-5 ml-5" />Logout</div>
            </div>
            <div className=" flex flex-col ml-8 mb-8 mt-7 rounded-xl p-4 backdrop-blur-md bg-gray-700/20 border border-white/10 shadow-lg shadow-black/10 hover:shadow-xl transition-all duration-300 ">
                <div className=" flex justify-between  p-2">
                    <div className="">
                        <h1 className=" text-3xl font-semibold">Hello, {currentUser.firstName + " " + currentUser.lastName} 👋</h1>
                        <span className=" text-sm text-gray-500">PID : {currentUser._id}</span>
                    </div>
                    <div className=" flex gap-5 items-center relative ">
                        <img src={notify === false ? `./userDash/bell.png` : `./userDash/notification.png`} onClick={() => { setChecked(!checked) }} alt="userimg" className=" w-7 h-7 object-cover cursor-pointer " />
                        <Link to="/my_profile">
                            <img src={currentUser?.img ? currentUser.img : "/userDash/user.png"} alt="userimg" className=" w-16 h-16 object-cover rounded-xl" />
                        </Link>
                        {checked === true && (
                            <div className="absolute top-20 right-0 w-[350px] p-4 rounded-xl bg-white shadow-lg transition duration-300 ease-in-out z-50">
                                <div className="flex flex-col gap-4">
                                    <h1 className="font-semibold">Sakuki Dental Hospital</h1>
                                    <p>Your appointment ID:123 has been approved! Please be prepared for the scheduled day.</p>
                                    <p className="text-sm text-gray-500">12 min ago</p>
                                    <hr />
                                </div>
                            </div>
                        )}

                    </div>
                </div>
                <div className=" flex mt-8 items-center justify-evenly ">
                    <DashCard cardDetails={cardDetails} />
                </div>
                <div className=" flex flex-col gap-8 w-full mt-4">
                    <h1 className=" text-2xl font-semibold mt-5">Recent Appointment</h1>
                    {upcomming ? (
                        <UpComming data={upcomming} />
                    ) : (
                        "Let's book an appointment with Odora!"
                    )}
                </div>
            </div>
        </div>
    )
}

export default UserDash
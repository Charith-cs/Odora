import { Link } from "react-router-dom";
import DashCard from "../../../components/dashComponents/userDash/DashCard.tsx";
import UpComming from "../../../components/dashComponents/userDash/UpComming.tsx";
import { useEffect, useState } from "react";
import type { CardType } from "../../../../types/types.ts";
import API from "../../../../api/axios.ts";
import toast from "react-hot-toast";

const UserDash = () => {

    const [notify, setNotify] = useState(false);
    const [checked, setChecked] = useState(false);
    const [cardData, setCardData] = useState<any>(null);
    const [upcomming, setUpcomming] = useState<any>(null);
    const currentUser = JSON.parse(localStorage.getItem("user") || "null");


    useEffect(() => {
        const fetchCardData = async () => {
            try {
                const res = await API.get(`/dash/card/${currentUser._id}`)
                setCardData(res.data);
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
                console.error(err);
            }
        }
        Recent();
    }, [currentUser._id]);

    console.log(cardData)

    const cardDetails: CardType[] = [
        { img: "./userDash/calendar.png", desc: "Upcomming Appoinments", subDesc: cardData?.upcomming, color: "bg-blue-600" },
        { img: "./userDash/checked.png", desc: "Completed Appointments", subDesc: cardData?.completed, color: "bg-green-600" },
        { img: "./userDash/coin.png", desc: "Rs: " + cardData?.totalPayments + ".00", subDesc: "Total Payments", color: "bg-yellow-600" },
        { img: "./userDash/nextDay.png", desc: "Next Visit Date", subDesc: cardData?.nextDay?.slice(0, 10) ?? "--", color: "bg-teal-600" }
    ];


    return (
        <div className=" flex flex-col mx-4 md:ml-8 mb-8 rounded-3xl bg-white border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 p-6 sm:p-8 ">
            <div className=" flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="">
                    <h1 className=" text-2xl md:text-3xl font-bold text-[#2596be]">Hello, {currentUser.firstName + " " + currentUser.lastName} 👋</h1>
                    <span className=" text-sm text-gray-500 mt-2 block">PID : {currentUser._id}</span>
                </div>
                <div className=" flex gap-4 items-center relative self-start md:self-auto ">
                    <img src={notify === false ? `./userDash/bell.png` : `./userDash/notification.png`} onClick={() => { setChecked(!checked) }} alt="userimg" className=" w-7 h-7 object-cover cursor-pointer " />
                    <Link to="/my_profile">
                        <img src={currentUser?.img ? currentUser.img : "/userDash/user.png"} alt="userimg" className=" w-16 h-16 object-cover rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition" />
                    </Link>
                    {checked === true && (
                        <div className=" absolute top-20 right-0 w-[320px] sm:w-[360px] rounded-3xl border border-gray-100 bg-white shadow-2xl overflow-hidden z-50 animate-fadeIn">
                            <div className="p-6">

                                <div className="flex items-center gap-3 mb-5">

                                    <div className="w-10 h-10 rounded-2xl bg-[#2596be]/10 flex items-center justify-center">🔔</div>
                                    <div>
                                        <h2 className="font-bold text-[#2596be]">Notifications</h2>
                                        <p className="text-sm text-gray-500"> Latest update</p>
                                    </div>
                                </div>

                                <div className="rounded-2xl bg-gray-50 p-4">
                                    <h3 className="font-semibold">Sakuki Dental Hospital</h3>
                                    <p className="text-gray-600 mt-2 leading-7">Your appointment ID:123 has been approved! Please be prepared for your scheduled visit.</p>
                                    <p className="text-xs text-gray-400 mt-4">12 min ago</p>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
            <div className=" flex mt-10 w-full justify-center ">
                <DashCard cardDetails={cardDetails} />
            </div>
            <div className=" mt-10 rounded-3xl border border-gray-100 bg-gray-50 p-6">
                <h1 className=" text-2xl font-bold text-[#2596be] mb-6">Recent Appointment</h1>
                {upcomming ? (
                    <UpComming data={upcomming} />
                ) : (
                    <div className=" rounded-3xl border-2 border-dashed border-gray-200 bg-white py-16 px-8 text-center">
                        <img src="/icons/empty.png" alt="No Appointments" className="w-16 h-16 mx-auto mb-6 opacity-70" />
                        <h2 className="text-xl font-bold text-[#2596be]">No Upcoming Appointments</h2>
                        <p className="text-gray-500 mt-3">Let's book your first appointment with Odora.</p>

                        <Link to="/search?q=doctor"
                            className=" inline-flex mt-8 rounded-2xl bg-[#2596be] px-6 py-3 text-white font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-300">Find a Doctor</Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default UserDash
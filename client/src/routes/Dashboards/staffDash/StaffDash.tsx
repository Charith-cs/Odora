import { Link } from 'react-router-dom'
import DashCard from '../../../components/dashComponents/userDash/DashCard'
import Appointments from './Appointments'
import { useEffect, useState } from 'react'
import type { CardType } from '../../../../types/types';
import API from '../../../../api/axios';
import { toast } from 'react-hot-toast';

const StaffDash = () => {

    const [notify, setNotify] = useState(false);
    const [checked, setChecked] = useState(false);
    const currentUser = JSON.parse(localStorage.getItem("user") || "null");
    const [appointments, setAppointments] = useState<[]>([]);
    const [cardData, setCardData] = useState<any>(null);


    useEffect(() => {
        const fetchCardData = async () => {
            try {
                const res = await API.get(`/dash/card/${currentUser._id}`);
                setCardData(res.data);
            } catch (err: any) {
                toast.error(err?.response?.data?.message || "Oops! Something went wrong");
            }
        }
        fetchCardData();
    }, [currentUser._id]);

    const cardDetails: CardType[] = [
        { img: "./userDash/calendar.png", desc: "Pending Appoinments", subDesc: cardData?.pending, color: "bg-orange-600" },
        { img: "./userDash/checked.png", desc: "Completed Appointments", subDesc: cardData?.lastMonthCompleted, color: "bg-green-600" },
        { img: "./userDash/patient (2).png", desc: "Today Total", subDesc: cardData?.todayTotal, color: "bg-blue-600" },
        { img: "./userDash/nextDay.png", desc: "Completed Bills", subDesc: cardData?.completedBills, color: "bg-teal-600" }
    ];


    const fetchAppointments = async () => {
        try {
            const res = await API.get(`appointment/get/${currentUser._id}`);
            setAppointments(res.data);
        } catch (err) {
            console.error("Oops! something went wrong");
        }
    }

    useEffect(() => {
        fetchAppointments();
    }, [currentUser._id]);

    return (
        <div className=" flex flex-col mx-4 md:ml-8 mb-8 rounded-3xl bg-white border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 p-6 sm:p-8 ">
            <div className=" flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="">
                    <h1 className=" text-2xl md:text-3xl font-bold text-[#2596be]">Hello, {currentUser.firstName + " " + currentUser.lastName} 👋</h1>
                    <span className=" text-sm text-gray-500 mt-2 block">{currentUser.email}</span>
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
            <div className=" flex mt-8 items-center justify-evenly ">
                <DashCard cardDetails={cardDetails} />
            </div>
            <div className="mt-8 rounded-3xl border border-gray-100 bg-white p-5 shadow-md md:p-6">

                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <h2 className="text-2xl font-bold text-gray-800">
                        Today Appointments
                    </h2>

                    <Link
                        to="/walk_in_appointment"
                        className=" inline-flex items-center justify-center rounded-2xl border border-[#2596be] px-5 py-3  text-sm font-semibold text-[#2596be] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2596be] hover:text-white hover:shadow-md">
                        + Add Walk-In Appointment
                    </Link>

                </div>

                <Appointments
                    data={appointments}
                    refreshAppointments={fetchAppointments}
                />

            </div>
        </div>

    )
}

export default StaffDash
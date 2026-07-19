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
        <div className=" flex flex-col ml-8">
            <div className=" flex justify-between  p-2">
                <div className="">
                    <h1 className=" text-3xl font-semibold">Hello, {currentUser?.firstName + " " + currentUser?.lastName} 👋</h1>
                    <span className=" text-sm text-gray-500">{currentUser?.email}</span>
                </div>
                <div className=" flex gap-5 items-center relative ">
                    <img src={notify === false ? `./userDash/bell.png` : `./userDash/notification.png`} onClick={() => { setChecked(!checked) }} alt="userimg" className=" w-7 h-7 object-cover cursor-pointer " />
                    <img src={currentUser?.img ? currentUser?.img : "./userDash/user.png"} alt="userimg" className=" w-16 h-16 object-cover rounded-full" />

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
            <div className=" flex flex-col w-full mt-8 ">
                <div className=" flex items-center justify-between mt-4">
                    <h1 className=" text-xl font font-semibold">Today Appointments</h1>
                    <Link to="/walk_in_appointment" className="px-3 py-1  rounded-lg border border-red-500 text-red-500 hover:text-white hover:bg-red-500 transition">Add Walk-In-Appointment</Link>
                </div>
                <Appointments data={appointments} refreshAppointments={fetchAppointments} />
            </div>
        </div>

    )
}

export default StaffDash
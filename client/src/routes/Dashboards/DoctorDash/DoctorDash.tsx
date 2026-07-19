import { Link, useNavigate } from 'react-router-dom'
import DashCard from '../../../components/dashComponents/userDash/DashCard'
import { useContext, useEffect, useState } from 'react'
import Charts from '../../../components/dashComponents/doctorDash/Charts'
import { doctorConfig } from '../../../../types/constants'
import { AuthContext } from '../../../../context/AuthContext'
import type { CardType, MyData } from '../../../../types/types'
import API from '../../../../api/axios'
import toast from 'react-hot-toast'

const DoctorDash = () => {

    const [notify, setNotify] = useState(false);
    const [checked, setChecked] = useState(false);
    const [cardData, setCardData] = useState<any>(null);
    const [cData, setCData] = useState<[]>([]);
    const currentUser = JSON.parse(localStorage.getItem("user") || "null");

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

        useEffect(() => {
        const fetchCData = async () => {
            try {
                const chartData = await API.get(`/dash/data/${currentUser._id}`)
                console.log(chartData.data)
                setCData(chartData.data.chartData);
            } catch (err: any) {
                toast.error(err?.response?.data?.message || "Oops! Something went wrong");
            }
        }
        fetchCData();
    }, [currentUser._id]);

   
        const cardDetails: CardType[] = [
            { img: "./userDash/calendar.png", desc: "Upcomming Appoinments", subDesc: cardData?.upcomming, color: "bg-blue-600" },
            { img: "./userDash/checked.png", desc: "Completed Appointments", subDesc: cardData?.completed, color: "bg-green-600" },
            { img: "./userDash/patient (2).png", desc:"Last month patients"  , subDesc: cardData?.lastMonthPatients, color: "bg-teal-600" },
            { img: "./userDash/nextDay.png", desc: "Today appointments", subDesc: cardData?.todaySessions, color: "bg-teal-600" }
        ];

    return (
            <div className=" flex flex-col ml-8 mb-8  rounded-xl p-4 backdrop-blur-md bg-green-700/20 border border-white/10 shadow-lg shadow-black/10 hover:shadow-xl transition-all duration-300">
                <div className=" flex justify-between  p-2">
                    <div className="">
                        <h1 className=" text-3xl font-semibold">Hello, Dr.{currentUser.firstName + " " + currentUser.lastName} 👋</h1>
                        <span className=" text-sm text-gray-500">{ }</span>
                    </div>
                    <div className=" flex gap-5 items-center relative ">
                        <img src={notify === false ? `./userDash/bell.png` : `./userDash/notification.png`} onClick={() => { setChecked(!checked) }} alt="userimg" className=" w-7 h-7 object-cover cursor-pointer " />
                        <img src={currentUser.img ? currentUser.img : "./userDash/user.png"} alt="userimg" className=" w-16 h-16 object-cover rounded-full" />

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
                    <h1 className=" text-xl font-semibold my-4">Number of monthly patients</h1>
                    <Charts data={cData as MyData[]} config={doctorConfig} />
                </div>
            </div>
    )
}

export default DoctorDash
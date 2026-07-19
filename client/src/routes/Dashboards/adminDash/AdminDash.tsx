import { useEffect, useState } from 'react'
import DashCard from '../../../components/dashComponents/userDash/DashCard';
import Charts from '../../../components/dashComponents/doctorDash/Charts';
import { Link } from 'react-router-dom';
import { adminConfig } from '../../../../types/constants';
import API from '../../../../api/axios';
import { toast } from 'react-hot-toast';
import type { adminCardType, AdminchartData } from '../../../../types/types';


const AdminDash = () => {

    const currentUser = JSON.parse(localStorage.getItem("user") || "null");
    const [notify, setNotify] = useState(false);
    const [checked, setChecked] = useState(false);
    const [cardData, setCardData] = useState<any>(null);
    const [cData, setCData] = useState<[]>([]);


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
                const chartData = await API.get(`/dash/rev_data/${currentUser._id}`)
                console.log(chartData.data)
                setCData(chartData.data.chartData);
            } catch (err: any) {
                toast.error(err?.response?.data?.message || "Oops! Something went wrong");
            }
        }
        fetchCData();
    }, [currentUser._id]);


    const adminCardDetails: adminCardType[] = [
        { img: "./userDash/calendar.png", desc: "Upcomming Appoinments", subDesc: cardData?.upcomming, color: "bg-blue-600" },
        { img: "./userDash/checked.png", desc: "Completed Appoinments", subDesc: cardData?.completed, color: "bg-green-600" },
        { img: "./userDash/money-back.png", desc: "Canceled Appoinments", subDesc: cardData?.canceled, color: "bg-red-600" },
        { img: "./userDash/coin.png", desc: "LKR " + cardData?.totalAmount + ".00", subDesc: "Pending Bills", color: "bg-orange-500" },
        { img: "./userDash/payment-done.png", desc: "LKR " + cardData?.paidTotalAmount + ".00", subDesc: "Completed Bills", color: "bg-teal-500" },
        { img: "./userDash/medical-team.png", desc: cardData?.registeredDoctors + "+", subDesc: "Registed Doctors", color: "bg-lime-600" },
        { img: "./userDash/growth.png", desc: "LKR " + cardData?.revenueAmount + ".00", subDesc: "Last moth revenue", color: "bg-sky-600" },
        { img: "./userDash/group.png", desc: cardData?.registeredUsers + "+", subDesc: "Registed Users", color: "bg-rose-600" },
    ];

    return (
            <div className=" flex flex-col ml-8">
                <div className=" flex justify-between  p-2">
                    <div className="">
                        <h1 className=" text-3xl font-semibold">Hello, {currentUser.firstName + " " + currentUser.lastName} 👋</h1>
                        <span className=" text-sm text-gray-500">Management</span>
                    </div>
                    <div className=" flex gap-5 items-center relative ">
                        <img src={notify === false ? `./userDash/bell.png` : `./userDash/notification.png`} onClick={() => { setChecked(!checked) }} alt="userimg" className=" w-7 h-7 object-cover cursor-pointer " />
                        <img src={currentUser.img ? currentUser.img : "./userDash/user.png"} alt="userimg" className=" w-16 h-16 object-cover rounded-xl" />

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
                    <DashCard cardDetails={adminCardDetails} />
                </div>
                <div className=" flex flex-col w-full mt-8 ">
                    <h1 className=" text-xl font-semibold my-4">Monthly Revenue</h1>
                    <Charts data={cData as AdminchartData[]} config={adminConfig} />
                </div>
            </div>

    )
}

export default AdminDash
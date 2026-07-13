import { useContext, useEffect, useState } from 'react'
import DashCard from '../../../components/dashComponents/userDash/DashCard';
import Charts from '../../../components/dashComponents/doctorDash/Charts';
import { Link, useNavigate } from 'react-router-dom';
import { adminConfig } from '../../../../types/constants';
import API from '../../../../api/axios';
import { toast } from 'react-hot-toast';
import type { adminCardType, AdminchartData } from '../../../../types/types';
import { AuthContext } from '../../../../context/AuthContext';

const AdminDash = () => {

    const currentUser = JSON.parse(localStorage.getItem("user") || "null");
    const [notify, setNotify] = useState(false);
    const [checked, setChecked] = useState(false);
    const [cardData, setCardData] = useState<any>(null);
    const [cData, setCData] = useState<[]>([]);
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

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

        const handleLogout = () => {
        try {
            auth?.logout();
            navigate("/");
        } catch (err) {
            console.log(err);
        }
    }


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
        <div className="mt-6 grid grid-cols-1 md:grid-cols-[1fr_4fr] w-full">
            <div className=" hidden md:flex  flex-col gap-10  h-full sticky left-0 text-center ">
                <Link to="/" className=" flex gap-8 mt-7 items-center cursor-pointer  p-2 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 hover:scale-105 transition duration-300 ease-in-out"><img src="./userDash/home.png" alt="" className=" w-5 h-5 ml-5" />Home</Link>
                <Link to="/user_setting" className=" flex gap-8 items-center cursor-pointer  p-2 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 hover:scale-105 transition duration-300 ease-in-out"><img src="./userDash/profile.png" alt="dashimg" className=" w-5 h-5 ml-5" />User</Link>
                <Link to="/doctor_setting" className=" flex gap-8 items-center cursor-pointer  p-2 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 hover:scale-105 transition duration-300 ease-in-out"><img src="./userDash/doctors.png" alt="dashimg" className=" w-5 h-5 ml-5" />Doctor</Link>
                <Link to="/staff_setting" className=" flex gap-8 items-center cursor-pointer p-2 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 hover:scale-105 transition duration-300 ease-in-out"><img src="./userDash/optimization.png" alt="dashimg" className=" w-5 h-5 ml-5" />Staff</Link>
                <Link to="/reports" className=" flex gap-8 items-center cursor-pointer p-2 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 hover:scale-105 transition duration-300 ease-in-out"><img src="./userDash/profit-report.png" alt="dashimg" className=" w-5 h-5 ml-5" />Analysis & Reports</Link>
                <button onClick={handleLogout} className=" flex gap-8 mb-7 items-center cursor-pointer p-2 rounded-xl shadow-md hover:shadow-xl hover:shadow-red-200 hover:-translate-y-1 hover:scale-105 transition duration-300 ease-in-out"><img src="./userDash/logout.png" alt="dashimg" className=" w-5 h-5 ml-5" />Logout</button>
            </div>
            <div className=" flex flex-col ml-8 mt-7">
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
        </div>
    )
}

export default AdminDash
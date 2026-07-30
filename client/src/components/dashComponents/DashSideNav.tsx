import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import type { DashNavType } from "../../../types/types.ts";
import { toast } from 'react-hot-toast';

const DashSideNav = () => {

    const [mobileMenu, setMobileMenu] = useState<any>(false);
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

    const RoleBasedDashNav: Record<"user" | "doctor" | "staff" | "admin", DashNavType[]> = {
        user: [
            {
                name: "Dashboard",
                path: "/user_dash",
                image: "../../../public/userDash/home.png",
            },
            {
                name: "Clinics",
                path: "/search?q=clinic",
                image: "../../../public/userDash/clinic.png",
            },
            {
                name: "Doctors",
                path: "/search?q=doctor",
                image: "../../../public/userDash/doctor.png",
            },
            {
                name: "My Appointments",
                path: `/my_appointment/${currentUser._id}`,
                image: "../../../public/userDash/appointment.png",
            },
            {
                name: "Profile",
                path: "/my_profile",
                image: "../../../public/userDash/profile.png",
            },
            {
                name: "Back to the Home",
                path: "/",
                image: "../../../public/userDash/left-arrow.png",
            },
        ],
        doctor: [
            {
                name: "Dashboard",
                path: "/doctor_dash",
                image: "../../../public/userDash/home.png",
            },
            {
                name: "My Appointments",
                path: "/doctor_appointments",
                image: "../../../public/userDash/appointment.png",
            },
            {
                name: "My Sessions",
                path: "/my_session",
                image: "../../../public/userDash/training.png",
            },
            {
                name: "Patients",
                path: "/patients",
                image: "../../../public/userDash/patient.png",
            },
            {
                name: "My Performance",
                path: "/my_performance",
                image: "../../../public/userDash/line-chart.png",
            },
            {
                name: "Join Request",
                path: "/join",
                image: "../../../public/userDash/meeting.png",
            },
            {
                name: "Profile",
                path: "/my_profile",
                image: "../../../public/userDash/profile.png",
            },
            {
                name: "Back to the Home",
                path: "/",
                image: "../../../public/userDash/left-arrow.png",
            },
        ],
        staff: [
            {
                name: "Dashboard",
                path: "/staff_dash",
                image: "../../../public/userDash/home.png",
            },
            {
                name: "Appointments",
                path: "/appointments",
                image: "../../../public/userDash/appointment.png",
            },
            {
                name: "Patients",
                path: "/patients",
                image: "../../../public/userDash/patient.png",
            },
            {
                name: "Billing and Payments",
                path: "/payment_list",
                image: "../../../public/userDash/invoice.png",
            },
            {
                name: "Back to the Home",
                path: "/",
                image: "../../../public/userDash/left-arrow.png",
            },
        ],
        admin: [
            {
                name: "Dashboard",
                path: "/admin_dash",
                image: "../../../public/userDash/home.png",
            },
            {
                name: "Users",
                path: "/user_setting",
                image: "../../../public/userDash/profile.png",
            },
            {
                name: "Doctors",
                path: "/doctor_setting",
                image: "../../../public/userDash/doctors.png",
            },
            {
                name: "Staff",
                path: "/staff_setting",
                image: "../../../public/userDash/optimization.png",
            },
            {
                name: "Analysis & Reports",
                path: "/reports",
                image: "../../../public/userDash/profit-report.png",
            },
            {
                name: "Profile",
                path: "/my_profile",
                image: "../../../public/userDash/profile.png",
            },
            {
                name: "Back to the Home",
                path: "/",
                image: "../../../public/userDash/left-arrow.png",
            },
        ]
    };
    const navItems = RoleBasedDashNav[currentUser.role as keyof typeof RoleBasedDashNav] || [];

    return (
        <div>
            {mobileMenu && (

                <div className="fixed inset-0 z-50 flex">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenu(false)} />
                    <div className=" relative w-72 h-full bg-white rounded-r-3xl shadow-2xl p-6 flex flex-col ">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-2xl font-bold text-[#2596be]"> Dashboard</h2>
                            <button onClick={() => setMobileMenu(false)} className=" text-2xl text-gray-500 hover:text-red-500 transition">✕</button>
                        </div>

                        <div className="flex flex-col gap-4">
                            {
                                navItems.map((item) => (
                                    <Link
                                        to={item.path}
                                        onClick={() => setMobileMenu(false)}
                                        className="flex items-center gap-4 p-4 rounded-2xl hover:bg-[#2596be] hover:text-white transition-all">
                                        <img src={item.image} className="w-5 h-5" />
                                        {item.name}
                                    </Link>
                                ))
                            }

                            {currentUser.role === "staff" &&
                                <button
                                    onClick={() => { toast("Please contact your Administrator to update your account!", { icon: '🚫' }) }}
                                    className=" flex items-center gap-4 p-4 rounded-2xl hover:bg-red-500 hover:text-white transition-all text-left ">
                                    <img src="../../../public/userDash/profile.png" className="w-5 h-5" />
                                    Profile
                                </button>
                            }


                            <button
                                onClick={() => {
                                    setMobileMenu(false);
                                    handleLogout();
                                }}
                                className=" flex items-center gap-4 p-4 rounded-2xl hover:bg-red-500 hover:text-white transition-all text-left ">
                                <img src="../../../public/userDash/logout.png" className="w-5 h-5" />
                                Logout
                            </button>

                        </div>
                    </div>
                </div>
            )}

            <div className="md:hidden flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100 shadow-sm">

                <button onClick={() => setMobileMenu(true)} className="p-2 rounded-xl hover:bg-gray-100 transition">
                    <div className=" w-6 h-6">☰</div>
                </button>

                <h1 className="text-xl font-bold text-[#2596be]">
                    Dashboard
                </h1>

            </div>

            <div className=" hidden md:flex flex-col gap-4 sticky top-24 h-fit bg-white rounded-3xl border border-gray-100 shadow-md p-5">
                {
                    navItems.map((item) => (
                        <Link to={item.path} className=" flex items-center gap-5 rounded-2xl px-5 py-4 font-medium text-gray-700 border border-gray-100 hover:bg-[#2596be] hover:text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300"><img src={item.image} alt="" className=" w-6 h-6" />{item.name}</Link>
                    ))
                }
                {currentUser.role === "staff" &&
                    <div
                        onClick={() => { toast("Please contact your Administrator to update your account!", { icon: '🚫' }) }}
                        className=" flex items-center gap-5 rounded-2xl px-5 py-4 font-medium text-gray-700 border border-gray-100 hover:bg-red-500 hover:text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                        <img src="../../../public/userDash/profile.png" alt="dashimg" className=" w-6 h-6" />Profile</div>
                }
                <div onClick={handleLogout} className=" flex items-center gap-5 rounded-2xl px-5 py-4 font-medium text-gray-700 border border-gray-100 hover:bg-red-500 hover:text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"><img src="../../../public/userDash/logout.png" alt="dashimg" className=" w-6 h-6" />Logout</div>
            </div>
        </div>
    )
}

export default DashSideNav

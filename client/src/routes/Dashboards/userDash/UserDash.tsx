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
    const [notifications, setNotifications] = useState<any[]>([]);
    const [readNotifications, setReadNotifications] = useState<string[]>([]);
    
    const [cardData, setCardData] = useState<any>(null);
    const [upcomming, setUpcomming] = useState<any>(null);

    const currentUser = JSON.parse(localStorage.getItem("user") || "null");
    const notificationStorageKey = currentUser?._id ? `readNotifications_${currentUser._id}`: "readNotifications_guest";

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await API.get(`/notification/user/${currentUser._id}`);
                setNotifications(res.data);
            } catch (err: any) {
                console.error(err?.response?.data?.message || "Failed to load notifications");
            }
        };
        fetchNotifications();
    }, [currentUser._id]);


    const unreadNotifications = notifications.filter((item) => !readNotifications.includes(item.id));
    const unreadCount = unreadNotifications.length;


    useEffect(() => {
        setNotify(unreadCount > 0);
    }, [unreadCount]);


    useEffect(() => {
        const storedReadNotifications = JSON.parse(localStorage.getItem(notificationStorageKey) || "[]");
        setReadNotifications(storedReadNotifications);
    }, [notificationStorageKey]);


    const handleNotificationRead = (notificationId: string) => {
        if (readNotifications.includes(notificationId)) {
            return;
        }
        const updated = [
            ...readNotifications,
            notificationId
        ];
        setReadNotifications(updated);
        localStorage.setItem(notificationStorageKey, JSON.stringify(updated));
    };

    const handleMarkAllRead = () => {

        const allIds = notifications.map(
            (item) => item.id
        );

        setReadNotifications(allIds);
        localStorage.setItem(notificationStorageKey, JSON.stringify(allIds));
    };


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

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setChecked(!checked)}
                            className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:border-[#2596be]/40 hover:shadow-md"
                        >
                            <img
                                src={
                                    unreadCount > 0
                                        ? "/userDash/notification.png"
                                        : "/userDash/bell.png"
                                }
                                alt="Notifications"
                                className="h-6 w-6 object-contain"
                            />

                            {unreadCount > 0 && (
                                <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </span>
                            )}

                        </button>
                    </div>

                    <Link to="/my_profile">
                        <img src={currentUser?.img ? currentUser.img : "/userDash/user.png"} alt="userimg" className=" w-16 h-16 object-cover rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition" />
                    </Link>

                    {checked && (

                        <div className=" fixed left-4 right-4 top-32 z-50 max-h-[70vh] overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl sm:absolute sm:left-auto sm:right-0 sm:top-16 sm:w-[390px] sm:max-h-none">
                            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#2596be]/10">🔔</div>
                                    <div>
                                        <h2 className="font-bold text-gray-800"> Notifications</h2>
                                        <p className="text-xs text-gray-400">{unreadCount} unread</p>
                                    </div>
                                </div>

                                {unreadCount > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleMarkAllRead}
                                        className="text-xs font-semibold text-[#2596be] hover:underline"
                                    >
                                        Mark all read
                                    </button>
                                )}
                            </div>

                            <div className="max-h-[400px] overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map((item) => {
                                        const isRead =readNotifications.includes(item.id);
                                        return (
                                            <button
                                                key={item.id}
                                                type="button"
                                                onClick={() =>
                                                    handleNotificationRead(item.id)
                                                }
                                                className={`relative w-full border-b border-gray-100 p-5 text-left transition-all duration-200 last:border-b-0 ${isRead
                                                        ? "bg-white hover:bg-gray-50"
                                                        : "bg-[#2596be]/5 hover:bg-[#2596be]/10"
                                                    }`}
                                            >
                                                <div className="flex gap-3">
                                                    {!isRead && (<div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#2596be]" />)}
                                                    <div className={isRead ? "pl-5" : ""}>
                                                        <div className="flex items-start justify-between gap-3">
                                                            <h3 className="font-semibold text-gray-800">{item.clinicName}</h3>

                                                            <span
                                                                className={`rounded-full px-2 py-1 text-[10px] font-semibold capitalize ${item.status === "approved"
                                                                        ? "bg-green-100 text-green-700"
                                                                        : item.status === "canceled"
                                                                            ? "bg-red-100 text-red-600"
                                                                            : item.status === "paid"
                                                                                ? "bg-blue-100 text-blue-700"
                                                                                : "bg-gray-100 text-gray-600"
                                                                    }`}
                                                            >
                                                                {item.status}
                                                            </span>
                                                        </div>

                                                        <p className="mt-2 text-sm leading-6 text-gray-600">{item.message}</p>
                                                        {item.doctorName && (
                                                            <p className="mt-2 text-xs font-medium text-gray-500">{item.doctorName}</p>
                                                        )}
                                                        <p className="mt-3 text-xs text-gray-400">{new Date(item.date).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })

                                ) : (
                                    <div className="px-6 py-12 text-center">
                                        <div className="mb-3 text-4xl">🔔</div>
                                        <h3 className="font-semibold text-gray-700">No Notifications</h3>
                                        <p className="mt-2 text-sm text-gray-400">You don't have any notifications yet.</p>
                                    </div>
                                )}
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
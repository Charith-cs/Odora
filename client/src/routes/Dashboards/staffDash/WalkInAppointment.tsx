import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { registerUser } from "../../../../services/authService";
import API from "../../../../api/axios";
import { useNavigate } from "react-router-dom";


const WalkInAppointment = () => {

    const [doctor, setDoctor] = useState("");
    const [doctorList, setDoctorList] = useState<any[]>([]);
    const [availableSessions, setAvailableSessions] = useState<any[]>([]);
    const currentUser = JSON.parse(localStorage.getItem("user") || "null");
    const navigate = useNavigate();
    const AC = 100;
    const [registeredUser, setRegisteredUser] = useState("");

    const userSchema = z.object({
        firstName: z.string().min(1, "First name is required").regex(/^[A-Za-z\s]+$/, "Only letters allowed"),
        lastName: z.string().min(1, "Last name is required").regex(/^[A-Za-z\s]+$/, "Only letters allowed"),
        email: z.string().min(1, "Email is required").email("Invalid email format"),
        gender: z.string().min(1, "Gender is required"),
        mobileNumber: z.string().min(1, "Mobile number is required").regex(/^07[0-9]{8}$/, "Invalid Sri Lankan number"),
        birthDay: z.string().min(1, "Birth date is required").refine(
            (date) => new Date(date) <= new Date(),
            { message: "Birth date cannot be in future" }
        ),
        address: z.string().min(1, "Address is required"),
        password: z.string().min(6, "Minimum 6 characters required"),
        role: z.literal("user"),
    });

    type FormData = z.infer<typeof userSchema>;

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            role: "user",
        },
    });

    const onSubmit = async (data: FormData) => {
        try {
            const res = await registerUser(data);
            toast.success(res.message);
            console.log(res.user._id);
            setRegisteredUser(res.user._id)
        } catch (err) {
            toast.error("Oops! Something went wrong");
        }
    };

    useEffect(() => {
        const fetchDoctorsSessions = async () => {
            try {
                const res = await API.get(`/clinic/doctors/${currentUser._id}`);
                setDoctorList(res.data.doctors);
            } catch (err) {
                toast.error("Oops! Something went wrong");
            }
        }
        fetchDoctorsSessions();
    }, [currentUser._id]);

    useEffect(() => {

        if (!doctor) return;

        const fetchAvailableSessions = async () => {
            try {
                const res = await API.get(`/doctor/available_session/${doctor}`);
                setAvailableSessions(res.data);
            } catch (err) {
                console.error("Oops! Something went wrong");
            }
        };

        fetchAvailableSessions();

    }, [doctor]);

    const handleBook = async (d: any) => {
        const dateTime = new Date(d.startDateTime);

        if (registeredUser === "") {
            toast.error("Plase register the user before booking!");
        } else {
            const data = {
                userId: registeredUser,
                doctorId: d.doctorId._id,
                clinicId: d.clinicId._id,
                sessionId: d._id,
                dateTime: dateTime.toISOString(),
                fee: d.fee + AC,
                method: "visit",
                status: "pending",
            };

            try {
                const res = await API.post("/appointment", data);
                toast.success(res.data.message);
                navigate(`/staff_dash`);
            } catch (err: any) {
                toast.error(err.response?.data?.message || "Request failed");
            }
        }


    };

    return (
        <div className=" mt-6 grid grid-cols-1  md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 px-16 py-16 ">
                {/*  <h2 className=" text-3xl mb-10 text-center font-semibold">Let's Create Walk-In Appointment 😃</h2>  */}
                <label className="mt-2">First name</label>
                <input
                    {...register("firstName")}
                    type="text"
                    placeholder="Ex: John"
                    className={`mt-2 shadow-md rounded-xl p-2 outline-none ${errors.firstName ? "border border-red-500" : ""
                        }`}
                />
                {errors.firstName && (
                    <p className="text-red-500 text-sm">{errors.firstName.message}</p>
                )}

                {/* Last Name */}
                <label className="mt-2">Last name</label>
                <input
                    {...register("lastName")}
                    type="text"
                    placeholder="Ex: Doe"
                    className={`mt-2 shadow-md rounded-xl p-2 outline-none ${errors.lastName ? "border border-red-500" : ""
                        }`}
                />
                {errors.lastName && (
                    <p className="text-red-500 text-sm">{errors.lastName.message}</p>
                )}

                {/* Email */}
                <label className="mt-2">Email</label>
                <input
                    {...register("email")}
                    type="text"
                    placeholder="Enter your Email"
                    className={`mt-2 shadow-md rounded-xl p-2 outline-none ${errors.email ? "border border-red-500" : ""
                        }`}
                />
                {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}

                {/* Mobile */}
                <label className="mt-2">Mobile number</label>
                <input
                    {...register("mobileNumber")}
                    type="text"
                    placeholder="07xxxxxxxx"
                    className={`mt-2 shadow-md rounded-xl p-2 outline-none ${errors.mobileNumber ? "border border-red-500" : ""
                        }`}
                />
                {errors.mobileNumber && (
                    <p className="text-red-500 text-sm">
                        {errors.mobileNumber.message}
                    </p>
                )}

                {/* Birthday */}
                <label className="mt-2">Birth Day</label>
                <input
                    {...register("birthDay")}
                    type="date"
                    className={`mt-2 shadow-md rounded-xl p-2 outline-none ${errors.birthDay ? "border border-red-500" : ""
                        }`}
                />
                {errors.birthDay && (
                    <p className="text-red-500 text-sm">{errors.birthDay.message}</p>
                )}

                {/* Gender */}
                <label className="mt-2">Gender</label>
                <div
                    className={`mt-2 shadow-md rounded-xl p-2 outline-none ${errors.gender ? "border border-red-500" : ""
                        }`}
                >
                    <select
                        {...register("gender")}
                        className="w-full outline-none"
                    >
                        <option value="">Select below ...</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                {errors.gender && (
                    <p className="text-red-500 text-sm">{errors.gender.message}</p>
                )}

                {/* hidden password */}
                <input
                    type="hidden"
                    {...register("password")}
                    defaultValue="00000000"
                />

                {errors.password && (
                    <p className="text-red-500 text-sm hidden">
                        {errors.password.message}
                    </p>
                )}

                {/* Address */}
                <label className="mt-2">Address</label>
                <input
                    {...register("address")}
                    type="text"
                    placeholder="Enter your address"
                    className={`mt-2 shadow-md rounded-xl p-2 outline-none ${errors.address ? "border border-red-500" : ""
                        }`}
                />
                {errors.address && (
                    <p className="text-red-500 text-sm">{errors.address.message}</p>
                )}

                <select
                    onChange={(e) => setDoctor(e.target.value)}
                    className="mt-8 shadow-md rounded-xl p-2 border-none focus:border-transparent"
                >
                    <option value="">Select the Doctor</option>

                    {doctorList.map((d: any) => (
                        <option key={d.id} value={d.id}>
                            Dr. {d.firstName} {d.lastName}
                        </option>
                    ))}
                </select>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-14 bg-sky-500 hover:bg-sky-600 p-2 rounded-xl text-white font-semibold"
                >
                    {isSubmitting ? "Registering..." : "Register"}
                </button>

            </form>
            <section className="flex flex-col flex-1 px-16 py-16 ">
                {doctor !== "" ?
                    <div className="flex flex-col flex-wrap gap-5">

                        {availableSessions.map((d) => (
                            <div id={d?._id} className=" flex flex-col rounded-xl shadow-md cursor-pointer w-full p-4 hover:shadow-xl hover:translate-y-1 transition ease-in-out hover:scale-105 duration-300">
                                <div className="flex justify-between">
                                    <img src="./userDash/user.png" alt="userimg" className=" w-14 h-14 rounded-full object-cover" />
                                    <span className=" ">
                                        <h1 className=" text-xl font-semibold">Dr.{d?.doctorId?.firstName + " " + d?.doctorId?.lastName}</h1>
                                        <p className=" text-sm text-gray-500">{d?.clinicId?.clinicName}</p>
                                    </span>
                                </div>
                                <div className=" mt-4">
                                    <div className="grid grid-cols-[3fr_1fr] justify-between mt-6 ">
                                        <p className=" flex items-center">{d?.startDateTime}</p>
                                        <button
                                            type="button"
                                            onClick={() => handleBook(d)}
                                            className="right-0 w-full border border-gray-500 shadow-md hover:text-green-500 hover:border-green-600 hover:shadow-xl p-2 rounded-xl text-gray-500 font-semibold"
                                        >
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>))}
                    </div>
                    :
                    <div className=" text-center justify-center items-center mt-10">
                        <h1 className=" text-xl font-semibold text-gray-500 ">Please select a Doctor to <br />View the Schedules...</h1>
                    </div>
                }
            </section>
        </div>
    )
}

export default WalkInAppointment
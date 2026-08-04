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
    const [patientResults, setPatientResults] = useState<any[]>([]);
    const [searchingPatient, setSearchingPatient] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<any>(null);

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
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            role: "user",
        },
    });

    const onSubmit = async (data: FormData) => {
        try {
            if (selectedPatient) {
                setRegisteredUser(selectedPatient._id);
                toast.success("Existing patient selected");
                return;
            }
            const res = await registerUser(data);
            toast.success(res.message);
            setRegisteredUser(res.user._id);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Oops! Something went wrong");
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
                console.log(res.data);
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

    const searchPatient = async (value: string) => {

        if (value.trim().length < 2) {
            setPatientResults([]);
            return;
        }
        try {
            setSearchingPatient(true);
            const res = await API.get("/search/patient", {
                params: {
                    q: value
                }
            }
            );
            setPatientResults(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setSearchingPatient(false);
        }
    };

    const handleSelectPatient = (patient: any) => {

        setSelectedPatient(patient);
        setRegisteredUser(patient._id);
        setPatientResults([]);

        setValue("firstName", patient.firstName);
        setValue("lastName", patient.lastName);
        setValue("mobileNumber", patient.mobileNumber);
    };

    return (
        <div className="mt-8 grid grid-cols-1 xl:grid-cols-[450px_1fr] gap-8 items-start">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-3xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 p-8 md:p-10">

                <div className="mb-10">
                    <h2 className="text-3xl font-bold text-[#2596be]"> Create Walk-In Appointment</h2>
                    <p className="text-gray-500 mt-2">Register a walk-in patient and instantly create an appointment.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Doctor */}

                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Doctor</label>
                        <select
                            onChange={(e) => setDoctor(e.target.value)}
                            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all duration-300 focus:border-[#2596be] focus:ring-4 focus:ring-[#2596be]/10"
                        >
                            <option value="">Select Doctor</option>
                            {doctorList.map((d: any) => (
                                <option key={d.id} value={d.id}>
                                    Dr. {d.firstName} {d.lastName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* First Name */}

                    <div className="relative">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            First Name
                        </label>

                        <input
                            {...register("firstName", {
                                onChange: (e) => {
                                    searchPatient(e.target.value);
                                },
                            })}
                            type="text"
                            placeholder="Ex: John"
                            autoComplete="off"
                            className={`w-full rounded-2xl border bg-gray-50 px-4 py-3 outline-none transition-all duration-300 focus:border-[#2596be] focus:ring-4 focus:ring-[#2596be]/10 ${errors.firstName
                                ? "border-red-500"
                                : "border-gray-200"
                                }`}
                        />

                        {searchingPatient && (
                            <p className="mt-2 text-xs text-gray-400">
                                Searching patients...
                            </p>
                        )}

                        {patientResults.length > 0 && !selectedPatient && (
                            <div
                                className=" absolute left-0 top-full z-50 mt-2 w-[calc(200%+1.5rem)]  max-h-72 overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-xl " >
                                {patientResults.map((patient: any) => (
                                    <button
                                        key={patient._id}
                                        type="button"
                                        onClick={() => handleSelectPatient(patient)}
                                        className=" flex w-full items-center justify-between gap-6 border-b border-gray-100 px-5 py-4 text-left transition hover:bg-[#2596be]/5 last:border-b-0">

                                        <div className="min-w-0">
                                            <p className="text-base font-semibold text-gray-800">
                                                {patient.firstName} {patient.lastName}
                                            </p>

                                            <p className="mt-1 text-xs text-gray-400">
                                            </p>
                                        </div>

                                        <div className="shrink-0 text-right">
                                            <p className="text-xs text-gray-400">
                                                Mobile Number
                                            </p>

                                            <p className="mt-1 text-sm font-semibold text-gray-700">
                                                {patient.mobileNumber}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {errors.firstName && (
                            <p className="mt-2 text-sm text-red-500">
                                {errors.firstName.message}
                            </p>
                        )}
                    </div>

                    {/* Last Name */}

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                        <input
                            {...register("lastName")}
                            type="text"
                            placeholder="Ex: Doe"
                            className={`w-full rounded-2xl border bg-gray-50 px-4 py-3 outline-none transition-all duration-300 focus:border-[#2596be] focus:ring-4 focus:ring-[#2596be]/10 ${errors.lastName ? "border-red-500" : "border-gray-200"
                                }`}
                        />

                        {errors.lastName && (
                            <p className="mt-2 text-sm text-red-500">
                                {errors.lastName.message}
                            </p>
                        )}
                    </div>



                    {/* Email */}

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                        <input
                            {...register("email")}
                            type="email"
                            placeholder="Enter Email"
                            className={`w-full rounded-2xl border bg-gray-50 px-4 py-3 outline-none transition-all duration-300 focus:border-[#2596be] focus:ring-4 focus:ring-[#2596be]/10 ${errors.email ? "border-red-500" : "border-gray-200"
                                }`}
                        />

                        {errors.email && (
                            <p className="mt-2 text-sm text-red-500">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Mobile */}

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
                        <input
                            {...register("mobileNumber")}
                            type="text"
                            placeholder="07xxxxxxxx"
                            className={`w-full rounded-2xl border bg-gray-50 px-4 py-3 outline-none transition-all duration-300 focus:border-[#2596be] focus:ring-4 focus:ring-[#2596be]/10 ${errors.mobileNumber ? "border-red-500" : "border-gray-200"
                                }`}
                        />

                        {errors.mobileNumber && (
                            <p className="mt-2 text-sm text-red-500">
                                {errors.mobileNumber.message}
                            </p>
                        )}
                    </div>

                    {/* Birthday */}

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Birth Day</label>
                        <input
                            {...register("birthDay")}
                            type="date"
                            className={`w-full rounded-2xl border bg-gray-50 px-4 py-3 outline-none transition-all duration-300 focus:border-[#2596be] focus:ring-4 focus:ring-[#2596be]/10 ${errors.birthDay ? "border-red-500" : "border-gray-200"
                                }`}
                        />

                        {errors.birthDay && (
                            <p className="mt-2 text-sm text-red-500">
                                {errors.birthDay.message}
                            </p>
                        )}
                    </div>

                    {/* Gender */}

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2"> Gender</label>
                        <select
                            {...register("gender")}
                            className={`w-full rounded-2xl border bg-gray-50 px-4 py-3 outline-none transition-all duration-300 focus:border-[#2596be] focus:ring-4 focus:ring-[#2596be]/10 ${errors.gender ? "border-red-500" : "border-gray-200"
                                }`}
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>

                        {errors.gender && (
                            <p className="mt-2 text-sm text-red-500">
                                {errors.gender.message}
                            </p>
                        )}
                    </div>

                    {/* Address */}

                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2"> Address</label>
                        <input
                            {...register("address")}
                            type="text"
                            placeholder="Enter Address"
                            className={`w-full rounded-2xl border bg-gray-50 px-4 py-3 outline-none transition-all duration-300 focus:border-[#2596be] focus:ring-4 focus:ring-[#2596be]/10 ${errors.address ? "border-red-500" : "border-gray-200"
                                }`}
                        />

                        {errors.address && (
                            <p className="mt-2 text-sm text-red-500">
                                {errors.address.message}
                            </p>
                        )}
                    </div>

                    <input
                        type="hidden"
                        {...register("password")}
                        defaultValue="00000000"
                    />
                </div>

                <div className="flex justify-end mt-10">
                    <button
                        type="submit"
                        disabled={isSubmitting || selectedPatient}
                        className={`px-8 py-3 rounded-2xl ${selectedPatient ? "bg-green-500 hover:cursor-not-allowed" : "bg-[#2596be] hover:bg-[#1f84a8]"} text-white font-semibold shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300`}
                    >
                        {isSubmitting ? "Creating..." : selectedPatient ? "Patient Selected ✔" : "Create Appointment"}
                    </button>
                </div>
            </form>

            <section className="bg-white rounded-3xl border border-gray-100 shadow-md  p-8 md:p-10">

                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-[#2596be]"> Available Sessions</h2>
                    <p className="text-gray-500 mt-2"> Select a doctor's available session to complete the appointment.</p>
                </div>

                {doctor !== "" ? (

                    availableSessions.length > 0 ? (

                        <div className="flex flex-col gap-5">
                            {availableSessions.map((d: any) => (
                                <div key={d._id} className="rounded-3xl border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300 p-6"
                                >
                                    {/* Header */}

                                    <div className="flex flex-col justify-between items-start gap-4">

                                        <div className="flex items-center gap-5">
                                            <img src={d?.doctorId?.img ?? "./userDash/user.png"} alt="doctor" className="w-20 h-20 rounded-full object-cover border-4 border-[#2596be]/10" />
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-800"> Dr. {d?.doctorId?.firstName} {d?.doctorId?.lastName}</h3>
                                                <p className="text-gray-500 mt-1">{d?.clinicId?.clinicName}</p>
                                            </div>
                                        </div>

                                        {d?.fee && (
                                            <div className="text-right">
                                                <p className="text-xs uppercase tracking-wide text-gray-400">Consultation Fee</p>
                                                <p className="text-2xl font-bold text-green-600">LKR {Number(d.fee).toLocaleString()}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="border-t border-gray-100 my-6"></div>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="rounded-2xl bg-[#2596be]/5 p-4">
                                            <p className="text-xs uppercase tracking-wide text-gray-500"> Date</p>
                                            <p className="font-semibold text-gray-800 mt-1">
                                                {new Date(d.startDateTime).toLocaleDateString("en-GB", {
                                                    weekday: "short",
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </p>
                                        </div>

                                        <div className="rounded-2xl bg-[#2596be]/5 p-4">
                                            <p className="text-xs uppercase tracking-wide text-gray-500">Time</p>
                                            <p className="font-semibold text-gray-800 mt-1">
                                                {new Date(d.startDateTime).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}<br />
                                                {new Date(d.endDateTime).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}

                                            </p>
                                        </div>

                                        <div className="rounded-2xl bg-green-50 p-4">
                                            <p className="text-xs uppercase tracking-wide text-gray-500">Available Slots</p>
                                            <p className="font-bold text-green-600 mt-1 text-xl">{(d?.templateId?.maxPatients - d?.bookedPatients) === 0 ? "-" : (d?.templateId?.maxPatients - d?.bookedPatients)} </p>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex justify-end mt-8">
                                        <button
                                            type="button"
                                            onClick={() => handleBook(d)}
                                            className="px-8 py-3 rounded-2xl bg-[#2596be] hover:bg-[#1f84a8] text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                                        >
                                            Book Appointment
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                    ) : (

                        <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 py-20 flex flex-col items-center justify-center">
                            <img src="./userDash/calendar.png" className="w-20 opacity-50" alt="calendar" />
                            <h3 className="mt-6 text-xl font-bold text-gray-700">No Available Sessions</h3>
                            <p className="text-gray-500 mt-2 text-center max-w-sm"> The selected doctor has no available sessions at the moment.</p>
                        </div>
                    )

                ) : (
                    <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 py-20 flex flex-col items-center justify-center">
                        <img src="./userDash/doctor.png" className="w-24 opacity-50" alt="doctor" />
                        <h3 className="mt-6 text-xl font-bold text-gray-700">Select a Doctor</h3>
                        <p className="text-gray-500 mt-2 text-center max-w-sm">Please select a doctor from the registration form to view available appointment sessions.</p>
                    </div>
                )}
            </section>
        </div>
    )
}

export default WalkInAppointment
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../../../../api/axios';
import { toast } from 'react-hot-toast';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const clinicSchema = z.object({
    clinicName: z
        .string()
        .trim()
        .min(3, "Clinic name must be at least 3 characters.")
        .max(100, "Clinic name cannot exceed 100 characters."),

    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Please enter a valid email address."),

    mobileNumber: z
        .string()
        .trim()
        .regex(/^0\d{9}$/, "Please enter a valid 10-digit mobile number."),

    address: z
        .string()
        .trim()
        .min(5, "Address is required.")
        .max(255, "Address cannot exceed 255 characters."),

    desc: z
        .string()
        .trim()
        .max(1000, "Description cannot exceed 1000 characters.")
        .optional()
        .or(z.literal("")),

    img: z
        .string()
        .optional()
        .or(z.literal("")),

});

type FormData = z.infer<typeof clinicSchema>;
type ClinicRequest = FormData & {
    managementId: string;
};

const ClinicSetting = () => {

    const currentUser = JSON.parse(localStorage.getItem("user") || "null");
    const [file, setFile] = useState<File | null>(null);
    const [clinic, setClinic] = useState<any>();
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [preview, setPreview] = useState<string | null>(null);


    const location = useLocation();
    const id = location.pathname.split("/")[2];
    const isEditMode = !!id;
    const [showForm, setShowForm] = useState(!isEditMode);
    const { register, handleSubmit, reset, formState: { errors, isSubmitting, dirtyFields } } = useForm<FormData>({ resolver: zodResolver(clinicSchema) });
    const navigate = useNavigate();


    const getClinic = async () => {
        try {
            const res = await API.get(`/clinic/${id}`);
            setClinic(res.data.clinic);
        } catch (err: any) {
            console.error(err);
        }
    }
    useEffect(() => {
        if (isEditMode) {
            getClinic();
        }
    }, [isEditMode]);

    const handleUpload = async () => {
        if (!file) {
            toast.error("Please select an image");
            return;
        }
        const formData = new FormData();
        formData.append("image", file);
        try {
            setLoading(true);
            const res = await API.post(`/dash/upload/${clinic._id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
            const clinicData = { img: res.data.imageUrl , managementId : currentUser._id};
            await API.put(`/clinic/${clinic._id}`, clinicData);
            toast.success("Profile picture uploaded successfully !");
            setPreview(null);
            setFile(null);
            getClinic();
        } catch (err) {
            toast.error("Upload failed");
        } finally {
            setLoading(false);
        }
    }

    const handleRemove = async () => {
        try {
            const res = await API.delete(`/dash/remove/${clinic._id}`);
            getClinic();
            toast.success(res.data.message);
        } catch (error: any) {
            toast.error(error.res.data.message)
        }
    }

    const onSubmit = async (data: FormData) => {

        const clinicData = {
            ...data,
            managementId: currentUser._id
        };

        if (isEditMode) {
            const updateData: Partial<ClinicRequest> = {
                managementId: currentUser._id
            };

            (Object.keys(dirtyFields) as (keyof FormData)[]).forEach((field) => {
                updateData[field] = data[field];
            });

            await API.put(`/clinic/${id}`, updateData);
            navigate("/admin_dash");
        } else {
            await API.post("/clinic", clinicData);
            toast.success("Clinic created successfully!");
            navigate("/admin_dash");
        }
    };

    useEffect(() => {
        if (clinic) {
            reset({
                clinicName: clinic.clinicName,
                email: clinic.email,
                mobileNumber: clinic.mobileNumber,
                address: clinic.address,
                desc: clinic.desc ?? "",
                img: clinic.img ?? "",
            });
        }
    }, [clinic, reset]);

    return (
        <div>

            {!showForm && isEditMode ? <div className="mt-8 grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-8">

                <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-8 flex flex-col items-center">

                    <div className="relative group">

                        <img
                            src={preview ? preview : clinic?.img ? clinic.img : "./userDash/user.png"}
                            alt="profilepic"
                            className="w-52 h-52 rounded-full object-cover border-4 border-[#2596be]/15 shadow-lg cursor-pointer transition duration-300 group-hover:scale-[1.02]"
                            onClick={() => fileInputRef.current?.click()}
                        />

                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-3 right-3 w-12 h-12 rounded-full bg-[#2596be] text-white shadow-lg hover:bg-[#1f84a8] transition flex items-center justify-center"
                        >
                            ✎
                        </button>

                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={(e) => {
                                const selectedFile = e.target.files?.[0] || null;
                                setFile(selectedFile);

                                if (selectedFile) {
                                    const previewUrl = URL.createObjectURL(selectedFile);
                                    setPreview(previewUrl);
                                }
                            }}
                            className="hidden"
                        />

                    </div>

                    <h3 className="mt-6 text-2xl font-bold text-gray-800 text-center">{clinic?.clinicName} </h3>

                    <p className="text-sm text-gray-500 mt-1">
                        Clinic Account
                    </p>

                    <div className="w-full flex gap-3 mt-8">

                        <button
                            onClick={handleUpload}
                            disabled={loading}
                            className="flex-1 rounded-2xl bg-[#2596be] text-white font-semibold py-3 shadow-md hover:bg-[#1f84a8] hover:shadow-lg disabled:opacity-60 transition-all duration-300"
                        >
                            {loading ? "Uploading..." : "Upload"}
                        </button>

                        <button
                            onClick={handleRemove}
                            className="flex-1 rounded-2xl border border-red-300 text-red-500 font-semibold py-3 hover:bg-red-50 transition-all duration-300"
                        >
                            Remove
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 p-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-[#2596be]">Clinic Information</h2>
                            <p className="text-gray-500 mt-2"> Review your clinic account information.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div>
                            <p className="text-sm text-gray-500">Clinic Name</p>
                            <p className="mt-1 font-semibold text-gray-800">
                                {clinic?.clinicName}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="mt-1 font-semibold text-gray-800 break-all">
                                {clinic?.email}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Mobile Number</p>
                            <p className="mt-1 font-semibold text-gray-800">
                                {clinic?.mobileNumber}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Address</p>
                            <p className="mt-1 font-semibold text-gray-800">
                                {clinic?.address}
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-end mt-10 gap-5">
                        <button
                            className={`px-8 py-3 rounded-2xl  border bg-[#2596be] text-white font-semibold shadow-md hover:bg-[#1f84a8] hover:shadow-xl transition-all duration-300"}`}
                            onClick={() => { setShowForm(true) }}
                        >
                            Update Profile
                        </button>
                        <button
                            className={`px-8 py-3 rounded-2xl border border-gray-500 bg-gray-300 text-gray-500 font-semibold shadow-md cursor-not-allowed  hover:shadow-xl transition-all duration-300 `}
                            onClick={() => { toast("Contact your System Admin to Delete your Profile", { icon: "⚠️" }) }}
                        >
                            Delete Profile
                        </button>

                    </div>
                </div>
            </div>
                :
                <div className="mt-8 max-w-6xl mx-auto">
                    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-3xl border border-gray-100 shadow-md p-8 md:p-10">

                        <div className="mb-10">
                            <h2 className="text-3xl font-bold text-[#2596be]"> {isEditMode ? "Update Clinic" : "Create Clinic"}</h2>
                            <p>{isEditMode ? "Update your clinic information." : "Create your clinic profile to start managing doctors, staff and appointments."}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* clinic Name */}

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Clinic Name
                                </label>

                                <input
                                    {...register("clinicName")}
                                    type="text"
                                    placeholder={clinic?.clinicName}
                                    className={`w-full rounded-2xl border bg-gray-50 px-4 py-3 outline-none transition-all duration-300 focus:border-[#2596be] focus:ring-4 focus:ring-[#2596be]/10 ${errors?.clinicName ? "border-red-500" : "border-gray-200"}`}
                                />

                                {errors.clinicName && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {errors.clinicName.message}
                                    </p>
                                )}
                            </div>

                            {/* Email */}

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address
                                </label>

                                <input
                                    {...register("email")}
                                    type="text"
                                    placeholder={clinic?.email}
                                    className={`w-full rounded-2xl border bg-gray-50 px-4 py-3 outline-none transition-all duration-300 focus:border-[#2596be] focus:ring-4 focus:ring-[#2596be]/10 ${errors?.email ? "border-red-500" : "border-gray-200"}`}
                                />

                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            {/* Mobile */}

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Mobile Number
                                </label>

                                <input
                                    {...register("mobileNumber")}
                                    type="text"
                                    placeholder={clinic?.mobileNumber}
                                    className={`w-full rounded-2xl border bg-gray-50 px-4 py-3 outline-none transition-all duration-300 focus:border-[#2596be] focus:ring-4 focus:ring-[#2596be]/10 ${errors?.mobileNumber ? "border-red-500" : "border-gray-200"}`}
                                />

                                {errors.mobileNumber && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {errors.mobileNumber.message}
                                    </p>
                                )}
                            </div>


                            {/* Address */}

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Address
                                </label>

                                <input
                                    {...register("address")}
                                    type="text"
                                    placeholder={clinic?.address}
                                    className={`w-full rounded-2xl border bg-gray-50 px-4 py-3 outline-none transition-all duration-300 focus:border-[#2596be] focus:ring-4 focus:ring-[#2596be]/10 ${errors?.address ? "border-red-500" : "border-gray-200"}`}
                                />

                                {errors.address && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {errors.address.message}
                                    </p>
                                )}

                                {/* Last Name */}

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Description
                                    </label>

                                    <input
                                        {...register("desc")}
                                        type="text"
                                        placeholder={clinic?.desc}
                                        className={`w-full rounded-2xl border bg-gray-50 px-4 py-3 outline-none transition-all duration-300 focus:border-[#2596be] focus:ring-4 focus:ring-[#2596be]/10 ${errors?.desc ? "border-red-500" : "border-gray-200"}`}
                                    />

                                    {errors.desc && (
                                        <p className="mt-2 text-sm text-red-500">
                                            {errors.desc.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-10">

                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-8 py-3 rounded-2xl border border-gray-300 text-gray-600 font-semibold hover:bg-gray-100 transition-all duration-300"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-3 rounded-2xl bg-[#2596be] hover:bg-[#1f84a8] text-white font-semibold shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
                            >
                                {isSubmitting
                                    ? isEditMode
                                        ? "Updating..."
                                        : "Creating..."
                                    : isEditMode
                                        ? "Update Clinic"
                                        : "Create Clinic"}
                            </button>
                        </div>
                    </form>
                </div>}
        </div>
    )
}

export default ClinicSetting

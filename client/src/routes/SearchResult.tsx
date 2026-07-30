import { Link, useSearchParams } from "react-router-dom"
import Search from "../components/Search"
import { useEffect, useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";


const SearchResult = () => {

    const [params] = useSearchParams();
    const query = params.get("q");
    const [data, setData] = useState<any>({
        doctors: [],
        clinics: [],
        totalDoctors: 0,
        totalClinics: 0
    });

    useEffect(() => {
        const fetchedResults = async () => {
            try {
                const res = await API.get(`/search?q=${query}`);
                setData(res.data);
            } catch (err) {
                toast.error("Oops! Something went wrong");
            }
        };
        fetchedResults();
    }, [query]);

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
            <div className="max-w-7xl mx-auto space-y-12">
                <Search />

                {/* ================= Clinics ================= */}

                <section>
                    <div className="mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-[#2596be]">
                            {data.totalClinics < 1
                                ? "No Clinics Nearby"
                                : `Clinics Near You (${data.totalClinics})`}
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Discover trusted dental clinics available in your area.
                        </p>

                    </div>
                    <div className="space-y-5">

                        {data.clinics && data.clinics.map((c: any) => (

                            <div key={c._id}
                                className=" group bg-white border border-gray-100 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-5 flex items-center justify-between">

                                <div className="flex items-center flex-1">
                                    <img src={c.img ? c.img : "/userDash/user.png"} alt="clinic" className=" w-16 h-16 rounded-2xl object-cover border border-gray-100" />

                                    <div className="ml-5 flex-1">
                                        <h3 className="text-lg font-semibold text-gray-800">{c.clinicName}</h3>
                                        <p className="text-gray-500 mt-1">{c.address}</p>
                                    </div>
                                </div>

                                <Link to={`/clinic/${c._id}`}
                                    className=" flex items-center justify-center w-12 h-12 rounded-full bg-cyan-50 hover:bg-[#2596be] transition-all duration-300 shrink-0">

                                    <img src="./cardIcons/arrow-right.png" alt="View Clinic"
                                        className=" w-5 h-5 transition-all duration-300 hover:brightness-0 hover:invert" /></Link>
                            </div>
                        ))}

                        {data.totalClinics < 1 && (
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-10 text-center">
                                <h3 className="text-lg font-semibold text-gray-700">No clinics found nearby.</h3>
                                <p className="text-gray-500 mt-2">Try another location or search keyword. </p>
                            </div>
                        )}
                    </div>
                </section>

                {/* ================= Doctors ================= */}
                <section>
                    <div className="mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-[#2596be]">
                            {data.totalDoctors < 1
                                ? "No Dentists Nearby"
                                : `Dentists Near You (${data.totalDoctors})`}
                        </h2>
                        <p className="text-gray-500 mt-2">Find experienced dental professionals ready to help you.</p>
                    </div>

                    <div className="space-y-5">
                        {data.doctors &&
                            data.doctors.map((d: any) => (
                                <div
                                    key={d._id}
                                    className=" group bg-white border border-gray-100 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-5 flex items-center justify-between">

                                    <div className="flex items-center flex-1">
                                        <img
                                            src={d.userId?.img ? d.userId.img : "/userDash/user.png"}
                                            alt="doctor"
                                            className=" w-16 h-16 rounded-2xl object-cover border border-gray-100" />
                                        <div className="ml-5 flex-1">
                                            <h3 className="text-lg font-semibold text-gray-800"> Dr. {d.userId.firstName} {d.userId.lastName}</h3>

                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {d.specialization
                                                    .slice(0, 2)
                                                    .map((s: any, index: number) => (
                                                        <span
                                                            key={index}
                                                            className=" px-3 py-1 rounded-full bg-cyan-50 text-[#2596be] text-xs font-medium">
                                                            {s}
                                                        </span>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>

                                    <Link
                                        to={`/${d.userId._id}`}
                                        className=" flex items-center justify-center w-12 h-12 rounded-full bg-cyan-50 hover:bg-[#2596be] transition-all duration-300 shrink-0">

                                        <img
                                            src="./cardIcons/arrow-right.png"
                                            alt="View Doctor"
                                            className=" w-5 h-5 transition-all duration-300 group-hover:brightness-0 group-hover:invert" />
                                    </Link>
                                </div>
                            ))}

                        {data.totalDoctors < 1 && (

                            <div className=" bg-white rounded-3xl border border-gray-100 shadow-md p-10 text-center ">
                                <h3 className="text-lg font-semibold text-gray-700">No dentists found nearby.</h3>
                                <p className="text-gray-500 mt-2">Try another location or search for a different specialty.</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    )
}

export default SearchResult
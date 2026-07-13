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
                console.log(res.data);
            } catch (err) {
                toast.error("Oops! Something went wrong");
            }
        };

        fetchedResults();
    }, [query]);

    return (
        <div className=" mt-6 grid grid-cols-1 ">
            <div className="flex w-full">
                <Search />
            </div>
            <div className=" flex flex-col  w-full  mt-10">
                <div className="flex flex-col mt-2">
                    <h1 className=" text-2xl mb-5">{data.totalClinics < 1 ? "No Clinics around you" : `Clinics located near you (${data.totalClinics})`}</h1>
                    {
                        data.clinics && data.clinics.map((c: any) => (
                            <div key={c._id} className="group bg-white rounded-2xl shadow-md p-2 mt-2 mb-2 flex flex-row justify-between hover:shadow-xl hover:-translate-y-1 transition duration-300">
                                <span className="flex items-center justify-center text-center cursor-pointer">
                                    <img src={c.img} alt="clinicimg" className=" w-10 h-10 rounded-full object-cover" />
                                    <span className=" ml-8 text-start">
                                        <h2 className=" font-semibold">{c.clinicName}</h2>
                                        <p className=" ">{c.address}</p>
                                    </span>
                                </span>
                                <Link to={`/clinic/${c._id}`} className="">
                                    <img src="./cardIcons/arrow-right.png" alt="clinicimg" className=" w-10 h-10 rounded-full object-cover cursor-pointer" />
                                </Link>
                            </div>
                        ))}
                </div>
                <div className="flex flex-col mt-5">
                    <h1 className=" text-2xl mb-5">{data.totalDoctors < 1 ? "No Doctors around you" : `Doctors around you (${data.totalDoctors})`}</h1>

                    {data.doctors && data.doctors.map((d: any) => (
                        <div key={d._id} className="group bg-white rounded-2xl shadow-md p-2 mt-2 mb-2 flex flex-row justify-between hover:shadow-xl hover:-translate-y-1 transition duration-300">
                            <span className="flex items-center justify-center text-center cursor-pointer">
                                <img src={d.img} alt="clinicimg" className="  w-10 h-10  rounded-full object-cover" />
                                <span className=" ml-8 text-start">
                                    <h2 className=" font-semibold">Dr. {d.userId.firstName + " " + d.userId.lastName}</h2>
                                    {d.specialization.slice(0, 2).map((s: any) => (
                                        <span className=" flex flex-row gap-4">
                                            <p className=" text-gray-400 text-sm">{s}</p>
                                        </span>
                                    ))}

                                </span>
                            </span>
                            <Link to={`/${d.userId._id}`} className="">
                                <img src="./cardIcons/arrow-right.png" alt="clinicimg" className=" w-10 h-10 rounded-full object-cover cursor-pointer" />
                            </Link>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    )
}

export default SearchResult
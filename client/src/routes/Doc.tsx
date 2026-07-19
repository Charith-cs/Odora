import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import API from "../../api/axios";


const DocClinic = () => {

  const [details, setDetails] = useState<any>(null);
  const navigate = useNavigate();
  const { slug } = useParams();

  useEffect(() => {
    const getDetails = async () => {
      if (!slug) return;
      try {
        const docDetails = await API.get(`/doctor/details/${slug}`);
        console.log(docDetails.data)
        setDetails(docDetails.data);
      } catch (err) {
        console.log(err);
      }
    }
    getDetails();
  }, [slug]);


  if (!details) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
        <div className="space-y-8">

          {/* Doctor Card */}

          <div className=" bg-white rounded-3xl border border-gray-100 shadow-md p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <img
                src="./cardIcons/dentist.png"
                alt="Doctor"
                className=" w-28 h-28 rounded-3xl object-cover border border-gray-100" />

              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#2596be]">
                  Dr. {details.doctor.firstName} {details.doctor.lastName}
                </h1>

                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4">
                  {details.doctorDetails.specialization.map((s: string) => (
                    <span
                      key={s}
                      className=" px-3 py-1 rounded-full bg-cyan-50 text-[#2596be] text-xs font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className=" bg-white rounded-3xl border border-gray-100 shadow-md p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-[#2596be]">
              About Dr. {details.doctor.firstName} {details.doctor.lastName}
            </h2>

            <p className="mt-6 leading-8 text-gray-600">
              {details.doctorDetails?.desc}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <Link
            to={`/session/${slug}`}
            className={` w-full flex items-center justify-center rounded-2xl py-4 font-semibold text-lg transition-all duration-300 shadow-md
            ${details.availableSessions.length > 0
                ? "bg-[#2596be] text-white hover:bg-[#1f7ea0] hover:shadow-xl hover:-translate-y-1"
                : "bg-gray-300 text-gray-600 cursor-not-allowed pointer-events-none"
              }
        `}>
            {details.availableSessions.length > 0
              ? "See Available Sessions"
              : "Sessions Unavailable"}
          </Link>


          {details?.clinicDetails[0] && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-6 sm:p-8">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-[#2596be]">
                    {details?.clinicDetails[0]?.clinicName}
                  </h2>
                  <p className="text-gray-500 mt-2">
                    {details?.clinicDetails[0]?.address}
                  </p>
                </div>

                <Link
                  to={`/clinic/${details?.clinicDetails[0]?._id}`}
                  className=" flex items-center justify-center w-12 h-12 rounded-full bg-cyan-50 hover:bg-[#2596be] transition-all duration-300">
                  <img
                    src="./icons/verified.png"
                    alt="Clinic"
                    className=" w-6 h-6 transition-all duration-300" />
                </Link>
              </div>

              <div className="mt-8 space-y-5">
                {details.availableSessions.map((s: any) => (
                  <div key={s._id}
                    className=" border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-all duration-300">

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{s.startDateTime.slice(0, 10)}</h3>
                        <p className="text-gray-500 mt-1">

                          {s.startDateTime.slice(11, 16)}{" "}
                          <span className="mx-1">•</span>
                          {s.endDateTime.slice(11, 16)}

                        </p>
                      </div>

                      <button
                        onClick={() =>
                          navigate(`/book/${s._id}`, {
                            state: {
                              session: s,
                              doctor: details.doctor,
                              clinic: details.clinicDetails[0],
                            },
                          })
                        }
                        className=" flex items-center justify-center w-12 h-12 rounded-full bg-cyan-50 hover:bg-[#2596be] transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                        <img src="./icons/booking.png" alt="Book Session" className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DocClinic
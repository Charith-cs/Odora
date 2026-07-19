import { useNavigate } from "react-router-dom";
import Login from "../components/authComponents/Login";


const Auth = () => {

  const navigate = useNavigate();

  return (
    <>
      <section className="bg-gradient-to-r from-cyan-50 to-blue-50 py-14 sm:py-16 lg:py-20 px-5">

        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2596be]">
            Welcome to Odora
          </h1>

          <p className="mt-5 text-gray-600 text-base sm:text-lg max-w-3xl mx-auto leading-8">
            Sign in to manage your appointments, or join Odora as a dental professional and become part of a modern healthcare platform dedicated to creating healthier smiles.
          </p>
        </div>

      </section>

      <section className="px-5 py-14 sm:py-16 lg:py-20">

        <div
          className=" max-w-7xl mx-auto bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden ">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 sm:p-10 lg:p-14">

              <Login />

            </div>
            <div
              className="bg-gradient-to-br from-cyan-50 to-white border-t lg:border-t-0 lg:border-l border-gray-200 p-8 sm:p-10 lg:p-14 flex flex-col justify-center items-center text-center ">

              <h2 className="text-3xl sm:text-4xl font-bold text-[#2596be]">
                Join as a Dentist
              </h2>

              <p className="mt-6 text-gray-600 text-base sm:text-lg leading-8 max-w-md">
                Expand your practice, manage appointments efficiently, and connect with more patients through Odora's modernclinic management platform.
              </p>

              <div className="mt-10 space-y-4 text-left">

                <div className="flex items-center gap-3">
                  <span className="text-[#21a262] text-xl">✓</span>
                  <span className="text-gray-700">
                    Manage appointments
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[#21a262] text-xl">✓</span>
                  <span className="text-gray-700">
                    Grow your patient network
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[#21a262] text-xl">✓</span>
                  <span className="text-gray-700">
                    Modern clinic management
                  </span>
                </div>

              </div>

              <button
                onClick={() => navigate("/doc_reg")}
                className=" mt-12 w-full sm:w-auto px-10 py-3 rounded-xl bg-[#21a262] text-white font-semibold transition-all duration-300 hover:bg-[#1b8b54] hover:-translate-y-1hover:shadow-xl ">
                Join Now
              </button>

            </div>

          </div>

        </div>

      </section>
    </>
  )
}

export default Auth
import { useNavigate } from "react-router-dom";
import Login from "../components/authComponents/Login";


const Auth = () => {

  const navigate = useNavigate();

  return (
    <>
      <div className=" mt-6 grid grid-cols-1 md:grid-cols-2">
        <Login />

        <section className=" flex flex-col flex-1 items-center justify-center ">
          <h1 className=" text-center text-3xl mt-10 "> “Are you a<b> Dentist?</b><br /> Join our journey to create better smiles together.”</h1>
          <button className=" w-1/2 mt-14 border-none bg-sky-500 shadow:md hover:bg-sky-600 hover:shadow-xl p-2 rounded-xl text-white font-semibold" onClick={() => navigate("/doc_reg")}>Join now</button>
        </section>

      </div>
    </>
  )
}

export default Auth
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Toaster } from "react-hot-toast";


const MainLayout = () => {
    return (
        <>
            <Toaster
                position="top-center"
                toastOptions={{
                    style: {
                        background: "rgba(255,255,255,0.1)",
                        backdropFilter: "blur(10px)",
                        color: "#000000",
                    },
                }}
            />
            <div className=" px-4 md:px-4 lg:px-8 xl:px-16 2xl:px-32">
                <Navbar />
                <Outlet />

            </div>
            <Footer />
        </>
    )
}

export default MainLayout
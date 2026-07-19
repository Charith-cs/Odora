import { Outlet } from 'react-router-dom';
import DashNavbar from '../components/dashComponents/DashNavbar';
import { Toaster } from "react-hot-toast";
import DashSideNav from '../components/dashComponents/DashSideNav';


const DashLayout = () => {
    return (
        <>
            <Toaster />
            <div className="px-4 md:px-4 lg:px-8 xl:px-16 2xl:px-32">
                <DashNavbar />
                <div className="mt-6 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
                    <DashSideNav />
                    <main className="min-w-0">
                        <Outlet />
                    </main>
                </div>
            </div>
        </>
    )
}

export default DashLayout

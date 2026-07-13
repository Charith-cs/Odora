import { Link } from 'react-router-dom'

const DashNavbar = () => {
    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b ">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between ">

                <Link to="/" className="flex items-center">
                    <img src="/logo2.png" alt="logo" className="w-[150px] md:w-[170px]" />
                </Link>

            </div>

        </header>
    )
}

export default DashNavbar

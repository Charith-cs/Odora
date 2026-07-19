import { useState } from 'react';
import { Link } from "react-router-dom";
import { getUserFromStorage } from "../../services/getUserService";

const Navbar = () => {

  const links = [
    {
      title: "Who we are",
      slug: "who-we-are"
    },
    {
      title: "About us",
      slug: "about-us"
    },
    {
      title: "Ready to Smile with us?",
      slug: "ready-to-smile"
    }
  ];
  const currentUser = getUserFromStorage();
  const [open, setOpen] = useState(false);


  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-200">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">

        <Link to="/" className="flex items-center">
          <img src="/logo2.png" alt="logo" className="w-[150px] md:w-[170px]" />
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8 lg:gap-10 font-medium text-gray-700">
          {links.map((link) => (
            <Link
              key={link.slug}
              to={`/about/${link.slug}`}
              className="relative group"
            >
              <span className="group-hover:text-[#2596be] transition">
                {link.title}
              </span>

              {/* underline hover */}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#2596be] transition-all group-hover:w-full"></span>
            </Link>
          ))}

          {/* CTA */}
          <Link to={!currentUser ? "/auth" : `${currentUser.role}_dash`}>
            <button className="ml-4 bg-[#21a262] text-white px-5 py-2 rounded-full shadow hover:scale-105 transition">
              {!currentUser ? " Book Now" : "Dashboard"}
            </button>
          </Link>
        </div>

        {/* MOBILE ICON */}
        <div className="md:hidden z-50 text-2xl cursor-pointer" onClick={() => setOpen(!open)}>
          {open ? "✕" : "☰"}
        </div>

      </div>

      {/* MOBILE MENU */}
      <div className={`md:hidden fixed top-0 right-0 w-full h-screen bg-white z-40 flex flex-col items-center justify-center gap-8 text-lg font-medium transition-all duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>

        {links.map((link) => (
          <Link
            key={link.slug}
            onClick={() => setOpen(false)}
            to={`/about/${link.slug}`}
            className="hover:text-[#2596be] transition"
          >
            {link.title}
          </Link>
        ))}

        <Link to={!currentUser ? "/auth" : `${currentUser.role}_dash`} onClick={() => setOpen(false)}>
          <button className="bg-[#2596be] text-white px-6 py-3 rounded-full shadow">
            {!currentUser ? " Book Now" : "Dashboard"}
          </button>
        </Link>

      </div>

    </header>
  );
};

export default Navbar;
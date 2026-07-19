import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full mt-12 bg-gradient-to-br from-[#2596be] via-[#2596be] to-[#21a262] text-white">
      

      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">

        <div>
          <img src="/w_logo.png" alt="Odora logo" className="w-32 mb-4" />
          <p className="text-sm leading-relaxed text-gray-100">
            <b>Odora</b> makes dental care simple, accessible, and stress-free. 
            Connect with trusted clinics and book appointments easily — all in one place.
          </p>
        </div>


        <div>
          <h3 className="font-semibold text-lg mb-4">Services</h3>
          <ul className="space-y-2 text-sm">
            {[
              "Root Canal",
              "Scaling",
              "Implants",
              "Bridges",
              "Wisdom Tooth",
              "Braces",
              "Retainers"
            ].map((item, i) => (
              <li 
                key={i} 
                className="hover:text-gray-200 transition cursor-pointer"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to={"/about/about-us"} className="hover:text-gray-200 cursor-pointer">About Us</Link></li>
            <li><Link to={"/about/contact"} className="hover:text-gray-200 cursor-pointer">Contact</Link></li>
            <li><Link to={"/about/privacy-policy"} className="hover:text-gray-200 cursor-pointer">Privacy Policy</Link></li>
            <li><Link to={"/about/terms-and-conditions"} className="hover:text-gray-200 cursor-pointer">Terms & Conditions</Link></li>
          </ul>
        </div>


        <div>
          <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
          <div className="flex gap-4">
            <img src="/icons/facebook.png" alt="fb" className="w-8 h-8 hover:scale-110 transition cursor-pointer" />
            <img src="/icons/instagram.png" alt="ig" className="w-8 h-8 hover:scale-110 transition cursor-pointer" />
            <img src="/icons/whatsapp.png" alt="wa" className="w-8 h-8 hover:scale-110 transition cursor-pointer" />
          </div>
        </div>

      </div>


      <div className="border-t border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row 
                        justify-between items-center text-sm text-gray-200 gap-2">
          
          <span>© {new Date().getFullYear()} Odora. All rights reserved.</span>

          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer"><Link to={"/about/privacy-policy"}>Privacy</Link></span>
            <span className="hover:text-white cursor-pointer"><Link to={"/about/terms-and-conditions"}>Terms</Link></span>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
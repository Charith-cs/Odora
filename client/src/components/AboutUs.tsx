const AboutUs = () => {
    const features = [
        {
            title: "Easy Appointment Booking",
            description:
                "Book dental appointments quickly through a simple and user-friendly scheduling system.",
        },
        {
            title: "Clinic & Dentist Search",
            description:
                "Find dental clinics and professionals based on location and availability.",
        },
        {
            title: "Appointment Management",
            description:
                "View, manage, and organize appointments with ease from one centralized platform.",
        },
        {
            title: "Treatment Records",
            description:
                "Maintain accurate treatment histories to improve continuity of patient care.",
        },
        {
            title: "Clinic Administration",
            description:
                "Support efficient clinic operations with scheduling and management tools.",
        },
        {
            title: "Secure Platform",
            description:
                "User information is protected through secure authentication and responsible data handling.",
        },
    ];

    return (
        <div className="bg-white">

            <section className="bg-gradient-to-r from-cyan-50 to-blue-50 py-14 sm:py-16 lg:py-24 px-5">

                <div className="max-w-4xl mx-auto text-center">

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2596be] mb-6">
                        About Us
                    </h1>

                    <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-7 sm:leading-8">
                        Empowering patients and dental professionals with a smarter, simpler, and more connected healthcare experience.
                    </p>

                </div>

            </section>

            <section className="py-14 sm:py-16 lg:py-20 px-5">

                <div className="max-w-5xl mx-auto">

                    <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
                        About Odora
                    </h2>

                    <div className="w-24 h-1 bg-[#2596be] mx-auto rounded-full mb-10"></div>

                    <p className="text-gray-600 text-base sm:text-lg leading-7 sm:leading-8 text-center max-w-4xl mx-auto">
                        <span className="font-semibold text-[#2596be]">Odora</span> is
                        an integrated dental appointment and clinic management platform created to improve the way patients and dental professionals interact. Our system combines appointment scheduling, clinic management, and patient information into one secure and easy-to-use platform.
                    </p>

                    <p className="text-gray-600 text-base sm:text-lg leading-7 sm:leading-8 text-center max-w-4xl mx-auto mt-8">
                        By simplifying everyday processes, Odora helps reduce administrative work, improve communication, and provide patients with convenient access to quality dental care. Our goal is to support both healthcare providers and patients through innovative digital solutions.
                    </p>

                </div>

            </section>

            <section className="bg-gray-50 py-14 sm:py-16 lg:py-20 px-5">

                <div className="max-w-6xl mx-auto">

                    <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
                        What We Offer
                    </h2>

                    <div className="w-24 h-1 bg-[#2596be] mx-auto rounded-full mb-12"></div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="bg-white border border-gray-200 rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#2596be]"
                            >
                                <h3 className="text-lg font-semibold text-[#2596be] mb-3">
                                    {feature.title}
                                </h3>

                                <p className="text-gray-600 leading-7">
                                    {feature.description}
                                </p>
                            </div>
                        ))}

                    </div>

                </div>

            </section>

            <section className="py-14 sm:py-16 lg:py-20 px-5">

                <div className="max-w-5xl mx-auto text-center">

                    <h2 className="text-2xl sm:text-3xl font-bold mb-8">
                        Our Commitment
                    </h2>

                    <div className="w-24 h-1 bg-[#2596be] mx-auto rounded-full mb-10"></div>

                    <p className="text-gray-600 text-base sm:text-lg leading-7 sm:leading-8">
                        We are committed to providing a secure, reliable, and user-friendly platform that enhances the dental care experience for everyone. By continuously improving our technology and listening to the needs of patients and clinics, we aim to create lasting value for the entire dental healthcare community.
                    </p>

                </div>

            </section>

        </div>
    );
};

export default AboutUs;
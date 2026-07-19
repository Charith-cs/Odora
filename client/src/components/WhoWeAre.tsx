const WhoWeAre = () => {
    const values = [
        {
            title: "Patient First",
            description:
                "Every feature is designed to improve convenience, accessibility, and the overall patient experience.",
        },
        {
            title: "Innovation",
            description:
                "We embrace modern technology to simplify dental appointment management and clinic operations.",
        },
        {
            title: "Security",
            description:
                "Protecting user information through secure authentication and responsible data management.",
        },
        {
            title: "Reliability",
            description:
                "Delivering a dependable platform that patients and clinics can trust every day.",
        },
        {
            title: "Accessibility",
            description:
                "Making dental healthcare easier to access through a simple and user-friendly digital platform.",
        },
        {
            title: "Trust",
            description:
                "Building lasting confidence between patients, clinics, and dental professionals.",
        },
    ];

    return (
        <div className="bg-white">
            <section className="bg-gradient-to-r from-cyan-50 to-blue-50 py-14 sm:py-16 lg:py-24 px-5">
                <div className="max-w-4xl mx-auto text-center">

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2596be] mb-6">
                        Who We Are
                    </h1>

                    <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-7 sm:leading-8">
                        Connecting patients with trusted dental professionals through
                        a modern, secure, and user-friendly appointment management platform.
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
                        <span className="font-semibold text-[#2596be]">Odora</span> is a modern dental appointment and clinic management platform designed to simplify the way patients connect with dental care providers. Our goal is to make finding the right dentist, booking appointments, and managing dental visits easier, faster, and more convenient for everyone.
                    </p>

                    <p className="text-gray-600 text-base sm:text-lg leading-7 sm:leading-8 text-center max-w-4xl mx-auto mt-8">
                        We believe quality dental care should be accessible without the frustration of long waiting times or complicated booking processes. By bringing patients, dental professionals, and clinics together in one secure platform, Odora creates a seamless experience from appointment scheduling to treatment management while ensuring reliability, security, and ease of use.
                    </p>

                </div>
            </section>

            <section className="bg-gray-50 py-14 sm:py-16 lg:py-20 px-5">

                <div className="max-w-6xl mx-auto">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#2596be]">

                            <h3 className="text-xl sm:text-2xl font-bold text-[#2596be] mb-4">
                                Our Mission
                            </h3>

                            <p className="text-gray-600 leading-7">
                                To improve access to dental healthcare by providing a simple, efficient, and technology-driven appointment management solution that benefits both patients and dental professionals.
                            </p>

                        </div>

                        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#2596be]">

                            <h3 className="text-xl sm:text-2xl font-bold text-[#2596be] mb-4">
                                Our Vision
                            </h3>

                            <p className="text-gray-600 leading-7">
                                To become the trusted digital platform that transforms how dental clinics and patients interact through innovation, convenience, and excellent service.
                            </p>

                        </div>

                    </div>

                </div>

            </section>

            <section className="py-14 sm:py-16 lg:py-20 px-5">

                <div className="max-w-6xl mx-auto">

                    <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
                        Our Core Values
                    </h2>
                    <div className="w-24 h-1 bg-[#2596be] mx-auto rounded-full mb-12"></div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                        {values.map((value) => (
                            <div
                                key={value.title}
                                className="border border-gray-200 rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#2596be]"
                            >
                                <h4 className="text-lg font-semibold text-[#2596be] mb-3">
                                    {value.title}
                                </h4>

                                <p className="text-gray-600 leading-7">
                                    {value.description}
                                </p>
                            </div>
                        ))}

                    </div>
                </div>
            </section>
        </div>
    );
};

export default WhoWeAre;
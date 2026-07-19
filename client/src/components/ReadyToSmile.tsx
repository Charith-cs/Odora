const ReadyToSmile = () => {
    const reasons = [
        {
            title: "Simple Appointment Booking",
            description:
                "Schedule your dental appointments in just a few simple steps without unnecessary delays.",
        },
        {
            title: "Trusted Dental Professionals",
            description:
                "Connect with experienced dentists and reputable clinics through one convenient platform.",
        },
        {
            title: "Convenient Experience",
            description:
                "Manage appointments, treatment history, and clinic information from a single place.",
        },
        {
            title: "Secure & Reliable",
            description:
                "Your information is protected through secure authentication and responsible data management.",
        },
    ];

    return (
        <div className="bg-white">

            <section className="bg-gradient-to-r from-cyan-50 to-blue-50 py-14 sm:py-16 lg:py-24 px-5">

                <div className="max-w-4xl mx-auto text-center">

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2596be] mb-6">
                        Ready to Smile With Us?
                    </h1>

                    <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-7 sm:leading-8">
                        Your journey toward better oral health begins with one simple step. Let Odora make finding and managing your dental care easier than ever.
                    </p>

                </div>

            </section>

            <section className="py-14 sm:py-16 lg:py-20 px-5">

                <div className="max-w-5xl mx-auto text-center">

                    <h2 className="text-2xl sm:text-3xl font-bold mb-8">
                        Start Your Dental Journey
                    </h2>

                    <div className="w-24 h-1 bg-[#2596be] mx-auto rounded-full mb-10"></div>

                    <p className="text-gray-600 text-base sm:text-lg leading-7 sm:leading-8 max-w-4xl mx-auto">
                        Taking care of your smile has never been easier. Whether you're scheduling a routine check-up or planning future dental care, Odora helps you connect with trusted dental professionals while making appointment management simple, convenient, and stress-free.
                    </p>

                </div>

            </section>

            <section className="bg-gray-50 py-14 sm:py-16 lg:py-20 px-5">

                <div className="max-w-6xl mx-auto">

                    <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
                        Why Choose Odora?
                    </h2>

                    <div className="w-24 h-1 bg-[#2596be] mx-auto rounded-full mb-12"></div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                        {reasons.map((reason) => (
                            <div
                                key={reason.title}
                                className="bg-white border border-gray-200 rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#2596be]"
                            >
                                <h3 className="text-lg font-semibold text-[#2596be] mb-3">
                                    {reason.title}
                                </h3>

                                <p className="text-gray-600 leading-7">
                                    {reason.description}
                                </p>
                            </div>
                        ))}

                    </div>

                </div>

            </section>

            <section className="py-14 sm:py-16 lg:py-20 px-5">

                <div className="max-w-4xl mx-auto text-center">

                    <h2 className="text-2xl sm:text-3xl font-bold mb-8">
                        Your Smile Starts Here
                    </h2>

                    <div className="w-24 h-1 bg-[#2596be] mx-auto rounded-full mb-10"></div>

                    <p className="text-gray-600 text-base sm:text-lg leading-7 sm:leading-8">
                        At Odora, we believe that every healthy smile begins with the right care at the right time. Our mission is to make dental healthcare more accessible, organized, and convenient for everyone. We look forward to supporting your journey toward a healthier and brighter smile.
                    </p>

                </div>

            </section>

        </div>
    );
};

export default ReadyToSmile;
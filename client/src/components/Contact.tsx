const Contact = () => {
    const contactDetails = [
        {
            title: "Address",
            value: "123 Main Street, Colombo 07, Sri Lanka",
        },
        {
            title: "Phone",
            value: "+94 11 234 5678",
        },
        {
            title: "Email",
            value: "support@odora.com",
        },
        {
            title: "Working Hours",
            value: "Monday - Friday | 8:00 AM - 6:00 PM",
        },
    ];

    return (
        <div className="bg-white">

            {/* Hero */}
            <section className="bg-gradient-to-r from-cyan-50 to-blue-50 py-14 sm:py-16 lg:py-24 px-5">

                <div className="max-w-4xl mx-auto text-center">

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2596be] mb-6">
                        Contact Us
                    </h1>

                    <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-7 sm:leading-8">
                        We're here to help. If you have questions, feedback, or
                        need assistance with Odora, we'd love to hear from you.
                    </p>

                </div>

            </section>

            {/* Contact Information */}
            <section className="py-14 sm:py-16 lg:py-20 px-5">

                <div className="max-w-6xl mx-auto">

                    <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
                        Get in Touch
                    </h2>

                    <div className="w-24 h-1 bg-[#2596be] mx-auto rounded-full mb-12"></div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                        {contactDetails.map((item) => (
                            <div
                                key={item.title}
                                className="bg-white border border-gray-200 rounded-xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#2596be]"
                            >
                                <h3 className="text-lg font-semibold text-[#2596be] mb-3">
                                    {item.title}
                                </h3>

                                <p className="text-gray-600 leading-7">
                                    {item.value}
                                </p>

                            </div>
                        ))}

                    </div>

                </div>

            </section>

            {/* About Contact */}
            <section className="bg-gray-50 py-14 sm:py-16 lg:py-20 px-5">

                <div className="max-w-5xl mx-auto text-center">

                    <h2 className="text-2xl sm:text-3xl font-bold mb-8">
                        We're Always Ready to Help
                    </h2>

                    <div className="w-24 h-1 bg-[#2596be] mx-auto rounded-full mb-10"></div>

                    <p className="text-gray-600 text-base sm:text-lg leading-8 max-w-4xl mx-auto">
                        Whether you are a patient looking for assistance, a dental
                        professional seeking support, or simply interested in
                        learning more about Odora, our team is committed to
                        providing prompt and reliable assistance. Your questions,
                        feedback, and suggestions help us continuously improve
                        our platform and deliver a better healthcare experience.
                    </p>

                </div>

            </section>

            {/* FAQ */}
            <section className="py-14 sm:py-16 lg:py-20 px-5">

                <div className="max-w-5xl mx-auto">

                    <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
                        Frequently Asked Questions
                    </h2>

                    <div className="w-24 h-1 bg-[#2596be] mx-auto rounded-full mb-12"></div>

                    <div className="space-y-6">

                        <div className="border rounded-xl p-6">
                            <h3 className="font-semibold text-[#2596be] mb-3">
                                How do I book an appointment?
                            </h3>

                            <p className="text-gray-600 leading-7">
                                Simply create an account, search for a clinic or
                                dentist, choose an available session, and confirm
                                your appointment.
                            </p>
                        </div>

                        <div className="border rounded-xl p-6">
                            <h3 className="font-semibold text-[#2596be] mb-3">
                                Can I reschedule or cancel an appointment?
                            </h3>

                            <p className="text-gray-600 leading-7">
                                Yes. You can manage your appointments through
                                your dashboard, subject to the clinic's
                                scheduling policies.
                            </p>
                        </div>

                        <div className="border rounded-xl p-6">
                            <h3 className="font-semibold text-[#2596be] mb-3">
                                Is my personal information secure?
                            </h3>

                            <p className="text-gray-600 leading-7">
                                Yes. Odora uses secure authentication and role-
                                based access control to help protect user
                                information.
                            </p>
                        </div>

                    </div>

                </div>

            </section>

        </div>
    );
};

export default Contact;
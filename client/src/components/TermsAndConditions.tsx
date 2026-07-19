const TermsAndConditions = () => {
    const sections = [
        {
            title: "1. Acceptance of Terms",
            content:
                "By accessing or using Odora, you agree to comply with these Terms and Conditions. If you do not agree with any part of these terms, you should discontinue using the platform.",
        },
        {
            title: "2. Use of the Platform",
            content:
                "Odora provides a digital platform for managing dental appointments and clinic-related services. Users are responsible for providing accurate information and using the platform only for lawful and intended purposes.",
        },
        {
            title: "3. User Accounts",
            content:
                "Users are responsible for maintaining the confidentiality of their account credentials. You are responsible for all activities performed under your account and should notify the platform administrator if you suspect unauthorized access.",
        },
        {
            title: "4. Appointment Management",
            content:
                "Patients are responsible for booking, reviewing, and managing their appointments accurately. Dental clinics may update appointment availability, schedules, or clinic information when necessary.",
        },
        {
            title: "5. Responsibilities of Users",
            content:
                "Users agree not to misuse the platform, provide false information, attempt unauthorized access, interfere with system operations, or engage in any activity that may compromise the security or reliability of Odora.",
        },
        {
            title: "6. Privacy",
            content:
                "Your personal information is handled according to Odora's Privacy Policy. By using the platform, you acknowledge that your information will be processed to provide appointment and clinic management services.",
        },
        {
            title: "7. Intellectual Property",
            content:
                "All content, branding, logos, designs, and software associated with Odora remain the intellectual property of the platform unless otherwise stated. Unauthorized copying, modification, or distribution is prohibited.",
        },
        {
            title: "8. Limitation of Liability",
            content:
                "Odora provides tools to facilitate appointment scheduling and clinic management. While we strive to maintain accurate information and reliable service, we cannot guarantee uninterrupted availability or accept responsibility for losses resulting from system interruptions or inaccurate information provided by users.",
        },
        {
            title: "9. Changes to the Terms",
            content:
                "These Terms and Conditions may be updated periodically to reflect improvements or changes to the platform. Continued use of Odora after updates indicates acceptance of the revised terms.",
        },
        {
            title: "10. Contact",
            content:
                "If you have questions regarding these Terms and Conditions, please contact the Odora support team through the communication channels available within the platform.",
        },
    ];

    return (
        <div className="bg-white">

            {/* Hero */}
            <section className="bg-gradient-to-r from-cyan-50 to-blue-50 py-14 sm:py-16 lg:py-24 px-5">

                <div className="max-w-4xl mx-auto text-center">

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2596be] mb-6">
                        Terms & Conditions
                    </h1>

                    <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-7 sm:leading-8">
                        Please read these Terms and Conditions carefully before
                        using Odora. They outline the rights, responsibilities,
                        and expectations for all users of the platform.
                    </p>

                </div>

            </section>

            {/* Introduction */}
            <section className="py-14 sm:py-16 lg:py-20 px-5">

                <div className="max-w-5xl mx-auto">

                    <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
                        Using Odora Responsibly
                    </h2>

                    <div className="w-24 h-1 bg-[#2596be] mx-auto rounded-full mb-10"></div>

                    <p className="text-gray-600 text-base sm:text-lg leading-8 text-center max-w-4xl mx-auto">
                        Odora is designed to simplify dental appointment booking
                        and clinic management while providing a secure and
                        reliable experience for patients, clinics, and healthcare
                        professionals. By using the platform, you agree to follow
                        these terms to help maintain a safe and trustworthy
                        environment for all users.
                    </p>

                </div>

            </section>

            {/* Terms */}
            <section className="bg-gray-50 py-14 sm:py-16 lg:py-20 px-5">

                <div className="max-w-5xl mx-auto space-y-6">

                    {sections.map((section) => (
                        <div
                            key={section.title}
                            className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 transition-all duration-300 hover:shadow-lg hover:border-[#2596be]"
                        >
                            <h3 className="text-xl font-semibold text-[#2596be] mb-4">
                                {section.title}
                            </h3>

                            <p className="text-gray-600 leading-8">
                                {section.content}
                            </p>
                        </div>
                    ))}

                </div>

            </section>

            {/* Closing */}
            <section className="py-14 sm:py-16 lg:py-20 px-5">

                <div className="max-w-4xl mx-auto text-center">

                    <h2 className="text-2xl sm:text-3xl font-bold mb-8">
                        Thank You for Choosing Odora
                    </h2>

                    <div className="w-24 h-1 bg-[#2596be] mx-auto rounded-full mb-10"></div>

                    <p className="text-gray-600 text-base sm:text-lg leading-8">
                        We appreciate your trust in Odora. By following these
                        Terms and Conditions, you help us provide a secure,
                        reliable, and efficient platform that supports better
                        communication between patients and dental healthcare
                        professionals.
                    </p>

                </div>

            </section>

        </div>
    );
};

export default TermsAndConditions;
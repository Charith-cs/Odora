const PrivacyPolicy = () => {
    const sections = [
        {
            title: "1. Information We Collect",
            content:
                "Odora collects information necessary to provide our dental appointment and clinic management services. This may include your name, email address, phone number, date of birth, appointment details, and other information you voluntarily provide while using the platform.",
        },
        {
            title: "2. How We Use Your Information",
            content:
                "The information collected is used to manage appointments, improve user experience, provide secure access to the platform, facilitate communication between patients and clinics, and maintain accurate healthcare records within the system.",
        },
        {
            title: "3. Data Security",
            content:
                "We are committed to protecting your personal information through appropriate security measures. User accounts are protected using secure authentication, and access to information is limited to authorized users based on their assigned roles.",
        },
        {
            title: "4. Information Sharing",
            content:
                "Odora does not sell or share your personal information with third parties for marketing purposes. Information is only shared with authorized dental clinics and healthcare professionals when required to provide the requested healthcare services.",
        },
        {
            title: "5. Cookies and Session Data",
            content:
                "Odora may use browser storage and session technologies to maintain secure user authentication and improve the overall user experience. These technologies are not used to collect unnecessary personal information.",
        },
        {
            title: "6. Your Privacy Rights",
            content:
                "Users have the right to review and update their personal information through their account settings. If you believe any information is incorrect, you may request corrections through the appropriate clinic or system administrator.",
        },
        {
            title: "7. Changes to This Policy",
            content:
                "This Privacy Policy may be updated from time to time as the platform evolves. Any significant changes will be reflected within the application to ensure users remain informed.",
        },
        {
            title: "8. Contact",
            content:
                "If you have questions regarding this Privacy Policy or the handling of your personal information, please contact the Odora support team through the communication channels provided within the platform.",
        },
    ];

    return (
        <div className="bg-white">

            <section className="bg-gradient-to-r from-cyan-50 to-blue-50 py-14 sm:py-16 lg:py-24 px-5">

                <div className="max-w-4xl mx-auto text-center">

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2596be] mb-6">
                        Privacy Policy
                    </h1>

                    <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-7 sm:leading-8">
                        Your privacy is important to us. This policy explains how Odora collects, uses, stores, and protects your personal information while using our platform.
                    </p>

                </div>

            </section>

            <section className="py-14 sm:py-16 lg:py-20 px-5">

                <div className="max-w-5xl mx-auto">

                    <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
                        Our Commitment to Privacy
                    </h2>

                    <div className="w-24 h-1 bg-[#2596be] mx-auto rounded-full mb-10"></div>

                    <p className="text-gray-600 text-base sm:text-lg leading-8 text-center max-w-4xl mx-auto">
                        Odora respects your privacy and is committed to protecting the personal information you provide while using our dental appointment and clinic management platform. We collect only the information necessary to provide our services and continuously work to maintain the security, confidentiality, and integrity of your data.
                    </p>

                </div>

            </section>


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


            <section className="py-14 sm:py-16 lg:py-20 px-5">

                <div className="max-w-4xl mx-auto text-center">

                    <h2 className="text-2xl sm:text-3xl font-bold mb-8">
                        Protecting Your Trust
                    </h2>

                    <div className="w-24 h-1 bg-[#2596be] mx-auto rounded-full mb-10"></div>

                    <p className="text-gray-600 text-base sm:text-lg leading-8">
                        Protecting your personal information is one of Odora's highest priorities. We are committed to maintaining a secure, transparent, and trustworthy platform that supports both patients and dental healthcare professionals while respecting user privacy.
                    </p>

                </div>

            </section>

        </div>
    );
};

export default PrivacyPolicy;
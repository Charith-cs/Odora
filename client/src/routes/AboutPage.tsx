import { useParams } from "react-router-dom";
import WhoWeAre from "../components/WhoWeAre";
import AboutUs from "../components/AboutUs";
import ReadyToSmile from "../components/ReadyToSmile";
import PrivacyPolicy from "../components/PrivacyPolicy";
import TermsAndConditions from "../components/TermsAndConditions";
import Contact from "../components/Contact";

const AboutPage = () => {

    const { section } = useParams();

    return (
        <>
            {section === "who-we-are" && <WhoWeAre />}
            {section === "about-us" && <AboutUs />}
            {section === "ready-to-smile" && <ReadyToSmile />}
            {section === "privacy-policy" && <PrivacyPolicy />}
            {section === "terms-and-conditions" && <TermsAndConditions />}
            {section === "contact" && <Contact />}
        </>
    )
}

export default AboutPage

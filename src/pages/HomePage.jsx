/* eslint-disable react/no-unescaped-entities */
import CustomCarousel from "../components/Carousel";
import { useContext } from "react";
import { WebsiteInfoContext } from "../context/WebsiteInfoContext";
import HowItWorks from "../components/HomePageSections/HowItWork";
import DonationSection from "../components/HomePageSections/DonationSection";
import EventsSections from "../components/HomePageSections/EventsSections";
import OurCollobratorsSection from "../components/HomePageSections/OurCollobratorsSection";
import EasyReportingSection from "../components/HomePageSections/EasyReportingSection";
import Testimonials from "../components/HomePageSections/Testimonials";
import TrackAnimalStatusSection from "../components/HomePageSections/TrackAnimalStatusSection";
import useWindowWidth from "../hooks/useWindowWidth";
import { Helmet } from "react-helmet-async";

function HomePage() {
  const websiteInfo = useContext(WebsiteInfoContext);
  const windowWidth = useWindowWidth();

  const isMobile = windowWidth <= 768;

  return (
    <div className="home-page">
      <Helmet>
        <title>Raksha Animal - Rescue and Care for Injured Animals</title>
        <meta
          name="description"
          content="Join Raksha Animal, a community-driven platform dedicated to rescuing and caring for injured animals. Report cases, connect with local NGOs, and volunteer to make a difference today."
        />
        <meta
          name="keywords"
          content="animal rescue, report injured animals, NGOs, volunteer, animal care"
        />
        <meta name="author" content="Raksha Animal" />
        <meta
          property="og:title"
          content="Raksha Animal Rescue | Help Save Injured Animals"
        />
        <meta
          property="og:description"
          content="Report injured animals and get help from nearby NGOs. Save lives with Raksha Animal Rescue."
        />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/dfwtmoxzp/image/upload/v1726465095/z3laja3v7rn0llemrgx6.svg"
        />
        <meta property="og:url" content="https://rakshaanimal.org/" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="carousel">
        <CustomCarousel
          images={
            isMobile
              ? websiteInfo.carouselMobileImages
              : websiteInfo.carouselImages
          }
        />
      </div>

      <HowItWorks />
      <DonationSection />
      <EasyReportingSection />
      <EventsSections />
      <OurCollobratorsSection />
      <Testimonials />
      <TrackAnimalStatusSection />
    </div>
  );
}

export default HomePage;

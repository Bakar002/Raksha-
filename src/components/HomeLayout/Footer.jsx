/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { generateLinks } from "../../Utils/GenerateLinkUtils";
import { Divider, Typography } from "@mui/material";
import { Facebook, Instagram, YouTube } from "@mui/icons-material";
import { motion } from "framer-motion";

const Footer = ({ categories, websiteInfo }) => {
  const quickLinksCategorie = [
    "Advocacy and Awareness",
    "Media and Achievements",
    "Special Initiatives",
  ];
  const generatedQuickLinks = generateLinks(categories, quickLinksCategorie);
  const quickLinks = [
    { label: "Report Animal Incident", link: "/report-animal-incident" },
    { label: "Login", link: "users/login" },
    { label: "Track Animal Status ", link: "/track-animal-status" },
    { label: "Register Your NGO", link: "/register-ngo" },
    { label: "Fundraising", link: "/fundraisings" },
    { label: "Our Gallery", link: "/ourGallary" },
    { label: "Our Members", link: "/our-members" },
    { label: "Our Volunteers", link: "/our-volunteers" },
    ...generatedQuickLinks,
  ];

  const informationCategories = [
    "About Us",
    "Contact and Policies",
    "Membership and Volunteering",
    "Resources and Downloads",
  ];
  const generatedInfoLinks = generateLinks(categories, informationCategories);

  const upcommingProjectsLinks = generateLinks(categories, ["Project Reports"]);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeIn}
    >
      <motion.div className="links" variants={staggerContainer}>
        <motion.div className="contact" variants={fadeIn}>
          <h3>Contact</h3>
          <div>
            <p className="fw-bold">Address:</p>
            <p>{websiteInfo?.regdOfficeAddress}</p>
          </div>
          <div>
            <p className="fw-bold">Email Address:</p>
            <p>{websiteInfo?.email}</p>
          </div>
          <div className="social-media-links">
            <Typography paddingTop=".4rem" fontWeight="600">
              Follow us
            </Typography>
            <a
              href="https://www.facebook.com/rakshaanimal"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook
                sx={{
                  fontSize: "30px",
                  color: "white",
                  "&:hover": {
                    color: "black",
                  },
                  "&:active": {
                    color: "black",
                  },
                }}
              />
            </a>
            <a
              href="https://www.instagram.com/rakshaanimal"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram
                sx={{
                  fontSize: "30px",
                  color: "white",
                  "&:hover": {
                    color: "black",
                  },
                  "&:active": {
                    color: "black",
                  },
                }}
              />
            </a>
            <a
              href="https://www.youtube.com/@rakshaanimal"
              target="_blank"
              rel="noopener noreferrer"
            >
              <YouTube
                sx={{
                  fontSize: "30px",
                  color: "white",
                  "&:hover": {
                    color: "black",
                  },
                  "&:active": {
                    color: "black",
                  },
                }}
              />
            </a>
          </div>
        </motion.div>

        <motion.div className="quick-links" variants={fadeIn}>
          <h3 style={{ paddingTop: ".5rem" }}>Quick Links</h3>
          {quickLinks.map((link) => (
            <Link key={link.link} to={link.link}>
              {link.label}
            </Link>
          ))}
        </motion.div>

        <motion.div className="information" variants={fadeIn}>
          <h3 style={{ paddingTop: ".5rem" }}>Information</h3>
          {generatedInfoLinks.map((link) => (
            <Link key={link.link} to={link.link}>
              {link.label}
            </Link>
          ))}
        </motion.div>

        <motion.div className="project-reports" variants={fadeIn}>
          <h3 style={{ paddingTop: ".5rem" }}>Upcoming Projects</h3>
          {upcommingProjectsLinks.map((link) => (
            <Link key={link.link} to={link.link}>
              {link.label}
            </Link>
          ))}
        </motion.div>
      </motion.div>

      <Divider
        sx={{ background: "white" }}
        orientation="horizontal"
        variant="middle"
        flexItem
      />

      <motion.div
        className="extra-info"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <motion.div className="org-info" variants={fadeIn}>
          <img className="logo" src="/images/logo.png" alt="" />
          <div className="d-flex flex-column justify-center">
            <Typography>Raksha Animal &#xa9; 2024</Typography>
            <Typography>
              <span>Designed By:</span> Adinberg InfoTech Solutions.
            </Typography>
          </div>
        </motion.div>

        <motion.div className="social-media-links" variants={fadeIn}>
          <a
            href="https://www.facebook.com/rakshaanimal"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Facebook
              sx={{
                fontSize: "30px",
                color: "white",
                "&:hover": {
                  color: "black",
                },
                "&:active": {
                  color: "black",
                },
              }}
            />
          </a>
          <a
            href="https://www.instagram.com/rakshaanimal"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram
              sx={{
                fontSize: "30px",
                color: "white",
                "&:hover": {
                  color: "black",
                },
                "&:active": {
                  color: "black",
                },
              }}
            />
          </a>
          <a
            href="https://www.youtube.com/@rakshaanimal"
            target="_blank"
            rel="noopener noreferrer"
          >
            <YouTube
              sx={{
                fontSize: "30px",
                color: "white",
                "&:hover": {
                  color: "black",
                },
                "&:active": {
                  color: "black",
                },
              }}
            />
          </a>
        </motion.div>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;

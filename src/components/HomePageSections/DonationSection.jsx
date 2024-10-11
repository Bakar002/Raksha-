import {
  Box,
  Button,
  Divider,
  Typography,
  LinearProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "../../api/axios";
import { CurrencyRupee } from "@mui/icons-material";
import { transformPagesToCategories } from "../../Utils/transformPagesToCategories ";
import { pagesContext } from "../../context/PagesContext";
import { generateLinks } from "../../Utils/GenerateLinkUtils";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion, useInView } from "framer-motion";

const DonationSection = () => {
  const [posts, setPosts] = useState([]);
  const pages = useContext(pagesContext);
  const categories = transformPagesToCategories(pages);
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const links = generateLinks(categories, ["Donations and Fundraising"]);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const getAllFundraisingPages = async () => {
      const category = "Donations and Fundraising";

      try {
        const response = await axios.get(
          `/api/pages/category?category=${encodeURIComponent(category)}`
        );
        console.log(response.data);
        if (response.status === 200) setPosts(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    getAllFundraisingPages();
  }, []);

  // Slick settings with responsive breakpoints
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    centerMode: true,
    centerPadding: "10px",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerPadding: "10px",
        },
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: "10px",
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: "5px",
        },
      },
    ],
  };

  return (
    <Box className="fundraising-section" ref={ref}>
      <Box paddingBottom="2rem">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : -50 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <Typography
            color="white"
            textAlign="center"
            variant={isSmallScreen ? "h3" : "h2"}
          >
            We Take Care
          </Typography>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <Typography color="white" textAlign="center">
            We connect Nonprofits, Donors and Companies across India.
          </Typography>
        </motion.div>
      </Box>
      <Slider {...settings}>
        {posts.map((post, index) => {
          const progress = (post.raised / post.goal) * 100;

          return (
            <Box
              backgroundColor="white"
              borderRadius="1rem"
              key={post._id}
              initial={{ opacity: 0, y: 50 }} // Start with opacity 0 and translate Y by 50px
              animate={{ opacity: 1, y: 0 }} // Animate to full opacity and Y = 0
              transition={{ duration: 1, ease: "easeInOut" }} // Control animation duration and easing
              whileHover={{ scale: 1.05 }}
              boxShadow="5px 5px 5px gray"
              style={{ cursor: "pointer" }} // Add margin for spacing between cards
            >
              <Box position="relative">
                <img
                  style={{
                    width: "100%", // Ensure the image takes full width of the parent
                    height: "auto",
                    borderTopLeftRadius: "1rem",
                    borderTopRightRadius: "1rem",
                  }}
                  src={post.bannerImage[0].url}
                  alt=""
                />
                <Box
                  position="absolute"
                  bottom="0"
                  left="0"
                  right="0"
                  padding="0.5rem"
                  sx={{
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`${links[index].link}`)}
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0))",
                    borderBottomLeftRadius: "1rem",
                    borderBottomRightRadius: "1rem",
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{
                      opacity: isInView ? 1 : 0,
                      y: isInView ? 0 : -50,
                    }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  >
                    <Typography color="white" variant="h5">
                      {post.title}
                    </Typography>
                  </motion.div>
                </Box>
              </Box>
              <Box
                display="flex"
                paddingInline="1rem"
                justifyContent="space-between"
                marginTop="1rem"
              >
                <Box display="grid">
                  <Typography>Raised</Typography>
                  <Typography
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    gap=".3rem"
                    fontWeight={600}
                  >
                    <CurrencyRupee /> {post.raised}
                  </Typography>
                </Box>
                <Divider orientation="vertical" variant="middle" flexItem />
                <Box display="grid">
                  <Typography>Goal</Typography>
                  <Typography
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    gap=".3rem"
                    fontWeight={600}
                  >
                    <CurrencyRupee /> {post.goal}
                  </Typography>
                </Box>
              </Box>
              <Box paddingInline="1rem" marginTop="1rem">
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  style={{ height: "0.5rem", borderRadius: "0.25rem" }}
                />
                <Typography textAlign="center" marginTop="0.5rem">
                  Donated by {post.raisedBy} People in {post.days} Days
                </Typography>
              </Box>
              <Box padding="1rem">
                <Button
                  onClick={() => navigate("/special-initiatives/donate-now")}
                  variant="text"
                  color="primary"
                  fullWidth
                  sx={{
                    "&:hover": {
                      backgroundColor: "primary.main", // Set background to primary color on hover
                      color: "white", // Change text color to white on hover
                    },
                  }}
                >
                  Donate now
                </Button>
              </Box>
            </Box>
          );
        })}
      </Slider>
    </Box>
  );
};

export default DonationSection;

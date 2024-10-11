import { FormatQuote } from "@mui/icons-material";
import { Typography, Box } from "@mui/material";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Testimonials = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    centerMode: true,
    centerPadding: "10px",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          centerPadding: "10px",
        },
      },
      {
        breakpoint: 600,
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

  const testimonials = [
    {
      title: " ",
      name: "Mr. Rohan Gupta",
      url: "/images/img8.jpg",
      message: "Raksha Animal is doing great work for animals. Keep it up!",
    },
    {
      title: " ",
      name: "Dr. Priya Shah",
      url: "/images/img1.jpg",
      message:
        "Aadi and Dhairya are true animal lovers. Their dedication is inspiring!",
    },

    {
      title: " ",
      name: "Mr. John D'Souza",
      url: "/images/img4.jpg",
      message:
        "I'm impressed by Raksha Animal's efforts to rescue and rehabilitate animals.",
    },
    {
      title: " ",
      name: "Miss Rukmani Jaiswal",
      url: "/images/img5.jpg",
      message:
        "Raksha Animal is a blessing for animals in need. Thank you, Aadi and Dhairya!",
    },
    {
      title: " ",
      name: "Mr. Sameer Khan",
      url: "/images/img2.jpg",
      message:
        "Their love and care for animals are evident in everything they do. Great job, Raksha Animal!",
    },
    {
      title: "  ",
      name: "Mr. Raj Mehta",
      url: "/images/img3.jpg",
      message:
        "Raksha Animal is making a real difference in the lives of animals. Keep shining!",
    },
    {
      title: " ",
      name: "Mrs. Sunita Chauhan",
      url: "/images/img7.jpg",
      message:
        "Aadi and Dhairya's passion for animal welfare is admirable. Best wishes, Raksha Animal!",
    },
    {
      title: " ",
      name: "Mrs. Samaira Shaikh",
      url: "/images/img9.jpg",
      message:
        "Raksha Animal's work is heartwarming. Thank you for all that you do!",
    },
    {
      title: "",
      name: "Mr. Harpreet Singh",
      url: "/images/img6.jpg",
      message:
        "Raksha Animal's commitment to animal rescue and rehabilitation are incredible.",
    },
  ];

  return (
    <section className="testimonials" ref={ref}>
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }} // Initial state
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }} // Animate based on view state
          transition={{ duration: 1 }}
        >
          <Typography fontWeight="600" textAlign="center" fontSize="38px">
            TESTIMONIALS
          </Typography>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }} // Initial state
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }} // Animate based on view state
          transition={{ duration: 1 }}
        >
          <Typography textAlign="center" variant="h5" paddingBottom="2rem">
            What people say about us
          </Typography>
        </motion.div>
      </div>
      <Slider {...settings}>
        {testimonials.map((item, index) => (
          <motion.div
            key={index}
            className="testimonial-card"
            initial={{ opacity: 0, y: 20 }} // Initial state
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }} // Animate based on view state
            transition={{ duration: 1 }}
            whileHover={{ scale: 1.05 }}
          >
            <Box>
              <FormatQuote
                className="formateQuote formate-left"
                fontSize="large"
                color="primary"
              />

              {/* <div className="interded-couma" alt="testimonial">
                <FormatQuote
                  fontSize="large"
                  color="primary"
                  sx={{
                    transform: "rotate(180deg) !important",
                  }}
                />
                <FormatQuote fontSize="large" color="primary" />
              </div> */}

              <FormatQuote
                className="formateQuote formate-right"
                fontSize="large"
                color="primary"
                sx={{
                  transform: "rotate(180deg) !important",
                }}
              />
            </Box>
            <Box className="d-flex gap-400 flex-column">
              <Typography fontWeight={500} variant="h5">
                {item.title}
              </Typography>

              <Typography>{item.message}</Typography>

              <Typography fontWeight={600} variant="h5">
                {item.name}
              </Typography>
            </Box>
          </motion.div>
        ))}
      </Slider>
    </section>
  );
};

export default Testimonials;

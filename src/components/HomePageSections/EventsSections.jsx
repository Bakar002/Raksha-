import { useEffect, useRef, useState } from "react";
import axios from "../../api/axios";
import Slider from "react-slick";
import { FmdGood } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  Divider,
  Typography,
  Button,
} from "@mui/material";
import dayjs from "dayjs";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const EventsSections = () => {
  const [AllEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventType, setSelectedEventType] = useState("Ongoing"); // Default to 'Ongoing'
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    const getAllEvents = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/events");
        if (response.status === 200) {
          setAllEvents(response.data);
        }
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    getAllEvents();
  }, []);

  const filteredEvents = AllEvents.filter(
    (event) => event.eventType === selectedEventType
  );
  console.log(filteredEvents);

  // Define settings dynamically based on the number of events
  const sliderSettings = {
    dots: true,
    infinite: filteredEvents.length > 1, // Infinite loop only if more than 1 event
    speed: 500,
    slidesToShow: filteredEvents.length === 1 ? 1 : 3, // Show 1 slide if there's only one event
    slidesToScroll: 1,
    centerPadding: "10px",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: filteredEvents.length === 1 ? 1 : 2,
          slidesToScroll: 1,
          centerPadding: "10px",
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: filteredEvents.length === 1 ? 1 : 1,
          slidesToScroll: 1,
          centerPadding: "10px",
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: filteredEvents.length === 1 ? 1 : 1,
          slidesToScroll: 1,
          centerPadding: "5px",
        },
      },
    ],
  };

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  console.log(isInView);

  return (
    <motion.div ref={ref} className="events-section">
      <Box
        display="flex"
        gap="1rem"
        paddingBottom="1rem"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
      >
        <Box>
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: -50 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="d-flex flex-column"
          >
            <Typography variant="h3">
              <strong style={{ color: "#088602" }}>Our</strong>{" "}
              <strong>Events</strong>
            </Typography>{" "}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: -50 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <Typography>
              Here are Our Exciting Events. Would be Great to see You at the
              Next One!
            </Typography>
          </motion.div>
        </Box>

        <Box display="flex" flexWrap="wrap" gap="1rem">
          <Button
            onClick={() => setSelectedEventType("Ongoing")}
            variant={selectedEventType === "Ongoing" ? "contained" : "text"}
          >
            Ongoing
          </Button>
          <Button
            onClick={() => setSelectedEventType("Upcomming")}
            variant={selectedEventType === "Upcomming" ? "contained" : "text"}
          >
            Upcoming
          </Button>
        </Box>
      </Box>

      <Slider {...sliderSettings}>
        {filteredEvents?.length > 0 ? (
          filteredEvents.map((event) => (
            <motion.div
              key={event._id}
              className="event-card"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="image-title">
                <p className="title">{event.title}</p>
                <img
                  className="img-overly"
                  src={event.eventPhoto.url}
                  alt="event photo"
                />
              </div>
              <div className="container">
                <div className="time-date-slot d-flex items-center flex-wrap">
                  <Typography
                    color="rgba(0,0,0,0.7)"
                    variant="h5"
                    fontSize="2rem"
                    fontWeight={600}
                  >
                    {dayjs(event.time).format("HH:mm:a")}
                  </Typography>
                  <Divider orientation="vertical" variant="middle" flexItem />
                  <Typography variant="h6">
                    {dayjs(event.time).format("DD:MM:YYYY")}
                  </Typography>
                </div>
                <div className="location">
                  <FmdGood color="rgba(0,0,0,0.7)" />
                  <Typography color="rgba(0,0,0,0.7)">
                    {event.location}
                  </Typography>
                </div>
              </div>
              <motion.div
                className="join-button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: "absolute",
                  bottom: "10px",
                  right: "5px",
                  transform: "translateX(-50%)",
                  zIndex: 10,
                }}
              >
                <Button
                  onClick={() =>
                    navigate("/membership-and-volunteering/become-a-member")
                  }
                  variant="contained"
                  color="primary"
                >
                  Join Us Now
                </Button>
              </motion.div>
            </motion.div>
          ))
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100px",
            }}
          >
            <Typography>No events available</Typography>
          </Box>
        )}
      </Slider>
    </motion.div>
  );
};

export default EventsSections;

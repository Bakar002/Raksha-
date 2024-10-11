import { Done, LocalHospital, Pets, ReportProblem } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useInView, motion } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";

const HowItWorks = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const steps = [
    {
      title: "Injured Animal",
      description: "If You Spot an Injured Animal",
      icon: <Pets style={{ fontSize: 40, color: "#3f51b5" }} />,
    },
    {
      title: "Submit a Report",
      description: "Fill out the Form with the Animal Details.",
      icon: <ReportProblem style={{ fontSize: 40, color: "#FF0000" }} />,
    },
    {
      title: "Nearest NGOs",
      description: "The closest NGOs will be Notified Immediately..",
      icon: <LocalHospital style={{ fontSize: 40, color: "#4caf50" }} />,
    },
    {
      title: "Help is on the Way",
      description: "NGO will send help to assist the Injured Animal.",
      icon: <Done style={{ fontSize: 40, color: "#ff9800" }} />,
    },
  ];
  return (
    <motion.section
      ref={ref}
      className="welcome"
      initial={{ opacity: 0, x: -100 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <motion.div
        className="d-flex flex-column gap-400"
        initial={{ opacity: 0, x: -200 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          gap=".4rem"
        >
          <Link to="/report-animal-incident">
            <Button
              variant="contained"
              sx={{
                background: "#FF0000",
                fontWeight: "600",
                fontSize: "1.2rem",
              }}
            >
              REPORT INCIDENT
            </Button>
          </Link>
          <Typography fontWeight="600" textAlign="center">
            Click here
          </Typography>
        </Box>

        <Typography fontWeight={600} variant="h4" textAlign="center">
          How <span style={{ color: "#088602" }}>Raksha </span>Animal
          <span style={{ color: "#088602" }}> Rescue </span>
          works?
        </Typography>
      </motion.div>

      <div className="d-flex flex-wrap gap-400 items-center justify-center">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className="how-it-works-card"
            initial={{ opacity: 0, rotate: -10 }}
            animate={isInView ? { opacity: 1, rotate: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.3 }}
          >
            {step.icon}
            <Typography fontWeight={600} fontSize={20} textAlign="center">
              {step.title}
            </Typography>
            <Typography textAlign="center">{step.description}</Typography>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default HowItWorks;

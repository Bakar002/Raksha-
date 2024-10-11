/* eslint-disable react/no-unescaped-entities */
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const EasyReportingSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.section
      ref={ref}
      className="easy-reporting"
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
    >
      <div className="d-flex flex-column gap-400">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span style={{ color: "#088602" }}>Easy</span> Reporting
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Spotted an Injured Animal? Report it Quickly using our Simple Form.
          Just provide the Animal Location and Condition. We'll handle the
          rest..
        </motion.p>
        <motion.button
          className="btn"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Link
            style={{
              display: "inline-block",
              width: "100%",
              height: "100%",
              color: "white",
              textDecoration: "none",
            }}
            to="/report-animal-incident"
          >
            Report Incident
          </Link>
        </motion.button>
      </div>

      <motion.img
        className="radius-400"
        src="/images/easy-reporting-section-image.jpg"
        alt=""
        initial={{ opacity: 0, scale: 0.8 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.6 }}
      />
    </motion.section>
  );
};

export default EasyReportingSection;

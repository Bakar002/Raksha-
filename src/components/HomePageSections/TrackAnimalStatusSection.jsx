import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const TrackAnimalStatusSection = () => {
  const ref = useRef(null);

  const inView = useInView(ref, { once: true });

  return (
    <motion.section
      ref={ref}
      className="track-animal-status-section"
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}} // animate when in view
      transition={{ duration: 0.8 }}
    >
      <div className="d-flex flex-column gap-400">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Track <span style={{ color: "#3acf50" }}>Animal Status</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Stay Updated on the Progress of Rescued Animals. Our platform allows
          you to Track the Status of Animals from Rescue to Rehabilitation.
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
            to="/track-animal-status"
          >
            Track Status
          </Link>
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <img className="radius-400" src="/images/large-location.jpg" alt="" />
      </motion.div>
    </motion.section>
  );
};

export default TrackAnimalStatusSection;

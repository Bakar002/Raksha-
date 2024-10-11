import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const OurCollobratorsSection = () => {
  const ref = useRef(null);

  const inView = useInView(ref, { once: true });

  return (
    <motion.section
      ref={ref}
      className="our-colloborators"
      initial={{ opacity: 0, y: 50 }} // animation starts here
      animate={inView ? { opacity: 1, y: 0 } : {}} // animate when in view
      transition={{ duration: 1 }}
    >
      <div className="d-flex flex-column gap-400">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          NGO <span style={{ color: "#3acf50" }}>Collaboration</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Our Platform connects Reports to NGOs in the area, ensuring that Help
          is on the Way. We bridge the gap between those in Need and those who
          can Help..
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
            to="/register-ngo"
          >
            Register NGO
          </Link>
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <img className="radius-400" src="/images/ngo-hands.jpg" alt="" />
      </motion.div>
    </motion.section>
  );
};

export default OurCollobratorsSection;

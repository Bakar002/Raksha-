/* eslint-disable react/prop-types */
import { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { useTheme, useMediaQuery } from "@mui/material";

const ImageCarousel = ({ images, imgStyles }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Check if the screen is small

  const handleSlideChange = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", position: "relative" }}>
      <Carousel
        showArrows={true}
        showThumbs={false}
        infiniteLoop={false}
        autoPlay={false}
        selectedItem={currentIndex}
        onChange={handleSlideChange}
        renderArrowPrev={(onClickHandler, hasPrev, label) =>
          hasPrev && (
            <button
              type="button"
              onClick={onClickHandler}
              title={label}
              style={{
                position: "absolute",
                zIndex: 2,
                top: "calc(50% - 15px)",
                left: 15,
                background: "#3acf50",
                borderRadius: "50%",
                padding: "0.5rem",
                border: "none",
                display: "grid",
                placeContent: "center",
              }}
            >
              <KeyboardArrowLeft style={{ color: "#fff" }} />
            </button>
          )
        }
        renderArrowNext={(onClickHandler, hasNext, label) =>
          hasNext && (
            <button
              type="button"
              onClick={onClickHandler}
              title={label}
              style={{
                position: "absolute",
                zIndex: 2,
                top: "calc(50% - 15px)",
                right: 15,
                background: "#3acf50",
                borderRadius: "50%",
                padding: "0.5rem",
                border: "none",
                display: "grid",
                placeContent: "center",
              }}
            >
              <KeyboardArrowRight style={{ color: "#fff" }} />
            </button>
          )
        }
      >
        {images?.map((image, index) => (
          <div key={index}>
            <img
              src={image.url}
              alt={`Slide ${index + 1}`}
              style={{
                height: isSmallScreen ? "300px" : "400px", // Adjust height based on screen size
                width: "100%",
                objectFit: "cover",
                borderRadius: "1rem",
                ...imgStyles,
              }}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ImageCarousel;

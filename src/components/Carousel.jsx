/* eslint-disable react/prop-types */
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import useWindowWidth from "../hooks/useWindowWidth";
import { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";

const ResponsiveCarousel = ({ images }) => {
  const windowWidth = useWindowWidth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (images && images.length > 0) {
      const imageLoadPromises = images.map((image) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = image?.url;
          img.onload = resolve;
          img.onerror = reject;
        });
      });

      Promise.all(imageLoadPromises)
        .then(() => setLoading(false))
        .catch((err) => console.error("Image loading error: ", err));
    }
  }, [images]);

  // Determine image height based on screen width
  const imageHeight = windowWidth < 850 ? "300px" : "620px"; // Adjust heights as needed

  return (
    <div style={{ position: "relative", height: imageHeight }}>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <Carousel
          showArrows={true}
          showThumbs={false}
          infiniteLoop={true}
          autoPlay={true}
          interval={3000}
          transitionTime={500}
          emulateTouch={true}
          swipeable={true}
          showStatus={false}
          dynamicHeight={true}
        >
          {images?.map((image, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={image?.url}
                alt={`Slide ${index + 1}`}
                style={{
                  width: "100%",
                  height: imageHeight,
                }}
              />
            </div>
          ))}
        </Carousel>
      )}
    </div>
  );
};

export default ResponsiveCarousel;

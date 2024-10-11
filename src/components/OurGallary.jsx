import { useEffect, useState } from "react";
import PhotoAlbum from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Zoom } from "yet-another-react-lightbox/plugins"; // Import Zoom plugin
import { Helmet } from 'react-helmet';

import axios from "../api/axios";
import { Typography } from "@mui/material";

const Gallery = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [index, setIndex] = useState(-1); // Track which image is open in the lightbox

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const response = await axios.get("/api/organization/gallary");
        if (response.status === 200) {
          const images = response.data.gallary.map((img) => ({
            src: img.url,
            width: 1200, // Placeholder, adjust based on real data
            height: 900, // Placeholder, adjust based on real data
            alt: img.public_id,
          }));
          setGalleryImages(images);
        }
      } catch (error) {
        console.error("Error fetching gallery images:", error);
      }
    };
    fetchGalleryImages();
  }, []);

  // Handle lightbox opening
  const handleClick = (photoIndex) => {
    setIndex(photoIndex);
  };

  return (
<>
    <Helmet>
    <title>About Us - My Website Gallery</title>
    <meta name="description" content="Learn more about us Gallery" />
    <meta property="og:title" content="About Us - My Gallery" />
    <meta property="og:description" content="Details about our website and services. and Gallery" />
  </Helmet>

    <div className="raksha-gallery">
      <Typography variant="h4">Our Gallery</Typography>
      <PhotoAlbum
        layout="rows"
        photos={galleryImages}
        onClick={({ index }) => handleClick(index)} // Open lightbox on photo click
      />
      {index >= 0 && (
        <Lightbox
          plugins={[Zoom]} // Add Zoom plugin
          zoom={{ maxZoomPixelRatio: 3 }} // Optional zoom settings
          open={index >= 0}
          index={index}
          close={() => setIndex(-1)} // Close lightbox
          slides={galleryImages.map((photo) => ({
            src: photo.src,
            alt: photo.alt,
            width: photo.width, // Ensure dimensions are correct
            height: photo.height, // Ensure dimensions are correct
          }))}
        />
      )}
    </div>
    </>
  );
};

export default Gallery;

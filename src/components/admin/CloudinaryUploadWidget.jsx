/* eslint-disable react/prop-types */
// src/components/CloudinaryUploadWidget.js
import { Button } from "@mui/material";
import { useEffect } from "react";

const CloudinaryUploadWidget = ({ onUpload }) => {
  useEffect(() => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = "animal_rescue"; // Replace with your upload preset

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: cloudName,
        uploadPreset: uploadPreset,
        multiple: false,
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          console.log("Uploaded image URL:", result.info.secure_url);
          onUpload(result.info.secure_url);
        }
      }
    );

    document.getElementById("upload_widget").addEventListener(
      "click",
      () => {
        widget.open();
      },
      false
    );
  }, [onUpload]);

  return (
    <Button id="upload_widget" variant="contained" sx={{ mt: 2 }}>
      Upload Banner Image
    </Button>
  );
};

export default CloudinaryUploadWidget;

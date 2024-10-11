import axios from "axios";
import sha1 from "sha1";

export const handleDelete = async (file) => {
  if (!file?.public_id) {
    console.error("File does not have a public_id");
    return;
  }

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;
  const apiSecret = import.meta.env.VITE_CLOUDINARY_API_SECRET;

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;

  const timestamp = new Date().getTime();
  const string = `public_id=${file.public_id}&timestamp=${timestamp}${apiSecret}`;
  const signature = sha1(string);

  const formData = new FormData();
  formData.append("public_id", file.public_id);
  formData.append("signature", signature);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);

  try {
    const response = await axios.post(url, formData, {
      headers: { "X-Requested-With": "XMLHttpRequest" },
    });

    if (response.data.result === "ok") {
      console.log("Image deleted successfully");
    } else {
      console.error("Failed to delete image:", response.data);
    }
  } catch (error) {
    console.error(
      "Error deleting from Cloudinary:",
      error.response ? error.response.data : error.message
    );
  }
};

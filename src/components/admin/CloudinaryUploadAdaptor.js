// src/cloudinaryUploadAdapter.js
import axios from "axios";

class CloudinaryUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  async upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "animal_rescue"); // Replace with your Cloudinary upload preset

          axios
            .post(
              `https://api.cloudinary.com/v1_1/${
                import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
              }/upload`,
              formData
            )
            .then((response) => {
              resolve({
                default: response.data.secure_url,
              });
            })
            .catch((error) => {
              reject(error);
            });
        })
    );
  }

  abort() {
    // Aborts the upload process if necessary
  }
}

function CloudinaryUploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return new CloudinaryUploadAdapter(loader);
  };
}

export default CloudinaryUploadAdapterPlugin;

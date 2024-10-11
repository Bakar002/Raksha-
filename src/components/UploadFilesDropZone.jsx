/* eslint-disable react/prop-types */
import { useState, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import sha1 from "sha1";
import { Button, CircularProgress, IconButton } from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";

function UploadFilesDropZone({ onDrop, files, onRemove, maxFiles, accept }) {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [deletingFile, setDeletingFile] = useState(null);

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    fileRejections,
  } = useDropzone({
    accept,
    maxFiles,
    onDrop: async (acceptedFiles) => {
      setUploading(true);
      const uploaded = await handleUpload(acceptedFiles);
      setUploading(false);
      if (onDrop) onDrop(uploaded);
    },
  });

  const handleUpload = async (files) => {
    const uploads = files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
          }/upload`,
          formData,
          {
            headers: { "X-Requested-With": "XMLHttpRequest" },
            params: {
              resource_type: file.type === "application/pdf" ? "raw" : "image",
            },
          }
        );
        return {
          url: response.data.secure_url,
          public_id: response.data.public_id,
        };
      } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        return null;
      }
    });

    return Promise.all(uploads);
  };

  const handleDelete = async (file) => {
    if (!file?.public_id) {
      console.error("File does not have a public_id");
      return;
    }

    setDeletingFile(file);

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
        if (onRemove) onRemove(file);
      } else {
        console.error("Failed to delete image:", response.data);
      }
    } catch (error) {
      console.error(
        "Error deleting from Cloudinary:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setDeletingFile(null);
    }
  };

  const style = useMemo(
    () => ({
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "20px",
      borderWidth: 2,
      borderRadius: 2,
      borderColor: "black",
      borderStyle: "dashed",
      backgroundColor: "white",
      color: "green",
      outline: "none",
      transition: "border .24s ease-in-out",
      ...(isFocused ? { borderColor: "#2196f3" } : {}),
      ...(isDragAccept ? { borderColor: "#00e676" } : {}),
      ...(isDragReject ? { borderColor: "#ff1744" } : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  const fileList =
    files?.length > 0 &&
    files?.map((file, index) => (
      <div
        key={index}
        className="preview-item"
        style={{ position: "relative" }}
      >
        {file?.url?.endsWith(".pdf") ? (
          <div>
            <Button key={file.public_id} href={file?.url}>
              <a
                style={{ textDecoration: "none" }}
                target="_blank"
                rel="noopener noreferrer"
              ></a>
              uploaded file
            </Button>
            <IconButton
              onClick={() => handleDelete(file)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                backgroundColor: "#e8f0fe",
                color: "red",
                border: "1px solid white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: "translate(-50%, -50%)",
                cursor: "pointer",
                boxShadow: "1px 2px 5px gray",
              }}
            >
              {deletingFile === file ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <DeleteOutline fontSize="small" />
              )}
            </IconButton>
          </div>
        ) : (
          <img
            src={file?.url}
            alt={`uploaded ${index}`}
            style={{
              width: 100,
              height: 100,
              objectFit: "cover",
              position: "relative",
            }}
            onClick={() => setSelectedFile(file)}
          />
        )}
        {selectedFile === file && (
          <IconButton
            onClick={() => handleDelete(file)}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              backgroundColor: "#e8f0fe",
              color: "red",
              border: "1px solid white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: "translate(-50%, -50%)",
              cursor: "pointer",
              boxShadow: "1px 2px 5px gray",
            }}
          >
            {deletingFile === file ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <DeleteOutline fontSize="small" />
            )}
          </IconButton>
        )}
      </div>
    ));

  const errorList = fileRejections?.map(({ file, errors }) => (
    <div key={file.path}>
      {file.path} - {errors[0].message}
    </div>
  ));

  return (
    <div className="styled-drop-container d-flex flex-column gap-400">
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p>Drag &apos;n&apos; drop some files here, or click to select files</p>
        {uploading && <p>Uploading...</p>}
      </div>
      {files?.length !== 0 && <p>Select file to delete</p>}
      <div className="preview d-flex gap-400">
        {uploading ? <CircularProgress /> : fileList}
      </div>
      <div className="errors">{errorList}</div>
    </div>
  );
}

export default UploadFilesDropZone;

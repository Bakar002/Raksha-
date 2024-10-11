/* eslint-disable react/prop-types */
import { NotificationsActive } from "@mui/icons-material";
import { Box } from "@mui/material";
import { useMemo } from "react";

const getContrastColor = (backgroundColor) => {
  // Calculate luminance of the background color
  const color = backgroundColor.replace(/^#/, "");
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);

  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

  return luminance > 0.5 ? "black" : "white"; // Choose color based on luminance
};

const StatusBadge = ({ status }) => {
  const backgroundColor = useMemo(() => {
    switch (status) {
      case "Recovered":
        return "hsl(129, 61%, 52%)";
      case "Pending Review":
        return "#ffeb3b";
      case "Approved":
        return "#c8e6c9";
      case "Rescue In Progress":
        return "#ff9800";
      case "Under Care":
        return "#bbdefb";
      case "New":
        return "red";
      case "Rejected":
        return "#f44336"; // Red color for rejected status
      default:
        return "#616161"; // Grey for unknown status
    }
  }, [status]);

  const textColor = useMemo(
    () => getContrastColor(backgroundColor),
    [backgroundColor]
  );

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-flex",
        gap: ".5rem",
        alignItems: "center",
        justifyContent: "center",
        padding: "0.25rem",
        borderRadius: "0.25rem",
        fontSize: ".6rem",
        backgroundColor: backgroundColor,
        color: textColor, // Use dynamic text color
        textAlign: "center",
      }}
    >
      {status}
      {status === "New" && (
        <div
          style={{
            display: "inline-block",
          }}
        >
          <NotificationsActive
            style={{
              fontSize: ".7rem",
              color: textColor, // Use dynamic text color
              animation: "pulse 1.5s infinite",
            }}
          />
          <style>
            {`
                @keyframes pulse {
                  0% { transform: scale(1); }
                  50% { transform: scale(1.2); }
                  100% { transform: scale(1); }
                }
              `}
          </style>
        </div>
      )}
    </Box>
  );
};

export default StatusBadge;

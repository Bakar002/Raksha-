/* eslint-disable react/prop-types */
import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function CircularProgressWithLabel({
  goal = 1,
  raised = 0,
  size = 100,
}) {
  const [progress, setProgress] = React.useState(0);
  const [isAnimating, setIsAnimating] = React.useState(true);

  React.useEffect(() => {
    if (goal <= 0) return; // Prevent division by zero or negative goals

    const calculatedProgress = (raised / goal) * 100;
    setProgress(calculatedProgress);

    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [goal, raised]);

  return (
    <Box
      sx={{ textAlign: "center", position: "relative", display: "inline-flex" }}
    >
      <CircularProgress
        variant="determinate"
        value={isAnimating ? 0 : progress} // Start from 0 and fill up to the calculated progress
        size={size}
        sx={{
          transition: "transform 1s ease-in-out",
          transform: isAnimating ? "rotate(0deg)" : "rotate(360deg)",
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          sx={{
            color: "text.secondary",
            fontSize: "2rem",
            transition: "opacity 1s ease-in-out",
            opacity: isAnimating ? 0 : 1,
          }}
        >
          {`${Math.round(progress)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

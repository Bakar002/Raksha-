// theme.js
import { createTheme } from "@mui/material/styles";

// Define your custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#088602", // Replace with your custom primary color
    },
    secondary: {
      main: "#03a9f4", // Optional: Define a secondary color
    },
  },
  // You can customize other aspects of the theme here, like typography, spacing, etc.
});

export default theme;

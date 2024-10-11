import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Check from "@mui/icons-material/Check";
import ReportIcon from "@mui/icons-material/Report";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import HealingIcon from "@mui/icons-material/Healing";
import PetsIcon from "@mui/icons-material/Pets";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { Close } from "@mui/icons-material";
import { useMediaQuery, useTheme } from "@mui/material";

const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: "linear-gradient(95deg, #3acf50 0%, #03a9f4 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: "linear-gradient(95deg, #3acf50 0%, #03a9f4 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

const CustomStepIconRoot = styled("div")(
  ({ theme, ownerState, isSmallScreen }) => ({
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
    zIndex: 1,
    color: "#fff",
    width: isSmallScreen ? 25 : 35, // Adjust size based on screen size
    height: isSmallScreen ? 25 : 35, // Adjust size based on screen size
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    ...(ownerState.active && {
      backgroundImage: "linear-gradient(136deg, #3acf50 0%, #03a9f4 100%)",
      boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
    }),
    ...(ownerState.completed && {
      backgroundImage: "linear-gradient(136deg, #3acf50 0%, #03a9f4 100%)",
    }),
  })
);

function CustomStepIcon(props) {
  const { active, completed, className, icon } = props;
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Check if the screen is small

  const icons = {
    New: <ReportIcon />,
    "Pending Review": <PendingActionsIcon />,
    Approved: <CheckCircleIcon />,
    Rejected: <Close />,
    "Rescue In Progress": <LocalShippingIcon />,
    "Under Care": <HealingIcon />,
    Recovered: <PetsIcon />,
    Closed: <Check />,
  };

  return (
    <CustomStepIconRoot
      ownerState={{ completed, active }}
      className={className}
      isSmallScreen={isSmallScreen} // Pass small screen prop
    >
      {icons[icon]}
    </CustomStepIconRoot>
  );
}

CustomStepIcon.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  completed: PropTypes.bool,
  icon: PropTypes.string,
};

export default function AnimalStatusStepper({ activeStep }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const steps = ["New", "Pending Review"];

  if (activeStep === "Rejected") {
    steps.push("Rejected");
  } else if (activeStep === "Approved" || steps.includes(activeStep)) {
    steps.push(
      "Approved",
      "Rescue In Progress",
      "Under Care",
      "Recovered",
      "Closed"
    );
  } else {
    steps.push(
      "Approved",
      "Rescue In Progress",
      "Under Care",
      "Recovered",
      "Closed"
    );
  }

  return (
    <Stack sx={{ width: "100%" }} spacing={isSmallScreen ? 2 : 3}>
      <Stepper
        alternativeLabel
        activeStep={steps.indexOf(activeStep)}
        connector={<CustomConnector />}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel
              sx={{
                "& .MuiStepLabel-label": {
                  fontSize: isSmallScreen ? "0.6rem" : "0.75rem",
                  marginTop: ".4rem",
                  textAlign: "center", // Center align text
                  display: "block", // Ensure text is block to enable wrapping
                  whiteSpace: "normal", // Allow text to wrap
                },
              }}
              StepIconComponent={CustomStepIcon}
              icon={label}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Stack>
  );
}

AnimalStatusStepper.propTypes = {
  activeStep: PropTypes.string.isRequired,
};

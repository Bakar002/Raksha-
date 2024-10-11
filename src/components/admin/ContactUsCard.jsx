/* eslint-disable react/prop-types */
import {
  Card,
  CardContent,
  Typography,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { useState } from "react";
import { ExpandMore } from "@mui/icons-material";

const ContactUsCard = ({ data, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    handleClose();
    if (onDelete) {
      onDelete(data._id);
    }
  };

  const handleAccordionChange = () => (event, isExpanded) => {
    setExpanded(isExpanded ? "panel1" : false);
  };

  return (
    <Card
      sx={{ maxWidth: 400, margin: "auto", padding: 2, position: "relative" }}
    >
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
        sx={{ position: "absolute", top: 8, right: 8 }}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 48 * 4.5,
            width: "20ch",
          },
        }}
      >
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
      <CardContent>
        <Typography variant="h6" fontWeight={600}>
          {data.name}
        </Typography>
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <EmailIcon color="action" />
          </Grid>
          <Grid item>
            <Typography variant="body2" color="textSecondary">
              {data.email}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <PhoneIcon color="action" />
          </Grid>
          <Grid item>
            <Typography variant="body2" color="textSecondary">
              {data.contact}
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Accordion
          expanded={expanded === "panel1"}
          onChange={handleAccordionChange()}
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography variant="body1" sx={{ flexShrink: 0 }}>
              Message
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1">{data.message}</Typography>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default ContactUsCard;

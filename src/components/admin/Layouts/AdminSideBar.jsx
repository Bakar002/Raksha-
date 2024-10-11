/* eslint-disable react/prop-types */
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Toolbar,
  Badge,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Person,
  Add,
  ManageSearch,
  Update,
  Collections,
  Event,
  People,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../api/axiosPrivate";

const AdminSideBar = ({ open, onClose, variant }) => {
  const location = useLocation();
  const [UpdatesCount, setUpdatesCount] = useState(null);
  const axiosPrivate = useAxiosPrivate();
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [
          membershipResponse,
          casesResponse,
          volunteerResponse,
          contactUsResponse,
        ] = await Promise.all([
          axiosPrivate.get("/api/membership/pending"),
          axiosPrivate.get("/api/cases"),
          axiosPrivate.get("/api/volunteership/pending"),
          axiosPrivate.get("/api/contact"),
        ]);

        const pendingApplicationsCount = membershipResponse?.data?.length;
        const newCasesCount = casesResponse?.data?.length;
        const pendingVolunteersAppCount = volunteerResponse?.data?.length;
        const contactusFormsCount = contactUsResponse?.data?.length;

        setUpdatesCount(
          pendingApplicationsCount +
            newCasesCount +
            pendingVolunteersAppCount +
            contactusFormsCount
        );
      } catch (error) {
        console.log(error);
      }
    };

    fetchCounts();
  }, []);

  // Helper function to determine if the current path matches
  const isActive = (path) => location.pathname === path;

  // Helper function to apply styles conditionally
  const getStyles = (path) => ({
    color: isActive(path) ? "primary.main" : "inherit",
    bgcolor: isActive(path) ? "rgba(0, 0, 0, 0.1)" : "transparent",
    "&:hover": {
      bgcolor: isActive(path) ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.05)",
    },
  });

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      variant={variant}
      sx={{
        width: variant === "permanent" ? 240 : "auto",
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: 2,
        }}
      >
        <img
          src="/images/logo.png"
          alt="Logo"
          style={{ width: "5rem", height: "5rem", marginRight: "8px" }}
        />
        <h4>Raksha Animal</h4>
      </Box>
      <List>
        <ListItemButton
          component={Link}
          to="/admin/home"
          sx={getStyles("/admin/home")}
        >
          <ListItemIcon
            sx={{ color: isActive("/admin/home") ? "primary.main" : "inherit" }}
          >
            <Home />
          </ListItemIcon>
          <ListItemText primary="Admin Home" />
        </ListItemButton>
        <ListItemButton
          component={Link}
          to="/admin/profile"
          sx={getStyles("/admin/profile")}
        >
          <ListItemIcon
            sx={{
              color: isActive("/admin/profile") ? "primary.main" : "inherit",
            }}
          >
            <Person />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItemButton>
        <ListItemButton
          component={Link}
          to="/admin/create-new-page"
          sx={getStyles("/admin/create-new-page")}
        >
          <ListItemIcon
            sx={{
              color: isActive("/admin/create-new-page")
                ? "primary.main"
                : "inherit",
            }}
          >
            <Add />
          </ListItemIcon>
          <ListItemText primary="Create A New Page" />
        </ListItemButton>
        <ListItemButton
          component={Link}
          to="/admin/ngo-management"
          sx={getStyles("/admin/ngo-management")}
        >
          <ListItemIcon
            sx={{
              color: isActive("/admin/ngo-management")
                ? "primary.main"
                : "inherit",
            }}
          >
            <ManageSearch />
          </ListItemIcon>
          <ListItemText primary="NGO Management" />
        </ListItemButton>
        <ListItemButton
          component={Link}
          to="/admin/updates"
          sx={getStyles("/admin/updates")}
        >
          <ListItemIcon
            sx={{
              color: isActive("/admin/updates") ? "primary.main" : "inherit",
            }}
          >
            <Badge badgeContent={UpdatesCount} max={999} color="error">
              <Update />
            </Badge>
          </ListItemIcon>
          <ListItemText primary="Updates" />
        </ListItemButton>
        <ListItemButton
          component={Link}
          to="/admin/gallary"
          sx={getStyles("/admin/gallary")}
        >
          <ListItemIcon
            sx={{
              color: isActive("/admin/gallary") ? "primary.main" : "inherit",
            }}
          >
            <Collections />
          </ListItemIcon>
          <ListItemText primary="Gallery" />
        </ListItemButton>
        <ListItemButton
          component={Link}
          to="/admin/events"
          sx={getStyles("/admin/events")}
        >
          <ListItemIcon
            sx={{
              color: isActive("/admin/events") ? "primary.main" : "inherit",
            }}
          >
            <Event />
          </ListItemIcon>
          <ListItemText primary="Events" />
        </ListItemButton>
        <ListItemButton
          component={Link}
          to="/admin/volunteers-and-members"
          sx={getStyles("/admin/volunteers-and-members")}
        >
          <ListItemIcon
            sx={{
              color: isActive("/admin/volunteers-and-members")
                ? "primary.main"
                : "inherit",
            }}
          >
            <People />
          </ListItemIcon>
          <ListItemText primary="Volunteers & Members" />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default AdminSideBar;

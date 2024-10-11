/* eslint-disable react/prop-types */
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  MenuItem,
  Menu,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { MoreVert } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import useAuth from "../../../hooks/useAuth";

const AdminHeader = ({ toggleSidebar }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const open = Boolean(anchorEl);

  return (
    <AppBar
      position="fixed"
      sx={{
        padding: "1rem 2rem",
        zIndex: (theme) => theme.zIndex.drawer - 1,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between", // Ensures the space between the elements
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleSidebar}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ marginLeft: 2 }}>
            Admin Panel
          </Typography>
        </Box>

        <IconButton
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={(event) => setAnchorEl(event.currentTarget)}
        >
          <MoreVert />
        </IconButton>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={() => {
            setAnchorEl(null);
          }}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
            }}
          >
            <Link to="/" style={{ color: "black", textDecoration: "none" }}>
              Home
            </Link>
          </MenuItem>
          <MenuItem
            onClick={() => {
              localStorage.removeItem("authToken");
              localStorage.removeItem("user");
              setAuth(null);
              navigate("/users/login");
            }}
          >
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default AdminHeader;

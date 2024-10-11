/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Link } from "react-router-dom";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";

function DropdownMenu({ buttonLabel, menuItems }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(open ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <li>
      <Button
        sx={{ color: "#111827" }}
        id={`${buttonLabel}-button`}
        aria-controls={open ? `${buttonLabel}-menu` : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        endIcon={open ? <ArrowDropUp /> : <ArrowDropDown />}
      >
        {buttonLabel}
      </Button>
      <Menu
        id={`${buttonLabel}-menu`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": `${buttonLabel}-button`,
        }}
      >
        {menuItems.map((item, index) => (
          <MenuItem
            className="menu-item"
            onClick={handleClose}
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              "&:hover .menu-item-icon": {
                visibility: "visible",
              },
            }}
          >
            <ListItemIcon
              className="menu-item-icon"
              sx={{
                color: "hsl(129, 61%, 52%)",
                visibility: "hidden",
                width: "24px", // Ensure the space is always reserved
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText>
              <Link
                className="nav-link"
                style={{ textDecoration: "none", color: "inherit" }}
                to={item.link}
              >
                {item.label}
              </Link>
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </li>
  );
}

export default DropdownMenu;

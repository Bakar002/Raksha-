/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDropDown,
  ArrowDropUp,
  Close,
  Event,
  Home,
  Menu as MenuIcon,
  Pets,
} from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import DropdownMenu from "../DropDownMenu";
import useWindowWidth from "../../hooks/useWindowWidth";
import { generateLinks } from "../../Utils/GenerateLinkUtils";
import useAuth from "../../hooks/useAuth";

function Header({ categories, websiteInfo }) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { auth } = useAuth();
  const [isHomeDropdownOpen, setIsHomeDropdownOpen] = useState(false);
  const [isProjectsDropdownOpen, setIsProjectsDropdownOpen] = useState(false);
  const windowWidth = useWindowWidth();
  const homeCategories = [
    "About Us",
    "Membership and Volunteering",
    "Advocacy and Awareness",
  ];
  useEffect(() => {
    // Close navbar automatically on page load for mobile mode
    if (windowWidth < 800) {
      setIsNavOpen(false);
    }
  }, [windowWidth]);

  const newItemsHome = generateLinks(categories, homeCategories).map(
    (item) => ({
      ...item,
      icon: <Pets color="primary" />,
    })
  );
  const projectReportsMenuItems = generateLinks(categories, [
    "Project Reports",
  ]).map((item) => ({
    ...item,
    icon: <Event color="primary" />,
  }));

  const closeAllMenus = () => {
    setIsHomeDropdownOpen(false);
    setIsProjectsDropdownOpen(false);
    setIsNavOpen(false);
  };

  const renderDropdownMenu = (label, items, isOpen, setIsOpen) => (
    <li>
      <div className="d-flex items-center">
        <Link to="/" onClick={closeAllMenus}>
          {label}
        </Link>
        {isOpen ? (
          <ArrowDropDown
            sx={{ fontSize: 40 }}
            color="primary"
            onClick={() => setIsOpen(false)}
          />
        ) : (
          <ArrowDropUp sx={{ fontSize: 40 }} onClick={() => setIsOpen(true)} />
        )}
      </div>
      {isOpen && (
        <ul className="menu-list">
          {items.map((item, index) => (
            <li className="menu-item" key={index}>
              <Link className="spec" to={item.link} onClick={closeAllMenus}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );

  return (
    <header>
      <Link to="/">
        <img className="logo" src={websiteInfo?.logo?.url} alt="logo" />
      </Link>

      <ul
        className={`nav-list ${isNavOpen && windowWidth < 800 ? "open" : ""}`}
      >
        {windowWidth > 800 ? (
          <>
            <Box display="flex" alignItems="center">
              <Link to="/">
                <IconButton>
                  <Home sx={{ fontSize: 20 }} />
                </IconButton>
              </Link>
              <DropdownMenu
                buttonLabel="Home"
                menuItems={newItemsHome}
                onMenuItemClick={closeAllMenus}
              />
            </Box>

            <DropdownMenu
              buttonLabel="Project Reports"
              menuItems={projectReportsMenuItems}
              onMenuItemClick={closeAllMenus}
            />
          </>
        ) : (
          <>
            {renderDropdownMenu(
              "Home",
              newItemsHome,
              isHomeDropdownOpen,
              setIsHomeDropdownOpen
            )}
            {renderDropdownMenu(
              "Project Reports",
              projectReportsMenuItems,
              isProjectsDropdownOpen,
              setIsProjectsDropdownOpen
            )}
          </>
        )}
        <li>
          <Link to="/report-animal-incident" onClick={closeAllMenus}>
            Report Animal Incident
          </Link>
        </li>
        <li>
          <Link to="/register-ngo" onClick={closeAllMenus}>
            Register Your NGO
          </Link>
        </li>
        <li>
          <Link to="/users/login" onClick={closeAllMenus}>
            Login
          </Link>
        </li>
        {auth && auth?.user?.role === "ngo" && (
          <li>
            <Link to="/ngo-management" onClick={closeAllMenus}>
              NGO Management
            </Link>
          </li>
        )}
        {auth && auth?.user?.role === "super_admin" && (
          <li>
            <Link to="/admin/home" onClick={closeAllMenus}>
              Admin Home
            </Link>
          </li>
        )}
      </ul>

      {windowWidth < 800 && (
        <IconButton
          id="humburger-icon"
          onClick={() => setIsNavOpen(!isNavOpen)}
        >
          {isNavOpen ? <Close /> : <MenuIcon />}
        </IconButton>
      )}
    </header>
  );
}

export default Header;

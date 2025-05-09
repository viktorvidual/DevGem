import React, { useContext, useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import { AuthContext } from "../../context/AuthContext";
import { logoutUser } from "../../services/auth.services";
import { Link, useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { Inbox } from "@mui/icons-material";
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import './AppBar.css'
import {
  CREATE_ADDON_PATH,
  LOG_IN_PATH,
  SIGN_UP_PATH,
  ADMIN_WORD,
  ADMIN_PANEL_PATH,
  ACCOUNT_SETTING_PATH,
  MY_ADDONS_PATH,
  USER_NOTIFICATION,
  ADMIN_CHAT_PATH,
  ANALYTICS_DASHBOARD,
  MY_SUBSCRIPTIONS_PATH
} from "../../common/common";
import DiamondIcon from "@mui/icons-material/Diamond";
import { getUserNotifications } from "../../services/user.services";


function ResponsiveAppBar() {
  const { loggedInUser, allUsers } = useContext(AuthContext);
  const [userNotifications, setUserNotifications] = useState<any[]>([]);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const navigate = useNavigate();
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (loggedInUser?.username) {
          const notifications = await getUserNotifications(loggedInUser.username);
          setUserNotifications(notifications);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [allUsers]);


  useEffect(() => {
    if (loggedInUser) {
      handleCloseUserMenu();
    }
  }, [loggedInUser]);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    if (loggedInUser) {
      setAnchorElUser(event.currentTarget);
    }
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMyAccount = () => {
    handleCloseUserMenu();
    navigate(ACCOUNT_SETTING_PATH);
  };

  const handleManageAddonsMenu = () => {
    handleCloseUserMenu();
    navigate(MY_ADDONS_PATH);
  };

  const handleMySubscriptionsMenu = () => {
    handleCloseUserMenu();
    navigate(MY_SUBSCRIPTIONS_PATH);
  }

  return (
    <AppBar
      position="absolute"
      style={{
        display: "block",
        backgroundColor: "#1b74e4",
        overflow: "visible",
        top: 0,
        left: 0,
        right: 0,
        margin: 0,
      }}
    >
      <Container sx={{ width: "100%" }}>
        <Toolbar disableGutters>
          <DiamondIcon sx={{ display: "flex", width: 35, height: 35 }} />

          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              ml: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            DEV/GEM
          </Typography>

          <Box sx={{ flexGrow: 1 }}></Box>
          <Box sx={{ flexGrow: 0 }}>
            {loggedInUser ? (
              <>
                {loggedInUser.role === ADMIN_WORD && !loggedInUser.blockedStatus && (
                  <Button
                    variant="outlined"
                    component={RouterLink}
                    to={ADMIN_PANEL_PATH}
                    sx={{ my: 2, color: "white", borderColor: "white", mr: 2 }}
                  >
                    Admin Panel
                  </Button>
                )}
                {!loggedInUser.blockedStatus ? (
                  <Button
                    variant="outlined"
                    component={RouterLink}
                    to={CREATE_ADDON_PATH}
                    sx={{ my: 2, color: "white", borderColor: "white", mr: 2 }}
                  >
                    Upload Add-on
                  </Button>
                ) : (<span style={{ fontWeight: 'bold', color: 'white', fontSize: '20px' }}>BLOCKED</span>)}
                {loggedInUser.role === ADMIN_WORD && (
                  <Link to={ADMIN_CHAT_PATH}>
                    <Button>
                      <ChatIcon style={{ color: 'white' }} />
                    </Button>
                  </Link>
                )}
                <Link to={USER_NOTIFICATION}>
                  <Button style={{ color: 'white', marginRight: '10px' }}>
                    <Inbox />
                    {userNotifications.length > 0 && <div className="notification-indicator-for-user" />}
                  </Button>
                </Link>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt="user icon"
                      sx={{ width: 32, height: 32 }}
                      src={loggedInUser.profilePictureURL !== "https://shorturl.at/jtQ19" ? loggedInUser.profilePictureURL : undefined}
                    >
                      <PersonIcon/>
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={handleMyAccount}>
                    <Typography textAlign="center">Account Settings</Typography>
                  </MenuItem>

                  <MenuItem onClick={()=>navigate(ANALYTICS_DASHBOARD)}>
                    <Typography textAlign="center">Analytics Panel</Typography>
                  </MenuItem>

                  {!loggedInUser.blockedStatus && (
                    <MenuItem onClick={handleManageAddonsMenu}>
                      <Typography textAlign="center">Manage Add-ons</Typography>
                    </MenuItem>
                  )}

                  <MenuItem onClick={handleMySubscriptionsMenu}>
                    <Typography textAlign="center">My subscriptions</Typography>
                  </MenuItem>

                  <MenuItem onClick={() => {logoutUser(); handleCloseUserMenu()}}>
                    <Typography textAlign="center">Log Out</Typography>
                  </MenuItem>
                </Menu>{" "}
              </>
            ) : (
              <>
                <Button
                  component={RouterLink}
                  to={LOG_IN_PATH}
                  sx={{ my: 2, color: "white" }}
                  onClick={() => handleCloseUserMenu()}
                >
                  Sign In
                </Button>
                |
                <Button
                  component={RouterLink}
                  to={SIGN_UP_PATH}
                  sx={{ my: 2, color: "white" }}
                  onClick={() => handleCloseUserMenu()}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;

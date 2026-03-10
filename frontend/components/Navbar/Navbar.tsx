"use client";

import React, { useEffect, useState } from "react";
import "./Navbar.css";

import { useRouter } from "next/navigation";

import {
  AppBar,
  Toolbar,
  Box,
  InputBase,
  IconButton,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  Divider,
  Button,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from "@mui/icons-material/Group";
import WorkIcon from "@mui/icons-material/Work";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import axios from "axios";

interface UserProfile {
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  headline?: string;
}

export default function LinkedInNavbar() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const open = Boolean(anchorEl);

  /*
  OLD TOKEN METHOD
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  */

  useEffect(() => {
    const fetchData = async () => {
      try {

        /*
        OLD HEADER AUTH METHOD
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        */

        const profileRes = await axios.get(
          "http://localhost:5000/users/me",
          {
            withCredentials: true,
          }
        );

        setProfile(profileRes.data);

      } catch (error) {
        console.error("Profile fetch failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    /*
    OLD CONDITIONAL FETCH
    if (token) {
      fetchData();
    }
    */

  }, []);

  const backendUrl = "http://localhost:5000/uploads/";

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  const handleOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget as HTMLDivElement);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {

      /*
      OLD LOGOUT METHOD
      localStorage.removeItem("token");
      */

      await axios.post(
        "http://localhost:5000/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );

      router.push("/authentication/login");

    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AppBar position="sticky" elevation={0} className="li-navbar">
      <Toolbar className="li-toolbar">

        <Box className="li-left">

          <div
            className="li-logo"
            style={{ cursor: "pointer" }}
            onClick={() => router.push("/feed")}
          >
            in
          </div>

          <div className="li-search">
            <SearchIcon className="li-search-icon" />
            <InputBase placeholder="Search" className="li-search-input" />
          </div>

        </Box>

        <Box className="li-right">

          <div className="li-nav-item">
            <IconButton size="small" onClick={() => router.push("/feed")}>
              <HomeIcon />
            </IconButton>
            <span>Home</span>
          </div>

          <div className="li-nav-item">
            <IconButton size="small" onClick={() => router.push("/networks")}>
              <GroupIcon />
            </IconButton>
            <span>My Network</span>
          </div>

          <div className="li-nav-item">
            <IconButton size="small">
              <WorkIcon />
            </IconButton>
            <span>Jobs</span>
          </div>

          <div className="li-nav-item">
            <IconButton size="small" onClick={() => router.push("/messaging")}>
              <ChatIcon />
            </IconButton>
            <span>Messaging</span>
          </div>

          <div className="li-nav-item">
            <IconButton
              size="small"
              onClick={() => router.push("/notifications")}
            >
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <span>Notifications</span>
          </div>

          <Divider orientation="vertical" flexItem />

          <div
            className="li-profile"
            style={{ cursor: "pointer" }}
            onClick={handleOpen}
          >
            <Avatar
              sx={{ width: 28, height: 28 }}
              src={
                profile?.profilePicture
                  ? backendUrl + profile.profilePicture
                  : undefined
              }
            />
            <ArrowDropDownIcon
              sx={{
                fontSize: 20,
                color: "#666",
                marginLeft: "2px",
              }}
            />
          </div>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{ className: "li-profile-menu" }}
          >

            <div className="li-menu-header">

              <Avatar
                className="li-menu-avatar"
                src={
                  profile?.profilePicture
                    ? backendUrl + profile.profilePicture
                    : undefined
                }
              />

              <div>
                <Typography className="li-menu-name">
                  {profile?.firstName} {profile?.lastName}
                </Typography>

                <Typography className="li-menu-headline">
                  {profile?.headline}
                </Typography>
              </div>

            </div>

            <div className="li-view-profile-wrapper">
              <Button
                fullWidth
                variant="outlined"
                className="li-view-profile"
                onClick={() => {
                  handleClose();
                  router.push("/profile");
                }}
              >
                View profile
              </Button>
            </div>

            <Divider />

            <div className="li-menu-section">

              <div className="li-section-title">
                Account
              </div>

              <MenuItem
                onClick={() => {
                  handleClose();
                  router.push("/premium");
                }}
              >
                Try 1 month of Premium for ₹0
              </MenuItem>

              <MenuItem
                onClick={() => {
                  handleClose();
                  router.push("/settings");
                }}
              >
                Settings & Privacy
              </MenuItem>

              <MenuItem
                onClick={() => {
                  handleClose();
                  router.push("/help");
                }}
              >
                Help
              </MenuItem>

              <MenuItem
                onClick={() => {
                  handleClose();
                  router.push("/language");
                }}
              >
                Language
              </MenuItem>

            </div>

            <Divider />

            <div className="li-menu-section">

              <div className="li-section-title">
                Manage
              </div>

              <MenuItem
                onClick={() => {
                  handleClose();
                  router.push("/posts");
                }}
              >
                Posts & Activity
              </MenuItem>

              <MenuItem
                onClick={() => {
                  handleClose();
                  router.push("/job-posting");
                }}
              >
                Job Posting Account
              </MenuItem>

            </div>

            <Divider />

            <MenuItem
              onClick={() => {
                handleClose();
                handleLogout();
              }}
            >
              Sign out
            </MenuItem>

          </Menu>

        </Box>
      </Toolbar>
    </AppBar>
  );
}
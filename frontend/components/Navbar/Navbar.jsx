"use client";

import React, { useState } from "react";
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

export default function LinkedInNavbar() {
  const router = useRouter(); 
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
            <IconButton size="small" >
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
            <Avatar sx={{ width: 28, height: 28 }} />
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
              <Avatar className="li-menu-avatar" />
              <div>
                <Typography className="li-menu-name">
                  Devang Tripathi
                </Typography>
                <Typography className="li-menu-headline">
                  Student at CCET
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
              <div className="li-section-title">Account</div>

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
              <div className="li-section-title">Manage</div>

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
                router.push("/authentication/login");
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
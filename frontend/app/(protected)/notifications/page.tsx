/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import "./Notifications.css";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  Typography,
  Avatar,
} from "@mui/material";

import { useState, useEffect } from "react";
import axios from "axios";

import Navbar from "../../../components/Navbar/Navbar";
import LeftSidebar from "../../../components/Feed/LeftSideBar/LeftSideBar";
import { getSocket } from "@/utils/socket";


interface Notification {
  id: string;
  message: string;
  createdAt: string;
  sender?: {
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
  };
}

export default function Notifications() {

  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const backendUrl = "http://localhost:5000/uploads/";

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newFilter: string
  ) => {
    if (newFilter !== null) setFilter(newFilter);
  };

  // fetch notifications from backend
  const fetchNotifications = async () => {
    try {

      const res = await axios.get(
        "http://localhost:5000/notifications",
        {
          withCredentials: true,
        }
      );

      setNotifications(res.data);

    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  useEffect(() => {

    fetchNotifications();

    const socket = getSocket();

    socket.connect();

    socket.on("notification", (data: Notification) => {

      setNotifications((prev) => [data, ...prev]);

    });

    return () => {
      socket.off("notification");
    };

  }, []);

  return (
    <Box className="notification-page">

      <Navbar />

      <Box className="notification-body">

        <LeftSidebar />

        <Box className="notification-main">

          {/* FILTER SECTION */}

          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: "10px",
              border: "1px solid #e0e0e0",
              backgroundColor: "white",
              mb: 2,
            }}
          >

            <ToggleButtonGroup
              value={filter}
              exclusive
              onChange={handleChange}
              sx={{
                gap: 1,
                flexWrap: "wrap",
              }}
            >

              <ToggleButton value="all">All</ToggleButton>
              <ToggleButton value="jobs">Jobs</ToggleButton>
              <ToggleButton value="posts">My posts</ToggleButton>
              <ToggleButton value="mentions">Mentions</ToggleButton>

            </ToggleButtonGroup>

          </Paper>


          {/* NOTIFICATIONS LIST */}

          {notifications.length === 0 ? (

            <Paper
              sx={{
                p: 3,
                textAlign: "center",
              }}
            >
              <Typography>No notifications yet</Typography>
            </Paper>

          ) : (

            notifications.map((notification) => (

              <Paper
                key={notification.id}
                sx={{
                  p: 2,
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >

                <Avatar
                  src={
                    notification.sender?.profilePicture
                      ? backendUrl + notification.sender.profilePicture
                      : undefined
                  }
                />

                <Box>

                  <Typography>

                    <strong>
                      {notification.sender?.firstName}{" "}
                      {notification.sender?.lastName}
                    </strong>{" "}
                    {notification.message}

                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: "#666",
                    }}
                  >
                    {new Date(notification.createdAt).toLocaleString()}
                  </Typography>

                </Box>

              </Paper>

            ))

          )}

        </Box>

      </Box>

    </Box>
  );
}
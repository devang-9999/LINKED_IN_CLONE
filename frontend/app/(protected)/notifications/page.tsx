"use client";

import "./Notifications.css";
import { Box, ToggleButton, ToggleButtonGroup, Paper } from "@mui/material";
import { useState } from "react";

import Navbar from "../../../components/Navbar/Navbar";
import LeftSidebar from "../../../components/Feed/LeftSideBar/LeftSideBar";

export default function Notifications() {
  const [filter, setFilter] = useState("all");

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newFilter: string
  ) => {
    if (newFilter !== null) setFilter(newFilter);
  };

  return (
    <Box className="notification-page">

      <Navbar />

      <Box className="notification-body">

        <LeftSidebar />

        <Box className="notification-main">

          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: "10px",
              border: "1px solid #e0e0e0",
              backgroundColor: "white",
              mb: 2
            }}
          >
            <ToggleButtonGroup
              value={filter}
              exclusive
              onChange={handleChange}
              sx={{
                gap: 1,
                flexWrap: "wrap"
              }}
            >
              <ToggleButton
                value="all"
                sx={{
                  borderRadius: "999px !important",
                  textTransform: "none",
                  px: 2,
                  border: "1px solid #ccc",
                  "&.Mui-selected": {
                    backgroundColor: "#057642",
                    color: "white",
                    border: "none",
                    "&:hover": {
                      backgroundColor: "#046c3c"
                    }
                  }
                }}
              >
                All
              </ToggleButton>

              <ToggleButton
                value="jobs"
                sx={{
                  borderRadius: "999px !important",
                  textTransform: "none",
                  px: 2
                }}
              >
                Jobs
              </ToggleButton>

              <ToggleButton
                value="posts"
                sx={{
                  borderRadius: "999px !important",
                  textTransform: "none",
                  px: 2
                }}
              >
                My posts
              </ToggleButton>

              <ToggleButton
                value="mentions"
                sx={{
                  borderRadius: "999px !important",
                  textTransform: "none",
                  px: 2
                }}
              >
                Mentions
              </ToggleButton>

            </ToggleButtonGroup>
          </Paper>

        </Box>

      </Box>
    </Box>
  );
}
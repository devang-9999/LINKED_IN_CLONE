/* eslint-disable @next/next/no-img-element */
"use client";

import "./LeftSideBar.css";

import {
  Box,
  Paper,
  Typography,
  Stack,
  Button
} from "@mui/material";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const NetworkLeftSidebar = () => {
  return (
    <Box className="network-left-container">

      <Paper elevation={1} className="network-card">

        <Typography className="card-title">
          Network overview
        </Typography>

        <Stack direction="row" justifyContent="space-between" className="stats-row">

          {[
            { value: 0, label: "Invites sent" },
            { value: 0, label: "Connections" },
            { value: 0, label: "Following" }
          ].map((stat, i) => (
            <Box key={i} className="stat-item">
              <Typography className="stat-number">
                {stat.value}
              </Typography>
              <Typography className="stat-label">
                {stat.label}
              </Typography>
            </Box>
          ))}

        </Stack>

        <Stack direction="row" alignItems="center" className="show-more">
          <Typography>Show more</Typography>
          <KeyboardArrowDownIcon fontSize="small" />
        </Stack>

      </Paper>


      <Paper elevation={1} className="job-card">

        <Box className="job-header">
          <Typography className="linkedin-badge">
            LinkedIn
          </Typography>

          <Typography variant="subtitle1" className="job-title">
            Your job search powered by your network
          </Typography>

          <Button className="explore-btn">
            Explore jobs
          </Button>
        </Box>

        <img
          src="/5.gif"
          alt="network jobs"
          className="job-image"
        />

      </Paper>


      <Box className="network-footer">

        <Stack className="footer-links">
          <span>About</span>
          <span>Accessibility</span>
          <span>Help Center</span>
          <span>Privacy & Terms</span>
          <span>Ad Choices</span>
          <span>Advertising</span>
          <span>Business Services</span>
          <span>Get the LinkedIn app</span>
          <span>More</span>
        </Stack>

        <Typography className="footer-copyright">
          <strong className="linkedin-text">LinkedIn</strong>
          <span> LinkedIn Corporation © 2026</span>
        </Typography>

      </Box>

    </Box>
  );
};

export default NetworkLeftSidebar;
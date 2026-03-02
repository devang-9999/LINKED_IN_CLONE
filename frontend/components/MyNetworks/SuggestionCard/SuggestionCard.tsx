/* eslint-disable @next/next/no-img-element */
"use client";

import "./SuggestionCard.css";

import {
  Box,
  Typography,
  Avatar,
  Button,
  IconButton,
  Paper
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

const SuggestionCard = () => {
  return (
    <Paper elevation={0} className="suggestion-card">

      <Box className="cover-wrapper">

        <img
          src="6.gif"
          alt="cover"
          className="cover-image"
        />

        <IconButton className="close-btn" size="small">
          <CloseIcon fontSize="small" />
        </IconButton>

      </Box>


      <Box className="avatar-wrapper">
        <Avatar
          src="8.webp"
          className="avatar"
        />
      </Box>


      <Box className="card-body">

        <Typography className="name">
          John Doe
        </Typography>

        <Typography className="headline">
          Software Engineer at Microsoft | AI & Tech
        </Typography>

        <Typography className="followers">
          26,374 followers
        </Typography>

        <Button
          startIcon={<AddIcon />}
          className="follow-btn"
          variant="outlined"
          fullWidth
        >
          Follow
        </Button>

      </Box>

    </Paper>
  );
};

export default SuggestionCard;
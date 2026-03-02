"use client";

import "./FeedContainer.css";

import {
  Box,
  Paper,
  Avatar,
  Button,
  Typography,
  Stack,
} from "@mui/material";

import VideocamIcon from "@mui/icons-material/Videocam";
import ImageIcon from "@mui/icons-material/Image";
import ArticleIcon from "@mui/icons-material/Article";
import AddIcon from "@mui/icons-material/Add";

export default function FeedContainer() {
  return (
    <Box>

      {/* ================= START POST CARD ================= */}
      <Paper elevation={1} className="start-post-card">

        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar src="/profile.jpg" />

          <Button
            fullWidth
            variant="outlined"
            className="start-post-input"
          >
            Start a post
          </Button>
        </Stack>

        <Stack
          direction="row"
          justifyContent="space-around"
          className="start-post-actions"
        >
          <Stack direction="row" alignItems="center" spacing={1} className="post-action">
            <VideocamIcon className="video-icon" />
            <Typography variant="body2">Video</Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1} className="post-action">
            <ImageIcon className="photo-icon" />
            <Typography variant="body2">Photo</Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1} className="post-action">
            <ArticleIcon className="article-icon" />
            <Typography variant="body2">Write article</Typography>
          </Stack>
        </Stack>

      </Paper>


      {/* ================= RECOMMENDED CARD ================= */}
      <Paper elevation={1} className="recommended-card">

        <Typography className="recommended-title">
          Recommended for you
        </Typography>

        {/* Person 1 */}
        <Stack direction="row" spacing={1.5} className="recommended-row">
          <Avatar src="/profile.jpg" />

          <Box className="recommended-info">
            <Typography className="recommended-name">
              Amina Habib
            </Typography>
            <Typography className="recommended-headline">
              Entrepreneur | Women Impact Hub
            </Typography>
          </Box>

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            className="follow-btn"
          >
            Follow
          </Button>
        </Stack>

        {/* Person 2 */}
        <Stack direction="row" spacing={1.5} className="recommended-row">
          <Avatar src="/profile.jpg" />

          <Box className="recommended-info">
            <Typography className="recommended-name">
              Valentina Sander
            </Typography>
            <Typography className="recommended-headline">
              Lic. en Psicología | Recruiter
            </Typography>
          </Box>

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            className="follow-btn"
          >
            Follow
          </Button>
        </Stack>

        {/* Person 3 */}
        <Stack direction="row" spacing={1.5} className="recommended-row">
          <Avatar src="/profile.jpg" />

          <Box className="recommended-info">
            <Typography className="recommended-name">
              Antonela Correa
            </Typography>
            <Typography className="recommended-headline">
              HR at Bagley Argentina
            </Typography>
          </Box>

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            className="follow-btn"
          >
            Follow
          </Button>
        </Stack>

        <Typography className="show-more">
          Show more →
        </Typography>

      </Paper>

      <Box id="feed-posts-container" />

    </Box>
  );
}
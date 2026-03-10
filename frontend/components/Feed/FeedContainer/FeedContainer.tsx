"use client";

import { useEffect, useState } from "react";
import axios from "axios";

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

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  headline?: string;
  profilePicture?: string;
}

export default function FeedContainer() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {

        const res = await axios.get(
          "http://localhost:5000/users",
          {
            withCredentials: true,
          }
        );

        setUsers(res.data);

      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Box>

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
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            className="post-action"
          >
            <VideocamIcon className="video-icon" />
            <Typography variant="body2">Video</Typography>
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            className="post-action"
          >
            <ImageIcon className="photo-icon" />
            <Typography variant="body2">Photo</Typography>
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            className="post-action"
          >
            <ArticleIcon className="article-icon" />
            <Typography variant="body2">Write article</Typography>
          </Stack>
        </Stack>

      </Paper>

      <Paper elevation={1} className="recommended-card">

        <Typography className="recommended-title">
          Recommended for you
        </Typography>

        {loading && (
          <Typography sx={{ mt: 2 }}>
            Loading users...
          </Typography>
        )}

        {!loading && users.length === 0 && (
          <Typography sx={{ mt: 2 }}>
            No users found
          </Typography>
        )}

        {users.map((user) => (
          <Stack
            key={user.id}
            direction="row"
            spacing={1.5}
            alignItems="center"
            className="recommended-row"
          >
            <Avatar
              src={
                user.profilePicture
                  ? `http://localhost:5000/uploads/${user.profilePicture}`
                  : "/profile.jpg"
              }
            />

            <Box className="recommended-info">

              <Typography className="recommended-name">
                {user.firstName || ""} {user.lastName || ""}
              </Typography>

              <Typography className="recommended-headline">
                {user.headline || "LinkedIn Member"}
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
        ))}

        <Typography className="show-more">
          Show more →
        </Typography>

      </Paper>

      <Box id="feed-posts-container" />

    </Box>
  );
}
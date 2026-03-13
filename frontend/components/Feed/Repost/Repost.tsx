/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import axios from "axios";

import {
  Modal,
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  Stack,
  Paper,
} from "@mui/material";

interface User {
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
}

interface Post {
  id: string;
  content: string;
  mediaUrl?: string;
  mediaType?: string;
  user: User;
}

interface Props {
  open: boolean;
  onClose: () => void;
  post: Post | null;
  userId: string;
  onSuccess: () => void;
}

export default function RepostModal({
  open,
  onClose,
  post,
  userId,
  onSuccess,
}: Props) {
  const backendUrl = "http://localhost:5000";

  const api = axios.create({
    baseURL: backendUrl,
    withCredentials: true,
  });

  const [message, setMessage] = useState("");
  const [posting, setPosting] = useState(false);

  const createRepost = async () => {
    if (!post) return;

    try {
      setPosting(true);

      await api.post(`/reposts/${post.id}`, {
        message,
      });

      setMessage("");
      onClose();
      onSuccess();
    } finally {
      setPosting(false);
    }
  };

  if (!post) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 500,
          bgcolor: "white",
          p: 3,
          borderRadius: 2,
          mx: "auto",
          mt: "10%",
        }}
      >
        <Typography variant="h6" mb={2}>
          Repost
        </Typography>

        {/* TEXT INPUT */}
        <TextField
          fullWidth
          multiline
          minRows={3}
          placeholder="Add your thoughts..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        {/* ORIGINAL POST PREVIEW */}
        <Paper sx={{ mt: 2, p: 2 }}>
          <Stack direction="row" spacing={1}>
            <Avatar
              src={
                post.user?.profilePicture
                  ? `${backendUrl}/uploads/${post.user.profilePicture}`
                  : "/profile.jpg"
              }
            />

            <Typography>
              {post.user?.firstName} {post.user?.lastName}
            </Typography>
          </Stack>

          <Typography mt={1}>{post.content}</Typography>

          {post.mediaType === "image" && (
            <img
              src={`${backendUrl}${post.mediaUrl}`}
              style={{ width: "100%", marginTop: 10 }}
            />
          )}

          {post.mediaType === "video" && (
            <video controls style={{ width: "100%", marginTop: 10 }}>
              <source src={`${backendUrl}${post.mediaUrl}`} />
            </video>
          )}
        </Paper>

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={createRepost}
          disabled={posting}
        >
          Repost
        </Button>
      </Box>
    </Modal>
  );
}
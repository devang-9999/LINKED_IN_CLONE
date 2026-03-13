/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState } from "react";

import "./PostModal.css";

import {
  Dialog,
  DialogContent,
  Avatar,
  Typography,
  Box,
  IconButton,
  TextField,
  Button,
  Stack,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import EventIcon from "@mui/icons-material/Event";
import SettingsIcon from "@mui/icons-material/Settings";
import AddIcon from "@mui/icons-material/Add";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
  open: boolean;
  onClose: () => void;
  createPost: (content: string, file?: File) => void;
}

export default function PostModal({ open, onClose, createPost }: Props) {
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const selected = e.target.files[0];

    setFile(selected);
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const removeMedia = () => {
    setFile(null);
  };

  const handlePost = () => {
    createPost(content, file || undefined);

    setContent("");
    setFile(null);

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      className="post-modal"
    >
      <DialogContent className="post-modal-content">
        {/* HEADER */}

        <Box className="post-modal-header">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar src="/profile.jpg" />

            <Box>
              <Typography className="post-user-name">
                DEVANG TRIPATHI
              </Typography>

              <Typography className="post-visibility">
                Post to Anyone
              </Typography>
            </Box>
          </Stack>

          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* TEXT INPUT */}

        <TextField
          multiline
          minRows={6}
          placeholder="What do you want to talk about?"
          className="post-textarea"
          fullWidth
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* MEDIA PREVIEW */}

        {file && (
          <Box className="preview-container">
            <IconButton className="remove-media" onClick={removeMedia}>
              <DeleteIcon />
            </IconButton>

            {/* IMAGE / GIF */}

            {file.type.startsWith("image") && (
              <img src={URL.createObjectURL(file)} className="preview-media" />
            )}

            {/* VIDEO */}

            {file.type.startsWith("video") && (
              <video
                controls
                src={URL.createObjectURL(file)}
                className="preview-media"
              />
            )}
          </Box>
        )}

        {/* FILE INPUT */}

        <input
          type="file"
          accept="image/*,video/*"
          hidden
          ref={fileInputRef}
          onChange={handleFileSelect}
        />

        {/* BOTTOM ACTIONS */}

        <Box className="post-bottom">
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton>
              <SentimentSatisfiedAltIcon />
            </IconButton>

            <Button className="rewrite-btn">✨ Rewrite with AI</Button>

            <IconButton onClick={openFilePicker}>
              <InsertPhotoIcon />
            </IconButton>

            <IconButton>
              <EventIcon />
            </IconButton>

            <IconButton>
              <SettingsIcon />
            </IconButton>

            <IconButton>
              <AddIcon />
            </IconButton>
          </Stack>

          {/* POST BUTTON */}

          <Button
            variant="contained"
            className="post-btn"
            onClick={handlePost}
            disabled={!content.trim()}
          >
            Post
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

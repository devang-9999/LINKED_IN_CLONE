"use client";

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
  Stack
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import EventIcon from "@mui/icons-material/Event";
import SettingsIcon from "@mui/icons-material/Settings";
import AddIcon from "@mui/icons-material/Add";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";

interface Props {
  open: boolean;
  onClose: () => void;

  content: string;
  setContent: (value: string) => void;

  imageUrl: string;
  setImageUrl: (value: string) => void;

  createPost: () => void;
}

export default function PostModal({
  open,
  onClose,
  content,
  setContent,
  imageUrl,
  setImageUrl,
  createPost
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      className="post-modal"
    >
      <DialogContent className="post-modal-content">

        {/* Header */}
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


        {/* Text Input */}

        <TextField
          multiline
          minRows={6}
          placeholder="What do you want to talk about?"
          className="post-textarea"
          fullWidth
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />


        {/* Image URL */}

        <TextField
          placeholder="Image URL (optional)"
          fullWidth
          sx={{ mt: 2 }}
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />


        {/* Bottom Actions */}

        <Box className="post-bottom">

          <Stack direction="row" spacing={1} alignItems="center">

            <IconButton>
              <SentimentSatisfiedAltIcon />
            </IconButton>

            <Button className="rewrite-btn">
              ✨ Rewrite with AI
            </Button>

            <IconButton>
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


          {/* Post Button */}

          <Button
            variant="contained"
            className="post-btn"
            onClick={createPost}
            disabled={!content.trim()}
          >
            Post
          </Button>

        </Box>

      </DialogContent>
    </Dialog>
  );
}
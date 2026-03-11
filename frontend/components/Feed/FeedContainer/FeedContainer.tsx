/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
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
  TextField,
} from "@mui/material";

import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";  
import SendIcon from "@mui/icons-material/Send";

import VideocamIcon from "@mui/icons-material/Videocam";
import ImageIcon from "@mui/icons-material/Image";
import ArticleIcon from "@mui/icons-material/Article";

import PostModal from "../Post/PostModal";

interface Comment {
  id: string;
  text: string;
  userId: string;
  replies?: Comment[];
}

interface Post {
  id: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  user: {
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
  };
}

export default function FeedContainer() {
  const backendUrl = "http://localhost:5000";

  const [userId, setUserId] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [openReply, setOpenReply] = useState<Record<string, boolean>>({});
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [commentInput, setCommentInput] = useState<Record<string, string>>({});
  const [replyInput, setReplyInput] = useState<Record<string, string>>({});

  const [openModal, setOpenModal] = useState(false);
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [posting, setPosting] = useState(false);

  // -----------------------
  // Fetch logged user
  // -----------------------
  const fetchUser = async () => {
    try {
      const res = await axios.get(`${backendUrl}/users/me`, {
        withCredentials: true,
      });
      setUserId(res.data.id);
    } catch (err) {
      console.error("User fetch error", err);
    }
  };

  // -----------------------
  // Fetch posts
  // -----------------------
  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${backendUrl}/posts`, {
        withCredentials: true,
      });

      setPosts(res.data);

      res.data.forEach((p: Post) => {
        fetchLikes(p.id);
      });
    } catch (err) {
      console.error("Fetch posts error", err);
    }
  };

  // -----------------------
  // Fetch likes
  // -----------------------
  const fetchLikes = async (postId: string) => {
    try {
      const res = await axios.get(`${backendUrl}/post-likes/${postId}`);

      setLikes((prev) => ({
        ...prev,
        [postId]: res.data.likesCount,
      }));
    } catch (err) {
      console.error("Likes fetch error", err);
    }
  };

  // -----------------------
  // Toggle like
  // -----------------------
  const toggleLike = async (postId: string) => {
    try {
      await axios.post(
        `${backendUrl}/post-likes`,
        { postId, userId },
        { withCredentials: true },
      );

      fetchLikes(postId);
    } catch (err) {
      console.error("Like error", err);
    }
  };

  // -----------------------
  // Fetch comments
  // -----------------------
  const fetchComments = async (postId: string) => {
    try {
      const res = await axios.get(`${backendUrl}/comments/${postId}`);

      setComments((prev) => ({
        ...prev,
        [postId]: res.data,
      }));
    } catch (err) {
      console.error("Comments fetch error", err);
    }
  };

  // -----------------------
  // Add comment
  // -----------------------
  const addComment = async (postId: string) => {
    const text = commentInput[postId];

    if (!text) return;

    try {
      await axios.post(
        `${backendUrl}/comments`,
        { text, postId, userId },
        { withCredentials: true },
      );

      setCommentInput((prev) => ({
        ...prev,
        [postId]: "",
      }));

      fetchComments(postId);
    } catch (err) {
      console.error("Comment error", err);
    }
  };

  // -----------------------
  // Add reply
  // -----------------------
  const addReply = async (postId: string, parentCommentId: string) => {
    const text = replyInput[parentCommentId];

    if (!text) return;

    try {
      await axios.post(
        `${backendUrl}/comments`,
        {
          text,
          postId,
          userId,
          parentCommentId,
        },
        { withCredentials: true },
      );

      setReplyInput((prev) => ({
        ...prev,
        [parentCommentId]: "",
      }));

      fetchComments(postId);
    } catch (err) {
      console.error("Reply error", err);
    }
  };

  // -----------------------
  // Recursive comment renderer
  // -----------------------
const renderComments = (
  commentList: Comment[],
  postId: string,
  level = 0,
) => {
  return commentList.map((c) => (
    <Box key={c.id} sx={{ ml: level * 3, mt: 1 }}>

      <Typography sx={{ mb: 1 }}>{c.text}</Typography>

      {/* Reply Button */}

      <Button
        size="small"
        onClick={() => toggleReply(c.id)}
      >
        Reply
      </Button>

      {/* Reply Input Toggle */}

      {openReply[c.id] && (
        <Stack direction="row" spacing={1} mt={1}>
          <TextField
            size="small"
            placeholder="Reply..."
            fullWidth
            value={replyInput[c.id] || ""}
            onChange={(e) =>
              setReplyInput((prev) => ({
                ...prev,
                [c.id]: e.target.value,
              }))
            }
          />

          <Button
            variant="contained"
            onClick={() => addReply(postId, c.id)}
          >
            Reply
          </Button>
        </Stack>
      )}

      {/* Nested Replies */}

      {c.replies && renderComments(c.replies, postId, level + 1)}

    </Box>
  ));
};

  const toggleComments = async (postId: string) => {
    const isOpen = openComments[postId];

    // toggle state
    setOpenComments((prev) => ({
      ...prev,
      [postId]: !isOpen,
    }));

    // fetch comments only first time
    if (!isOpen && !comments[postId]) {
      fetchComments(postId);
    }
  };

  // -----------------------
  // Create post
  // -----------------------
  const createPost = async () => {
    if (!content.trim()) return;

    try {
      setPosting(true);

      await axios.post(
        `${backendUrl}/posts`,
        { content, imageUrl, userId },
        { withCredentials: true },
      );

      setContent("");
      setImageUrl("");
      setOpenModal(false);

      fetchPosts();
    } catch (err) {
      console.error("Post create error", err);
    } finally {
      setPosting(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, []);

  const toggleReply = (commentId: string) => {
  setOpenReply((prev) => ({
    ...prev,
    [commentId]: !prev[commentId],
  }));
};

  return (
    <Box>
      {/* Start Post */}

      <Paper elevation={1} className="start-post-card">
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar src="/profile.jpg" />

          <Button
            fullWidth
            variant="outlined"
            className="start-post-input"
            onClick={() => setOpenModal(true)}
          >
            Start a post
          </Button>
        </Stack>

        <Stack
          direction="row"
          justifyContent="space-around"
          className="start-post-actions"
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <VideocamIcon />
            <Typography>Video</Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <ImageIcon />
            <Typography>Photo</Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <ArticleIcon />
            <Typography>Write article</Typography>
          </Stack>
        </Stack>
      </Paper>

      <PostModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        content={content}
        setContent={setContent}
        imageUrl={imageUrl}
        setImageUrl={setImageUrl}
        createPost={createPost}
      />

      {/* Posts */}

      {posts.map((post) => (
        <Paper key={post.id} className="post-card">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar
              src={
                post.user?.profilePicture
                  ? `${backendUrl}/uploads/${post.user.profilePicture}`
                  : "/profile.jpg"
              }
            />

            <Box>
              <Typography className="post-user">
                {post.user?.firstName} {post.user?.lastName}
              </Typography>

              <Typography className="post-time">
                {new Date(post.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Stack>

          <Typography className="post-text">{post.content}</Typography>

          {post.imageUrl && (
            <img src={post.imageUrl} className="post-image" alt="post" />
          )}

          {/* Post actions */}

          <Stack
            direction="row"
            justifyContent="space-around"
            className="post-actions"
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              onClick={() => toggleLike(post.id)}
            >
              <ThumbUpOffAltIcon />
              <Typography>
                Like {likes[post.id] ? `(${likes[post.id]})` : ""}
              </Typography>
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              onClick={() => toggleComments(post.id)}
            >
              <ChatBubbleOutlineIcon />
              <Typography>Comment</Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <RepeatIcon />
              <Typography>Repost</Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <SendIcon />
              <Typography>Send</Typography>
            </Stack>
          </Stack>

          {/* Comments */}

          {openComments[post.id] && comments[post.id] && (
            <Box mt={2}>
              {renderComments(comments[post.id], post.id)}

              <Stack direction="row" spacing={1}>
                <TextField
                  size="small"
                  placeholder="Write a comment..."
                  fullWidth
                  value={commentInput[post.id] || ""}
                  onChange={(e) =>
                    setCommentInput((prev) => ({
                      ...prev,
                      [post.id]: e.target.value,
                    }))
                  }
                />

                <Button variant="contained" onClick={() => addComment(post.id)}>
                  Post
                </Button>
              </Stack>
            </Box>
          )}
        </Paper>
      ))}
    </Box>
  );
}

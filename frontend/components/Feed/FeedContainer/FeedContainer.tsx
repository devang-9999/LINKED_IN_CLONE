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

interface User {
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
}

interface Comment {
  id: string;
  text: string;
  user: User;
  replies?: Comment[];
}

interface Post {
  id: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  user: User;
}

export default function FeedContainer() {
  const backendUrl = "http://localhost:5000";

  const [posts, setPosts] = useState<Post[]>([]);
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [userId, setUserId] = useState("");
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [commentInput, setCommentInput] = useState<Record<string, string>>({});

  const [commentPage, setCommentPage] = useState<Record<string, number>>({});
  const [hasMoreComments, setHasMoreComments] = useState<
    Record<string, boolean>
  >({});

  const [replyPage, setReplyPage] = useState<Record<string, number>>({});
  const [hasMoreReplies, setHasMoreReplies] = useState<Record<string, boolean>>(
    {},
  );
  const [commentLikes, setCommentLikes] = useState<Record<string, number>>({});
  const [replyInput, setReplyInput] = useState<Record<string, string>>({});
  const [openReply, setOpenReply] = useState<Record<string, boolean>>({});

  const [openModal, setOpenModal] = useState(false);
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [posting, setPosting] = useState(false);
  const fetchCommentLikes = async (commentId: string) => {
    const res = await axios.get(`${backendUrl}/comment-likes/${commentId}`);

    setCommentLikes((prev) => ({
      ...prev,
      [commentId]: res.data.likesCount,
    }));
  };

  // ==========================
  // FETCH POSTS
  // ==========================
  const fetchUser = async () => {
    const res = await axios.get(`${backendUrl}/users/me`, {
      withCredentials: true,
    });

    setUserId(res.data.id);
  };
  const fetchPosts = async () => {
    const res = await axios.get(`${backendUrl}/posts`, {
      withCredentials: true,
    });
    setPosts(res.data);

    res.data.forEach((p: Post) => {
      fetchLikes(p.id);
    });
  };

  // ==========================
  // FETCH LIKES
  // ==========================

  const fetchLikes = async (postId: string) => {
    const res = await axios.get(`${backendUrl}/post-likes/${postId}`);

    setLikes((prev) => ({
      ...prev,
      [postId]: res.data.likesCount,
    }));
  };

  // ==========================
  // TOGGLE LIKE
  // ==========================

  const toggleLike = async (postId: string) => {
    await axios.post(
      `${backendUrl}/post-likes`,
      {
        postId,
        userId,
      },
      { withCredentials: true },
    );

    fetchLikes(postId);
  };

  const toggleCommentLike = async (commentId: string) => {
    await axios.post(
      `${backendUrl}/comment-likes`,
      {
        commentId,
        userId,
      },
      { withCredentials: true },
    );
  };
  // ==========================
  // FETCH COMMENTS (2 PER PAGE)
  // ==========================

  const fetchComments = async (postId: string, page = 1) => {
    const res = await axios.get(
      `${backendUrl}/comments/${postId}?page=${page}&limit=2`,
    );

    const newComments = res.data.comments;

    setComments((prev) => ({
      ...prev,
      [postId]:
        page === 1 ? newComments : [...(prev[postId] || []), ...newComments],
    }));

    setCommentPage((prev) => ({ ...prev, [postId]: page }));

    setHasMoreComments((prev) => ({
      ...prev,
      [postId]: res.data.hasMore,
    }));
  };

  // ==========================
  // FETCH REPLIES
  // ==========================

  const fetchReplies = async (commentId: string, page = 1) => {
    const res = await axios.get(
      `${backendUrl}/comments/replies/${commentId}?page=${page}&limit=2`,
    );

    const newReplies = res.data.replies;

    setComments((prev) => {
      const updated = { ...prev };

      Object.keys(updated).forEach((postId) => {
        updated[postId] = updated[postId].map((c) => {
          if (c.id === commentId) {
            return {
              ...c,
              replies:
                page === 1 ? newReplies : [...(c.replies || []), ...newReplies],
            };
          }

          return c;
        });
      });

      return updated;
    });

    setReplyPage((prev) => ({ ...prev, [commentId]: page }));

    setHasMoreReplies((prev) => ({
      ...prev,
      [commentId]: res.data.hasMore,
    }));
  };

  // ==========================
  // TOGGLE COMMENTS
  // ==========================

  const toggleComments = async (postId: string) => {
    const isOpen = openComments[postId];

    setOpenComments((prev) => ({
      ...prev,
      [postId]: !isOpen,
    }));

    if (!isOpen) fetchComments(postId, 1);
  };

  // ==========================
  // ADD COMMENT
  // ==========================

  const addComment = async (postId: string) => {
    const text = commentInput[postId];
    if (!text) return;

    const userRes = await axios.get(`${backendUrl}/users/me`, {
      withCredentials: true,
    });

    const userId = userRes.data.id;

    await axios.post(
      `${backendUrl}/comments`,
      {
        text,
        postId,
        userId,
      },
      { withCredentials: true },
    );

    setCommentInput((prev) => ({
      ...prev,
      [postId]: "",
    }));

    fetchComments(postId, 1);
  };

  // ==========================
  // ADD REPLY
  // ==========================

  const addReply = async (postId: string, commentId: string) => {
    const text = replyInput[commentId];
    if (!text) return;

    const userRes = await axios.get(`${backendUrl}/users/me`, {
      withCredentials: true,
    });

    const userId = userRes.data.id;

    await axios.post(
      `${backendUrl}/comments`,
      {
        text,
        postId,
        userId,
        parentCommentId: commentId,
      },
      { withCredentials: true },
    );

    setReplyInput((prev) => ({ ...prev, [commentId]: "" }));

    fetchReplies(commentId, 1);
  };
  // ==========================
  // CREATE POST
  // ==========================

  const createPost = async () => {
    if (!content.trim()) return;

    try {
      setPosting(true);

      await axios.post(
        `${backendUrl}/posts`,
        { content, imageUrl },
        { withCredentials: true },
      );

      setContent("");
      setImageUrl("");
      setOpenModal(false);

      fetchPosts();
    } finally {
      setPosting(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, []);

  // ==========================
  // RENDER COMMENTS
  // ==========================

  const renderComments = (
    commentList: Comment[],
    postId: string,
    level = 0,
  ) => {
    return commentList.map((c) => (
      <Box key={c.id} className="comment-wrapper" sx={{ ml: level * 4 }}>
        <Avatar
          className="comment-avatar"
          src={
            c.user?.profilePicture
              ? `${backendUrl}/uploads/${c.user.profilePicture}`
              : "/profile.jpg"
          }
        />

        <Box className="comment-body">
          <Typography className="comment-user">
            {c.user?.firstName} {c.user?.lastName}
          </Typography>

          <Typography className="comment-text">{c.text}</Typography>

          <Stack direction="row" spacing={2} className="comment-actions">
            <Typography
              className="comment-action"
              onClick={() => toggleCommentLike(c.id)}
            >
              Like {commentLikes[c.id] ? `(${commentLikes[c.id]})` : ""}
            </Typography>

            <Typography
              className="comment-action"
              onClick={() =>
                setOpenReply((prev) => ({
                  ...prev,
                  [c.id]: !prev[c.id],
                }))
              }
            >
              Reply
            </Typography>

            <Typography
              className="comment-action"
              onClick={() => fetchReplies(c.id, 1)}
            >
              View replies
            </Typography>
          </Stack>

          {openReply[c.id] && (
            <Stack direction="row" spacing={1} mt={1}>
              <TextField
                size="small"
                placeholder="Write reply..."
                fullWidth
                value={replyInput[c.id] || ""}
                onChange={(e) =>
                  setReplyInput((prev) => ({
                    ...prev,
                    [c.id]: e.target.value,
                  }))
                }
              />

              <Button onClick={() => addReply(postId, c.id)}>Reply</Button>
            </Stack>
          )}

          {c.replies && renderComments(c.replies, postId, level + 1)}

          {hasMoreReplies[c.id] && (
            <Button
              size="small"
              onClick={() => fetchReplies(c.id, (replyPage[c.id] || 1) + 1)}
            >
              Load more replies
            </Button>
          )}
        </Box>
      </Box>
    ));
  };

  return (
    <Box>
      {/* START POST */}

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
            <VideocamIcon className="video-icon" />
            <Typography>Video</Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <ImageIcon className="photo-icon" />
            <Typography>Photo</Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <ArticleIcon className="article-icon" />
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

      {/* POSTS */}

      {posts.map((post) => (
        <Paper key={post.id} className="post-card">
          <Stack direction="row" spacing={1.5}>
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

          {post.imageUrl && <img src={post.imageUrl} className="post-image" />}

          {/* POST ACTIONS */}

          <Stack direction="row" className="post-actions">
            <Stack
              direction="row"
              spacing={1}
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
              onClick={() => toggleComments(post.id)}
            >
              <ChatBubbleOutlineIcon />
              <Typography>Comment</Typography>
            </Stack>

            <Stack direction="row" spacing={1}>
              <RepeatIcon />
              <Typography>Repost</Typography>
            </Stack>

            <Stack direction="row" spacing={1}>
              <SendIcon />
              <Typography>Send</Typography>
            </Stack>
          </Stack>

          {/* COMMENTS */}

          {openComments[post.id] && (
            <Box className="comment-section">
              {comments[post.id] && renderComments(comments[post.id], post.id)}

              {hasMoreComments[post.id] && (
                <Button
                  size="small"
                  onClick={() =>
                    fetchComments(post.id, (commentPage[post.id] || 1) + 1)
                  }
                >
                  Load more comments
                </Button>
              )}

              <Stack direction="row" spacing={1} mt={2}>
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

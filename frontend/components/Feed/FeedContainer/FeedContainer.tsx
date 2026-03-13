/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, useCallback } from "react";
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

import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import SendIcon from "@mui/icons-material/Send";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VideocamIcon from "@mui/icons-material/Videocam";
import ImageIcon from "@mui/icons-material/Image";
import ArticleIcon from "@mui/icons-material/Article";

import PostModal from "../Post/PostModal";
import RepostModal from "../Repost/Repost";

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
  mediaUrl?: string;
  mediaType?: string;
  createdAt: string;
  user: User;
}

interface Repost {
  id: string;
  message?: string;
  createdAt: string;
  user: User;
  post: Post;
}
export default function FeedContainer() {
  const backendUrl = "http://localhost:5000";

  const api = axios.create({
    baseURL: backendUrl,
    withCredentials: true,
  });

  const [posts, setPosts] = useState<Post[]>([]);
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [likeAnimating, setLikeAnimating] = useState<Record<string, boolean>>(
    {},
  );
  const [reposts, setReposts] = useState<Repost[]>([]);
  const [feed, setFeed] = useState<any[]>([]);
  const [userId, setUserId] = useState("");

  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [commentInput, setCommentInput] = useState<Record<string, string>>({});
  const [commentLikes, setCommentLikes] = useState<Record<string, number>>({});

  const [commentPage, setCommentPage] = useState<Record<string, number>>({});
  const [hasMoreComments, setHasMoreComments] = useState<
    Record<string, boolean>
  >({});

  const [replyPage, setReplyPage] = useState<Record<string, number>>({});
  const [hasMoreReplies, setHasMoreReplies] = useState<Record<string, boolean>>(
    {},
  );

  const [replyInput, setReplyInput] = useState<Record<string, string>>({});
  const [openReply, setOpenReply] = useState<Record<string, boolean>>({});

  const [openModal, setOpenModal] = useState(false);
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);

  const [openRepostModal, setOpenRepostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const getWordCount = useCallback((text: string) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  }, []);

  const fetchUser = async () => {
    const res = await api.get("/users/me");
    setUserId(res.data.id);
  };
  const fetchReposts = async () => {
    const res = await api.get("/reposts");

    setReposts(res.data);
  };

  const buildFeed = (posts: Post[], reposts: Repost[]) => {
    const postItems = posts.map((p) => ({
      type: "post",
      createdAt: p.createdAt,
      data: p,
    }));

    const repostItems = reposts.map((r) => ({
      type: "repost",
      createdAt: r.createdAt,
      data: r,
    }));

    const combined = [...postItems, ...repostItems];

    combined.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    setFeed(combined);
  };
  const fetchPosts = async () => {
    const res = await api.get("/posts");
    setPosts(res.data);
  };

  const fetchLikes = async (postId: string) => {
    if (!userId) return;

    const res = await api.get(`/post-likes/${postId}/${userId}`);

    setLikes((prev) => ({
      ...prev,
      [postId]: res.data.likesCount,
    }));

    setLikedPosts((prev) => ({
      ...prev,
      [postId]: res.data.isLikedByUser,
    }));
  };

  const toggleLike = async (postId: string) => {
    await api.post("/post-likes", { postId, userId });

    setLikeAnimating((prev) => ({
      ...prev,
      [postId]: true,
    }));

    setTimeout(() => {
      setLikeAnimating((prev) => ({
        ...prev,
        [postId]: false,
      }));
    }, 400);

    fetchLikes(postId);
  };

  const fetchCommentLikes = async (commentId: string) => {
    const res = await api.get(`/comment-likes/${commentId}/${userId}`);

    setCommentLikes((prev) => ({
      ...prev,
      [commentId]: res.data.likesCount,
    }));
  };

  const toggleCommentLike = async (commentId: string) => {
    await api.post("/comment-likes", { commentId, userId });

    fetchCommentLikes(commentId);
  };

  const fetchComments = async (postId: string, page = 1) => {
    const res = await api.get(`/comments/${postId}?page=${page}&limit=2`);
    const newComments = res.data.comments;

    newComments.forEach((c: Comment) => fetchCommentLikes(c.id));

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

  const toggleComments = (postId: string) => {
    const isOpen = openComments[postId];

    setOpenComments((prev) => ({
      ...prev,
      [postId]: !isOpen,
    }));

    if (!isOpen) fetchComments(postId, 1);
  };

  const addComment = async (postId: string) => {
    const text = commentInput[postId];
    if (!text) return;

    if (getWordCount(text) > 100) {
      alert("Comment cannot exceed 100 words");
      return;
    }

    await api.post("/comments", { text, postId, userId });

    setCommentInput((prev) => ({
      ...prev,
      [postId]: "",
    }));

    fetchComments(postId, 1);
  };

  const fetchReplies = async (commentId: string, page = 1) => {
    const res = await api.get(
      `/comments/replies/${commentId}?page=${page}&limit=2`,
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

  const addReply = async (postId: string, commentId: string) => {
    const text = replyInput[commentId];
    if (!text) return;

    await api.post("/comments", {
      text,
      postId,
      userId,
      parentCommentId: commentId,
    });

    setReplyInput((prev) => ({ ...prev, [commentId]: "" }));
    fetchReplies(commentId, 1);
  };

  const createPost = async (content: string, file?: File) => {
    if (!content.trim()) return;

    try {
      setPosting(true);

      const formData = new FormData();

      formData.append("content", content);
      formData.append("userId", userId);

      if (file) {
        formData.append("file", file);
      }

      await api.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setOpenModal(false);

      fetchPosts();
    } finally {
      setPosting(false);
    }
  };

  // useEffect(() => {
  //   fetchUser();
  //   fetchPosts();

  // }, []);

  const loadFeed = async () => {
    const postsRes = await api.get("/posts");
    const repostRes = await api.get("/reposts");

    setPosts(postsRes.data);
    setReposts(repostRes.data);

    buildFeed(postsRes.data, repostRes.data);
  };

  useEffect(() => {
    fetchUser();
    loadFeed();
  }, []);

  useEffect(() => {
    if (userId && posts.length) {
      posts.forEach((p) => fetchLikes(p.id));
    }
  }, [userId, posts]);

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
                onChange={(e) => {
                  const value = e.target.value;

                  if (getWordCount(value) <= 100) {
                    setReplyInput((prev) => ({
                      ...prev,
                      [c.id]: value,
                    }));
                  }
                }}
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
        createPost={createPost}
      />

      <RepostModal
        open={openRepostModal}
        onClose={() => setOpenRepostModal(false)}
        post={selectedPost}
        userId={userId}
        onSuccess={() => {
          fetchPosts();
        }}
      />
      {feed.map((item: any) => {
        // ================= NORMAL POST =================
        if (item.type === "post") {
          const post = item.data;

          return (
            <Paper key={post.id} className="post-card">
              {/* USER HEADER */}
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

              {/* POST TEXT */}
              <Typography className="post-text">{post.content}</Typography>

              {/* MEDIA */}
              {post.mediaType === "image" && (
                <img
                  src={`${backendUrl}${post.mediaUrl}`}
                  className="post-image"
                />
              )}

              {post.mediaType === "video" && (
                <video controls className="post-video">
                  <source src={`${backendUrl}${post.mediaUrl}`} />
                </video>
              )}

              {/* ACTION BAR */}
              <Stack direction="row" className="post-actions">
                <Stack
                  direction="row"
                  spacing={1}
                  onClick={() => toggleLike(post.id)}
                  className={`like-btn 
              ${likedPosts[post.id] ? "liked" : ""} 
              ${likeAnimating[post.id] ? "animate" : ""}`}
                >
                  {likedPosts[post.id] ? (
                    <FavoriteIcon />
                  ) : (
                    <FavoriteBorderIcon />
                  )}

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

                <Stack
                  direction="row"
                  spacing={1}
                  onClick={() => {
                    setSelectedPost(post);
                    setOpenRepostModal(true);
                  }}
                >
                  <RepeatIcon />
                  <Typography>Repost</Typography>
                </Stack>

                <Stack direction="row" spacing={1}>
                  <SendIcon />
                  <Typography>Send</Typography>
                </Stack>
              </Stack>

              {/* COMMENT SECTION */}
              {openComments[post.id] && (
                <Box className="comment-section">
                  {comments[post.id] &&
                    renderComments(comments[post.id], post.id)}

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
                      onChange={(e) => {
                        const value = e.target.value;

                        if (getWordCount(value) <= 100) {
                          setCommentInput((prev) => ({
                            ...prev,
                            [post.id]: value,
                          }));
                        }
                      }}
                    />

                    <Button
                      variant="contained"
                      onClick={() => addComment(post.id)}
                    >
                      Post
                    </Button>
                  </Stack>
                </Box>
              )}
            </Paper>
          );
        }

        // ================= REPOST =================
        if (item.type === "repost") {
          const repost = item.data;
          const post = repost.post;

          return (
            <Paper key={repost.id} className="post-card">
              {/* REPOST HEADER */}
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar
                  src={
                    repost.user?.profilePicture
                      ? `${backendUrl}/uploads/${repost.user.profilePicture}`
                      : "/profile.jpg"
                  }
                />

                <Typography fontWeight={600}>
                  {repost.user?.firstName} {repost.user?.lastName} reposted this
                </Typography>
              </Stack>

              {repost.message && (
                <Typography className="post-text" mt={1}>
                  {repost.message}
                </Typography>
              )}

              {/* ORIGINAL POST */}
              <Box mt={2} className="repost-wrapper">
                <Stack direction="row" spacing={1}>
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

                {post.mediaType === "image" && (
                  <img
                    src={`${backendUrl}${post.mediaUrl}`}
                    className="post-image"
                  />
                )}

                {post.mediaType === "video" && (
                  <video controls className="post-video">
                    <source src={`${backendUrl}${post.mediaUrl}`} />
                  </video>
                )}
              </Box>

              {/* ACTION BAR */}
              <Stack direction="row" className="post-actions">
                <Stack
                  direction="row"
                  spacing={1}
                  onClick={() => toggleLike(post.id)}
                >
                  {likedPosts[post.id] ? (
                    <FavoriteIcon />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
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

                <Stack
                  direction="row"
                  spacing={1}
                  onClick={() => {
                    setSelectedPost(post);
                    setOpenRepostModal(true);
                  }}
                >
                  <RepeatIcon />
                  <Typography>Repost</Typography>
                </Stack>

                <Stack direction="row" spacing={1}>
                  <SendIcon />
                  <Typography>Send</Typography>
                </Stack>
              </Stack>
            </Paper>
          );
        }

        return null;
      })}
    </Box>
  );
}

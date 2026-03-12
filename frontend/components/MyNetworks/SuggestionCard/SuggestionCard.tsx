/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */

"use client";

import { useState, useEffect } from "react";
import axios from "axios";

import "./SuggestionCard.css";

import {
  Box,
  Typography,
  Avatar,
  Button,
  IconButton,
  Paper,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

import {
  followUser,
  unfollowUser,
  sendConnectionRequest,
} from "../../../redux/network/network.service";

const backendUrl = "http://localhost:5000/uploads/";
const API = "http://localhost:5000";

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  headline?: string;
  profilePicture?: string;
  coverPicture?: string;
}

interface SuggestionCardProps {
  user: User;
  onRemove?: (id: string) => void;
}

export default function SuggestionCard({
  user,
  onRemove,
}: SuggestionCardProps) {

  const [followed, setFollowed] = useState(false);
  const [requested, setRequested] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  // FOLLOW STATUS
  const checkFollowStatus = async () => {
    try {

      const res = await axios.get(
        `${API}/follow/status/${user.id}`,
        { withCredentials: true }
      );

      setFollowed(res.data.isFollowing);

    } catch (err) {
      console.error("Follow status error:", err);
    }
  };

  // FOLLOWERS COUNT
  const getFollowersCount = async () => {
    try {

      const res = await axios.get(
        `${API}/follow/count/${user.id}`
      );

      setFollowersCount(res.data.followersCount);

    } catch (err) {
      console.error("Followers count error:", err);
    }
  };

  // CHECK CONNECTION REQUEST STATUS
  const checkConnectionStatus = async () => {
    try {

      const res = await axios.get(
        `${API}/connections/sent`,
        { withCredentials: true }
      );

      const exists = res.data.some(
        (req: any) => req.receiver.id === user.id
      );

      setRequested(exists);

    } catch (err) {
      console.error("Connection status error:", err);
    }
  };

  // FOLLOW / UNFOLLOW
  const handleFollowToggle = async () => {

    try {

      if (followed) {

        await unfollowUser(user.id);

        setFollowed(false);

        setFollowersCount((prev) =>
          Math.max(prev - 1, 0)
        );

      } else {

        await followUser(user.id);

        setFollowed(true);

        setFollowersCount((prev) => prev + 1);

      }

    } catch (err) {
      console.error("Follow toggle error:", err);
    }
  };

  // SEND CONNECTION REQUEST
  const handleConnect = async () => {

    try {

      await sendConnectionRequest(user.id);

      setRequested(true);

    } catch (err) {
      console.error("Connection request error:", err);
    }
  };

  // INITIAL FETCH
  useEffect(() => {

    if (!user?.id) return;

    checkFollowStatus();
    getFollowersCount();
    checkConnectionStatus();

  }, [user.id]);

  return (
    <Paper elevation={0} className="suggestion-card">

      {/* COVER IMAGE */}
      <Box className="cover-wrapper">

        <img
          src={
            user.coverPicture
              ? backendUrl + user.coverPicture
              : "/default-cover.jpg"
          }
          alt="cover"
          className="cover-image"
        />

        {/* REMOVE CARD */}
        <IconButton
          className="close-btn"
          size="small"
          onClick={() => onRemove?.(user.id)}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

      </Box>

      {/* PROFILE IMAGE */}
      <Box className="avatar-wrapper">

        <Avatar
          src={
            user.profilePicture
              ? backendUrl + user.profilePicture
              : "/default-avatar.png"
          }
          className="avatar"
        />

      </Box>

      <Box className="card-body">

        {/* NAME */}
        <Typography className="name">
          {user.firstName} {user.lastName}
        </Typography>

        {/* HEADLINE */}
        <Typography className="headline">
          {user.headline}
        </Typography>

        {/* FOLLOWERS */}
        <Typography className="followers">
          {followersCount} followers
        </Typography>

        {/* FOLLOW BUTTON */}
        <Button
          startIcon={!followed ? <AddIcon /> : undefined}
          className="follow-btn"
          variant={followed ? "contained" : "outlined"}
          fullWidth
          onClick={handleFollowToggle}
          sx={{backgroundColor:"#1282f3"}}
        >
          {followed ? "Following" : "Follow"}
        </Button>

        {!requested ? (

          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 1}}
            onClick={handleConnect}
          >
            Connect
          </Button>

        ) : (

          <Button
            variant="contained"
            fullWidth
            disabled
            sx={{ mt: 1 }}
          >
            Pending
          </Button>

        )}

      </Box>

    </Paper>
  );
}
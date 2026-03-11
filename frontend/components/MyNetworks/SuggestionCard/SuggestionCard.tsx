/* eslint-disable react-hooks/set-state-in-effect */
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
  Paper
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

import {
  followUser,
  unfollowUser,
  sendConnectionRequest
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
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ user }) => {

  const [followed, setFollowed] = useState(false);
  const [requested, setRequested] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  // CHECK FOLLOW STATUS
  const checkFollowStatus = async () => {
    try {
      const res = await axios.get(
        `${API}/follow/status/${user.id}`,
        { withCredentials: true }
      );

      setFollowed(res.data.isFollowing);
    } catch (err) {
      console.error(err);
    }
  };

  // GET FOLLOWERS COUNT
  const getFollowersCount = async () => {
    try {
      const res = await axios.get(
        `${API}/follow/count/${user.id}`
      );

      setFollowersCount(res.data.followersCount);
    } catch (err) {
      console.error(err);
    }
  };

  // FOLLOW / UNFOLLOW TOGGLE
  const handleFollowToggle = async () => {
    try {

      if (followed) {
        await unfollowUser(user.id);
        setFollowed(false);
        setFollowersCount((prev) => prev - 1);
      } else {
        await followUser(user.id);
        setFollowed(true);
        setFollowersCount((prev) => prev + 1);
      }

    } catch (err) {
      console.error(err);
    }
  };

  // CONNECT REQUEST
  const handleConnect = async () => {
    try {
      await sendConnectionRequest(user.id);
      setRequested(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    checkFollowStatus();
    getFollowersCount();
  }, []);

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

        <IconButton className="close-btn" size="small">
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

        <Typography className="name">
          {user.firstName} {user.lastName}
        </Typography>

        <Typography className="headline">
          {user.headline}
        </Typography>

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
        >
          {followed ? "Following" : "Follow"}
        </Button>

        {/* CONNECT BUTTON */}
        {!requested ? (
          <Button
            variant="outlined"
            fullWidth
            onClick={handleConnect}
            style={{ marginTop: "8px" }}
          >
            Connect
          </Button>
        ) : (
          <Button
            variant="contained"
            fullWidth
            style={{ marginTop: "8px" }}
          >
            Pending
          </Button>
        )}

      </Box>

    </Paper>
  );
};

export default SuggestionCard;
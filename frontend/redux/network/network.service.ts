import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

/* FOLLOW USER */
export const followUser = async (userId: string) => {
  return API.post(`/follow/${userId}`);
};

/* UNFOLLOW USER */
export const unfollowUser = async (userId: string) => {
  return API.delete(`/follow/${userId}`);
};

/* FOLLOW STATUS */
export const getFollowStatus = async (userId: string) => {
  return API.get(`/follow/status/${userId}`);
};

/* FOLLOWERS COUNT */
export const getFollowersCount = async (userId: string) => {
  return API.get(`/follow/count/${userId}`);
};

/* SEND CONNECTION REQUEST */
export const sendConnectionRequest = async (userId: string) => {
  return API.post(`/connections/request/${userId}`);
};
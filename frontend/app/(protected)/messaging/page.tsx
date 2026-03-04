/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import "./Messaging.css";
import {
  Box,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  IconButton,
  Avatar,
} from "@mui/material";

import EmojiPicker from "emoji-picker-react";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SearchIcon from "@mui/icons-material/Search";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
import ImageIcon from "@mui/icons-material/Image";
import AttachFileIcon from "@mui/icons-material/AttachFile";

import LinkedInNavbar from "@/components/Navbar/Navbar";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/utils/hooks";
import {
  fetchCurrentUser,
  fetchUsers,
} from "@/redux/authentication/auth.slice";
import { getSocket } from "@/utils/socket";
import {
  addMessage,
  clearMessages,
  setMessages,
} from "@/redux/messaging/messaging.slice";

type User = {
  id: string;
  username: string;
  profilePic?: string | null;
  isOnline?: boolean;
};

const getAvatarUrl = (file?: string | null) =>
  file ? `http://localhost:5000/uploads/${file}` : undefined;

const stringToColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 60%, 50%)`;
};

const MessagingLayout = () => {
  const [tab, setTab] = useState(0);
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const messages = useAppSelector((state) => state.messenger.messages);

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messageText, setMessageText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [search, setSearch] = useState("");
  const [otherUserTyping, setOtherUserTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const me = currentUser?.userid;
  const targetUser = selectedUser?.id;
  const roomId = me && targetUser ? [me, targetUser].sort().join("_") : null;

  useEffect(() => {
    if (!currentUser) return;

    dispatch(fetchUsers({ page: 1, limit: 50 }))
      .unwrap()
      .then((res: any) => {
        setUsers(
          res.data
            .filter((u: any) => u.userid !== currentUser.userid)
            .map((u: any) => ({
              id: u.userid,
              username: u.username,
              isOnline: u.isOnline,
              profilePic: u.profilePic,
            })),
        );
      });
  }, [currentUser, dispatch]);

  useEffect(() => {
    if (currentUser?.userid) {
      dispatch(fetchCurrentUser(currentUser.userid));
    }
  }, [currentUser?.userid, dispatch]);

  useEffect(() => {
    if (!me) return;

    const socket = getSocket();
    if (!socket) return;

    socket.connect();
    socket.emit("onConnection", me);

    return () => {
      socket.disconnect();
    };
  }, [me]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const online = ({ userid }: any) => {
      setUsers((prev) =>
        prev.map((u) => (u.id === userid ? { ...u, isOnline: true } : u)),
      );
    };

    const offline = ({ userid }: any) => {
      setUsers((prev) =>
        prev.map((u) => (u.id === userid ? { ...u, isOnline: false } : u)),
      );
    };

    socket.on("userOnline", online);
    socket.on("userOffline", offline);

    return () => {
      socket.off("userOnline", online);
      socket.off("userOffline", offline);
    };
  }, []);

  useEffect(() => {
    if (!roomId) return;

    const socket = getSocket();
    if (!socket) return;

    dispatch(clearMessages());
    socket.emit("joinRoom", roomId);
    socket.emit("fetchMessages", roomId);

    socket.on("getMessages", (msgs: any[]) => dispatch(setMessages(msgs)));
    socket.on("newMessage", (msg: any) => dispatch(addMessage(msg)));

    return () => {
      socket.emit("leaveRoom", roomId);
      socket.off("getMessages");
      socket.off("newMessage");
    };
  }, [roomId, dispatch]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const onTyping = () => {
      setOtherUserTyping(true);
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => setOtherUserTyping(false), 2000);
    };

    socket.on("usertyping", onTyping);
    return () => {
      socket.off("usertyping", onTyping);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !roomId) return;

    getSocket()?.emit("sendMessage", {
      roomId,
      text: messageText,
      senderId: me,
      receiverId: targetUser,
    });

    setMessageText("");
  };

  return (
    <>
      <LinkedInNavbar />

      <Box className="messaging-wrapper">
        <Box className="messaging-container">
          <Box className="conversation-panel">
            <Box className="conversation-header">
              <Typography variant="subtitle1" fontWeight={600}>
                Messaging
              </Typography>

              <Box>
                <IconButton size="small">
                  <MoreHorizIcon />
                </IconButton>

                <IconButton size="small">
                  <EditIcon />
                </IconButton>
              </Box>
            </Box>

            <Box className="search-bar">
              <SearchIcon fontSize="small" />
              <input
                placeholder="Search messages"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Box>

            <Tabs
              value={tab}
              onChange={(e, v) => setTab(v)}
              variant="scrollable"
              scrollButtons="auto"
              className="conversation-tabs"
            >
              <Tab label="Focused" />
              <Tab label="Jobs" />
              <Tab label="Unread" />
              <Tab label="Connections" />
              <Tab label="InMail" />
              <Tab label="Starred" />
            </Tabs>

            <div className="user-list">
              {users
                .filter((u) =>
                  u.username.toLowerCase().includes(search.toLowerCase()),
                )
                .map((user) => (
                  <div
                    key={user.id}
                    className={`user-item ${
                      selectedUser?.id === user.id ? "active" : ""
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="user-avatar">
                      <Avatar
                        src={getAvatarUrl(user.profilePic)}
                        sx={{
                          bgcolor: user.profilePic
                            ? undefined
                            : stringToColor(user.username),
                        }}
                      >
                        {!user.profilePic && user.username[0].toUpperCase()}
                      </Avatar>

                      {user.isOnline && <span className="online-dot" />}
                    </div>

                    <strong>{user.username}</strong>
                  </div>
                ))}
            </div>

            <Box className="empty-state">
              <img src="/9.svg" alt="no messages" />
              <Typography variant="h6">No messages yet</Typography>
              <Typography variant="body2" color="text.secondary">
                Reach out and start a conversation to advance your career
              </Typography>

              <Button variant="outlined" sx={{ borderRadius: "24px", mt: 2 }}>
                Send a message
              </Button>
            </Box>
          </Box>

          <Box className="chat-window">
            <Box className="chat-header">
              <Typography fontWeight={600}>New message</Typography>
            </Box>

            <Box className="chat-recipient">
              <TextField
                fullWidth
                variant="standard"
                placeholder="Type a name or multiple names"
                InputProps={{ disableUnderline: true }}
              />
            </Box>

            <div className="chat-messages">
              {messages.map((msg: any) => {
                const isMe = msg.senderId === me;

                return (
                  <div
                    key={msg.id}
                    className={`message-row ${isMe ? "me" : "other"}`}
                  >
                    <div
                      className={`message-bubble ${isMe ? "sent" : "received"}`}
                    >
                      {msg.message}
                      <div className="msg-time">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}

              {otherUserTyping && (
                <div className="message-row other">
                  <div className="typing-bubble">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <Box className="chat-input-area">
              {selectedUser && (
                <div className="chat-input">
                  <IconButton onClick={() => setShowEmojiPicker((p) => !p)}>
                    <SentimentSatisfiedAltIcon />
                  </IconButton>

                  <input
                    value={messageText}
                    placeholder="Type a message"
                    onChange={(e) => {
                      setMessageText(e.target.value);
                      getSocket()?.emit("typing", { roomId, userid: me });
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  />

                </div>
              )}

              <Box className="chat-actions">
                <Box className="left-actions">
                  <IconButton size="small">
                    <ImageIcon />
                  </IconButton>

                  <IconButton size="small">
                    <AttachFileIcon />
                  </IconButton>

                  <Typography className="gif">GIF</Typography>

                  {showEmojiPicker && (
                    <div className="emoji-picker">
                      <EmojiPicker
                        onEmojiClick={(e) => setMessageText((p) => p + e.emoji)}
                      />
                    </div>
                  )}
                </Box>

                <Button variant="contained" className="send-btn" onClick={handleSendMessage}>
                  Send
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default MessagingLayout;

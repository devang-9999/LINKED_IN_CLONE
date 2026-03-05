/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import "./Messaging.css";

import { Box, Typography, Button, IconButton, Avatar } from "@mui/material";

import EmojiPicker from "emoji-picker-react";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SearchIcon from "@mui/icons-material/Search";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
import ImageIcon from "@mui/icons-material/Image";
import AttachFileIcon from "@mui/icons-material/AttachFile";

import LinkedInNavbar from "@/components/Navbar/Navbar";

import { useEffect, useRef, useState, useMemo } from "react";
import axios from "axios";
import { getSocket } from "@/utils/socket";

type User = {
  id: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  auth?: {
    isActive?: boolean;
  };
};

type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: string;
};

const getAvatarUrl = (file?: string | null) =>
  file ? `http://localhost:5000/uploads/${file}` : undefined;

export default function MessagingLayout() {
  /* SOCKET INSTANCE (STABLE) */
  const socket = useMemo(() => getSocket(), []);

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [search, setSearch] = useState("");
  const [otherUserTyping, setOtherUserTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const me =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const roomId =
    me && selectedUser ? [me, selectedUser.id].sort().join("_") : null;

  useEffect(() => {
    axios.get("http://localhost:5000/users").then((res) => {
      const filtered = res.data.filter((u: User) => u.id !== me);
      setUsers(filtered);
    });
  }, [me]);

  useEffect(() => {
    if (!me) return;

    socket.connect();

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.emit("onConnection", me);

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, [me, socket]);

  useEffect(() => {
    const online = ({ userid }: any) => {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userid ? { ...u, auth: { isActive: true } } : u,
        ),
      );
    };

    const offline = ({ userid }: any) => {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userid ? { ...u, auth: { isActive: false } } : u,
        ),
      );
    };

    socket.on("userOnline", online);
    socket.on("userOffline", offline);

    return () => {
      socket.off("userOnline", online);
      socket.off("userOffline", offline);
    };
  }, [socket]);

  useEffect(() => {
    if (!roomId) return;

    setMessages([]);

    console.log("Joining room:", roomId);

    socket.emit("joinRoom", roomId);
    socket.emit("fetchMessages", roomId);

    const handleMessages = (msgs: Message[]) => {
      setMessages(msgs);
    };

    const handleNewMessage = (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("getMessages", handleMessages);
    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.emit("leaveRoom", roomId);
      socket.off("getMessages", handleMessages);
      socket.off("newMessage", handleNewMessage);
    };
  }, [roomId, socket]);

  useEffect(() => {
    const onTyping = () => {
      setOtherUserTyping(true);

      if (typingTimeout.current) clearTimeout(typingTimeout.current);

      typingTimeout.current = setTimeout(() => {
        setOtherUserTyping(false);
      }, 2000);
    };

    socket.on("usertyping", onTyping);

    return () => {
      socket.off("usertyping", onTyping);
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !roomId || !selectedUser) return;

    socket.emit("sendMessage", {
      roomId,
      senderId: me,
      receiverId: selectedUser.id,
      message: messageText,
    });

    setMessageText("");
  };

  return (
    <>
      <LinkedInNavbar />

      <Box className="messaging-wrapper">
        <Box className="messaging-container">
          {/* LEFT PANEL */}

          <Box className="conversation-panel">
            <Box className="conversation-header">
              <Typography fontWeight={600}>Messaging</Typography>

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
                placeholder="Search users"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Box>

            <div className="user-list">
              {users
                .filter((u) =>
                  `${u.firstName ?? ""} ${u.lastName ?? ""}`
                    .toLowerCase()
                    .includes(search.toLowerCase()),
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
                      <Avatar src={getAvatarUrl(user.profilePicture)} />

                      {user.auth?.isActive && <span className="online-dot" />}
                    </div>

                    <strong>
                      {user.firstName} {user.lastName}
                    </strong>
                  </div>
                ))}
            </div>
          </Box>

          {/* CHAT WINDOW */}

          <Box className="chat-window">
            <Box className="chat-header">
              <Typography fontWeight={600}>
                {selectedUser
                  ? `${selectedUser.firstName} ${selectedUser.lastName}`
                  : "Select a conversation"}
              </Typography>
            </Box>

            <div className="chat-messages">
              {messages.map((msg) => {
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

            {selectedUser && (
              <Box className="chat-input-area">
                <div className="chat-input">
                  <IconButton onClick={() => setShowEmojiPicker((p) => !p)}>
                    <SentimentSatisfiedAltIcon />
                  </IconButton>

                  <input
                    value={messageText}
                    placeholder="Type a message"
                    onChange={(e) => {
                      setMessageText(e.target.value);

                      if (roomId) {
                        socket.emit("typing", {
                          roomId,
                          userid: me,
                        });
                      }
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  />

                  {showEmojiPicker && (
                    <div className="emoji-picker">
                      <EmojiPicker
                        onEmojiClick={(emojiData) => {
                          setMessageText((prev) => prev + emojiData.emoji);
                        }}
                      />
                    </div>
                  )}
                </div>

                <Box className="chat-actions">
                  <Box className="left-actions">
                    <IconButton size="small">
                      <ImageIcon />
                    </IconButton>

                    <IconButton size="small">
                      <AttachFileIcon />
                    </IconButton>
                  </Box>

                  <Button
                    variant="contained"
                    className="send-btn"
                    onClick={handleSendMessage}
                  >
                    Send
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}

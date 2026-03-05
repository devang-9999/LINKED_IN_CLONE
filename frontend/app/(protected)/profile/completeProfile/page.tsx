/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import {
  Avatar,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface UpdateProfileProps {
  onClose?: () => void;
}

export default function CompleteProfilePage({ onClose }: UpdateProfileProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    headline: "",
    about: "",
  });

  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState(false);

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "profilePicture" | "coverPicture",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    if (type === "profilePicture") {
      setProfileFile(file);
      setProfilePreview(previewUrl);
    } else {
      setCoverFile(file);
      setCoverPreview(previewUrl);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const data = new FormData();

      data.append("firstName", formData.firstName);
      data.append("lastName", formData.lastName);
      data.append("headline", formData.headline);
      data.append("about", formData.about);

      if (profileFile) {
        data.append("profilePicture", profileFile);
      }

      if (coverFile) {
        data.append("coverPicture", coverFile);
      }

      await axios.patch(
        "http://localhost:5000/users/me/complete-profile",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setSnackbar(true);
    if (onClose) onClose();
      setTimeout(() => {
        router.push("/feed");
      }, 1000);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={4} sx={{ p: 4, mt: 6, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Complete Your Profile
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle1">Cover Picture</Typography>
              <Box
                sx={{
                  height: 150,
                  backgroundColor: "#f3f2ef",
                  borderRadius: 2,
                  position: "relative",
                }}
              >
                {coverPreview && (
                  <img
                    src={coverPreview}
                    alt="cover"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                )}

                <Button
                  component="label"
                  startIcon={<PhotoCamera />}
                  sx={{ position: "absolute", bottom: 10, right: 10 }}
                  variant="contained"
                  size="small"
                >
                  Upload
                  <input
                    type="file"
                    hidden
                    onChange={(e) => handleImageChange(e, "coverPicture")}
                  />
                </Button>
              </Box>
            </Box>

            <Box textAlign="center">
              <Avatar
                src={profilePreview || ""}
                sx={{ width: 100, height: 100, margin: "0 auto" }}
              />
              <Button
                component="label"
                startIcon={<PhotoCamera />}
                variant="outlined"
              >
                Change Profile Picture
                <input
                  type="file"
                  hidden
                  onChange={(e) => handleImageChange(e, "profilePicture")}
                />
              </Button>
            </Box>

            <TextField
              label="First Name"
              name="firstName"
              required
              fullWidth
              value={formData.firstName}
              onChange={handleChange}
            />

            <TextField
              label="Last Name"
              name="lastName"
              required
              fullWidth
              value={formData.lastName}
              onChange={handleChange}
            />

            <TextField
              label="Headline"
              name="headline"
              fullWidth
              value={formData.headline}
              onChange={handleChange}
            />

            <TextField
              label="About"
              name="about"
              multiline
              rows={4}
              fullWidth
              value={formData.about}
              onChange={handleChange}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save & Continue"}
            </Button>
          </Stack>
        </form>
      </Paper>

      <Snackbar
        open={snackbar}
        autoHideDuration={3000}
        onClose={() => setSnackbar(false)}
      >
        <Alert severity="success" variant="filled">
          Profile updated successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
}

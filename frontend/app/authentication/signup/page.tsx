/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import "./SignUp.css";

import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
  Divider,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
  Snackbar,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { FcGoogle } from "react-icons/fc";
import MicrosoftIcon from "@mui/icons-material/Window";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/firebase/firebase";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/utils/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerUser, socialLogin } from "@/redux/authentication/auth.slice";

// OLD COOKIE IMPORT
// import { getCookie, setCookie } from "cookies-next";

const RegisterUserSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .refine((val) => !val.includes(" "), {
      message: "Password must not contain spaces",
    }),
});

type RegisterFormData = z.infer<typeof RegisterUserSchema>;

export default function LinkedInSignupPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
  });

  const showSnackbar = (message: string) =>
    setSnackbar({ open: true, message });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterUserSchema),
    mode: "onChange",
  });

  const handleRegister = async (data: RegisterFormData) => {
    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );

      const backendRes = await dispatch(
        registerUser({
          email: data.email,
          password: data.password,
        }),
      ).unwrap();

      console.log(backendRes);

      // OLD TOKEN STORAGE
      /*
      localStorage.removeItem("token");
      localStorage.setItem("token", backendRes.accessToken);

      setCookie("user_data", backendRes.accessToken, {
        maxAge: 60 * 60 * 24 * 1,
        path: "/",
      });

      const tokenInCokkie = getCookie("user_data");
      console.log(tokenInCokkie?.toString());
      */

      showSnackbar("Registration successful");

      setTimeout(() => router.push("/profile/completeProfile"), 800);
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        showSnackbar("Email already registered");
      } else {
        showSnackbar("Registration failed");
      }
    }
  };

  const handleGoogleSignin = async () => {
    try {
      const res = await signInWithPopup(auth, provider);

      const backendRes = await dispatch(
        socialLogin({
          email: res.user.email,
        }),
      ).unwrap();

      console.log(backendRes);

      // OLD TOKEN STORAGE
      /*
      localStorage.removeItem("token");
      localStorage.setItem("token", backendRes.accessToken);

      setCookie("user_data", backendRes.accessToken, {
        maxAge: 60 * 60 * 24 * 1,
        path: "/",
      });

      const tokenInCokkie = getCookie("user_data");
      console.log(tokenInCokkie?.toString());
      */

      showSnackbar("Registration successful");

      setTimeout(() => router.push("/profile/completeProfile"), 800);
    } catch {
      showSnackbar("Not able to sign in with Google");
    }
  };

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <Box className="signup-page-root">
        <Box className="top-logo">
          <Typography variant="h5" fontWeight="bold" className="signup-logo">
            Linked
            <span className="signup-logo-in">in</span>
          </Typography>
        </Box>

        <Container maxWidth="xl">
          <Stack alignItems="center">
            <Typography
              className="main-title"
              variant="h4"
              sx={{ marginBottom: "3rem" }}
            >
              Make the most of your professional life
            </Typography>

            <Box className="signup-card">
              <Stack spacing={2}>
                <form onSubmit={handleSubmit(handleRegister)}>
                  <TextField
                    label="Email or phone number"
                    fullWidth
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />

                  <Box sx={{ marginTop: "1.5rem" }}>
                    <FormControl fullWidth error={!!errors.password}>
                      <InputLabel>Password</InputLabel>
                      <OutlinedInput
                        type={showPassword ? "text" : "password"}
                        {...register("password")}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword((p) => !p)}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                      <FormHelperText>
                        {errors.password?.message}
                      </FormHelperText>
                    </FormControl>
                  </Box>

                  <FormControlLabel
                    sx={{ marginTop: "1rem" }}
                    control={<Checkbox defaultChecked />}
                    label="Remember me"
                  />

                  <Typography className="terms-text" sx={{ marginTop: "1rem" }}>
                    By clicking Agree & Join or Continue, you agree to the
                    LinkedIn
                    <span className="blue-link"> User Agreement</span>,
                    <span className="blue-link"> Privacy Policy</span>, and
                    <span className="blue-link"> Cookie Policy</span>.
                  </Typography>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    className="signup-btn"
                    sx={{ marginTop: "1.5rem" }}
                  >
                    Agree & Join
                  </Button>
                </form>

                <Divider>or</Divider>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<FcGoogle />}
                  className="social-btn"
                  onClick={handleGoogleSignin}
                >
                  Continue with Google
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<MicrosoftIcon />}
                  className="social-btn"
                >
                  Continue with Microsoft
                </Button>

                <Typography className="signin-text">
                  Already on LinkedIn?
                  <span
                    className="blue-link"
                    onClick={() => {
                      router.push("/authentication/login");
                    }}
                  >
                    {" "}
                    Sign in
                  </span>
                </Typography>
              </Stack>
            </Box>

            <Typography className="help-text" sx={{ marginTop: "2rem" }}>
              Looking to create a page for a business?
              <span className="blue-link"> Get help</span>
            </Typography>
          </Stack>
        </Container>

        <Box className="footer">
          LinkedIn © 2026 · About · Accessibility · User Agreement · Privacy
          Policy · Cookie Policy · Copyright Policy · Brand Policy · Guest
          Controls · Community Guidelines · Language
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={snackbar.message}
      />
    </>
  );
}
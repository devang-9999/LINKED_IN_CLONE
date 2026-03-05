import { Button, Avatar, Typography, Box } from "@mui/material";

interface ProfileHeaderProps {
  firstName?: string;
  lastName?: string;
  headline?: string;
  about?: string;
  profilePicture?: string;
  coverPicture?: string;
  onAddSection: () => void;
}

export default function ProfileHeader({
  firstName,
  lastName,
  headline,
  about,
  profilePicture,
  coverPicture,
  onAddSection,
}: ProfileHeaderProps) {
  const fullName = `${firstName ?? ""} ${lastName ?? ""}`.trim();

  return (
    <div className="profile-header">
      <div
        className="cover"
        style={{
          backgroundImage: coverPicture ? `url(${coverPicture})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="profile-info">
        <Avatar
          src={profilePicture}
          sx={{
            width: 120,
            height: 120,
            border: "4px solid white",
            marginTop: "-60px",
            backgroundColor: "#1976d2",
            fontSize: "40px",
          }}
        >
          {!profilePicture && fullName
            ? fullName.charAt(0).toUpperCase()
            : ""}
        </Avatar>

        {/* Name */}
        <Typography variant="h5" fontWeight={600}>
          {fullName || "Your Name"}
        </Typography>

        {/* Headline */}
        {headline && (
          <Typography
            variant="body1"
            sx={{ color: "text.secondary", mt: 0.5 }}
          >
            {headline}
          </Typography>
        )}

        {/* About */}
        {about && (
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              mt: 1,
              maxWidth: 600,
            }}
          >
            {about}
          </Typography>
        )}

        {/* Buttons */}
        <Box className="profile-actions" sx={{ mt: 2 }}>
          <Button variant="contained">Open to</Button>

          <Button variant="outlined" onClick={onAddSection}>
            Add profile section
          </Button>
        </Box>
      </div>
    </div>
  );
}         
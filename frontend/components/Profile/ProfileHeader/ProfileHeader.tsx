import { Button, Avatar } from "@mui/material";

interface ProfileHeaderProps {
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  coverPicture?: string;
  onAddSection: () => void;
}

export default function ProfileHeader({
  firstName,
  lastName,
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

        <h2>{fullName || "Your Name"}</h2>

        <div className="profile-actions">
          <Button variant="contained">Open to</Button>

          <Button variant="outlined" onClick={onAddSection}>
            Add profile section
          </Button>
        </div>

      </div>
    </div>
  );
}
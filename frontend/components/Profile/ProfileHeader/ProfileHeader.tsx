/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@mui/material";

export default function ProfileHeader({ onAddSection }: any) {
  return (
    <div className="profile-header">

      <div className="cover"></div>

      <div className="profile-info">
        <div className="avatar"></div>

        <h2>Devang Tripathi</h2>
        <p>Student at CCET</p>

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
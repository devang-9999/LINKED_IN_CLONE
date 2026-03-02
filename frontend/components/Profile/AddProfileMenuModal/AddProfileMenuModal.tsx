/* eslint-disable @typescript-eslint/no-explicit-any */
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function AddProfileMenuModal({
  onClose,
  onAddEducation,
  onAddExperience,
  onAddSkills,
}: any) {
  return (
    <div className="modal-wrapper">

      <div className="add-profile-modal">

        <div className="modal-header">
          <h3>Add to profile</h3>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>

        <h4>Core</h4>

        <div className="menu-item" onClick={onAddEducation}>
          Add education
        </div>

        <div className="menu-item" onClick={onAddExperience}>
          Add position
        </div>

        <div className="menu-item" onClick={onAddSkills}>
          Add skills
        </div>

      </div>
    </div>
  );
}
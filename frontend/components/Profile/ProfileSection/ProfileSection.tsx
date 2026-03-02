/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import AddIcon from "@mui/icons-material/Add";

export default function ProfileSections({
  onAddEducation,
  onAddExperience,
  onAddSkills,
}: any) {
  return (
    <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>

      <Paper
        elevation={0}
        sx={{
          border: "2px dashed #b6d4fe",
          backgroundColor: "#f8fbff",
          borderRadius: 3,
          p: 3,
          position: "relative",
        }}
      >
        <IconButton
          size="small"
          sx={{ position: "absolute", top: 10, right: 10 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        <Typography variant="h6" fontWeight={600}>
          Experience
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", mt: 0.5, mb: 2 }}
        >
          Showcase your accomplishments and get up to 2X as many
          profile views and connections
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              backgroundColor: "#eaeaea",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <WorkOutlineIcon color="disabled" />
          </Box>

          <Box>
            <Typography fontWeight={500}>Job Title</Typography>
            <Typography variant="body2" color="text.secondary">
              Organization
            </Typography>
            <Typography variant="body2" color="text.secondary">
              2023 – present
            </Typography>
          </Box>
        </Box>

        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={onAddExperience}
          sx={{
            mt: 2,
            borderRadius: "20px",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Add experience
        </Button>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          border: "1px solid #e0e0e0",
          borderRadius: 3,
          p: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Education
          </Typography>

          <Box>
            <IconButton size="small">
              <AddIcon />
            </IconButton>
          </Box>
        </Box>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", mt: 0.5 }}
        >
          Add your academic background to highlight your qualifications.
        </Typography>

        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={onAddEducation}
          sx={{
            mt: 2,
            borderRadius: "20px",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Add education
        </Button>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          border: "2px dashed #b6d4fe",
          backgroundColor: "#f8fbff",
          borderRadius: 3,
          p: 3,
          position: "relative",
        }}
      >
        <IconButton
          size="small"
          sx={{ position: "absolute", top: 10, right: 10 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        <Typography variant="h6" fontWeight={600}>
          Skills
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", mt: 0.5, mb: 2 }}
        >
          Communicate your fit for new opportunities – 50% of hirers
          use skills data to fill their roles
        </Typography>

        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={onAddSkills}
          sx={{
            borderRadius: "20px",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Add skills
        </Button>
      </Paper>

    </Box>
  );
}
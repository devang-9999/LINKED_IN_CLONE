/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
  Chip,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import AddIcon from "@mui/icons-material/Add";

export default function ProfileSections({
  education,
  experience,
  skills,
  onAddEducation,
  onAddExperience,
  onAddSkills,
}: any) {
  return (
    <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>

      {experience.length === 0 ? (
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
          <IconButton size="small" sx={{ position: "absolute", top: 10, right: 10 }}>
            <CloseIcon fontSize="small" />
          </IconButton>

          <Typography variant="h6" fontWeight={600}>
            Experience
          </Typography>

          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5, mb: 2 }}>
            Showcase your accomplishments and get up to 2X as many
            profile views and connections
          </Typography>

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
      ) : (
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
              Experience
            </Typography>

            <IconButton onClick={onAddExperience}>
              <AddIcon />
            </IconButton>
          </Box>

          {experience.map((exp: any) => (
            <Box
              key={exp.id}
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 2,
                mt: 2,
              }}
            >
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
                <Typography fontWeight={600}>{exp.title}</Typography>

                <Typography variant="body2" color="text.secondary">
                  {exp.companyName}
                </Typography>

                {exp.employmentType && (
                  <Typography variant="body2" color="text.secondary">
                    {exp.employmentType}
                  </Typography>
                )}

                {exp.location && (
                  <Typography variant="body2" color="text.secondary">
                    📍 {exp.location}
                  </Typography>
                )}

                <Typography variant="body2" color="text.secondary">
                  {new Date(exp.startDate).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  –{" "}
                  {exp.currentlyWorking
                    ? "Present"
                    : exp.endDate
                    ? new Date(exp.endDate).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })
                    : ""}
                </Typography>

                {exp.description && (
                  <Typography
                    variant="body2"
                    sx={{ mt: 1, color: "text.secondary", maxWidth: 500 }}
                  >
                    {exp.description}
                  </Typography>
                )}
              </Box>
            </Box>
          ))}
        </Paper>
      )}

      {/* ================= EDUCATION ================= */}

      {education.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: 3,
            p: 3,
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Education
          </Typography>

          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
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
      ) : (
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

            <IconButton onClick={onAddEducation}>
              <AddIcon />
            </IconButton>
          </Box>

          {education.map((edu: any) => (
            <Box key={edu.id} sx={{ mt: 2 }}>
              <Typography fontWeight={600}>{edu.schoolName}</Typography>

              {edu.degree && (
                <Typography variant="body2" color="text.secondary">
                  {edu.degree}
                </Typography>
              )}

              {edu.fieldOfStudy && (
                <Typography variant="body2" color="text.secondary">
                  {edu.fieldOfStudy}
                </Typography>
              )}

              <Typography variant="body2" color="text.secondary">
                {edu.startDate ? new Date(edu.startDate).getFullYear() : ""} –{" "}
                {edu.endDate ? new Date(edu.endDate).getFullYear() : ""}
              </Typography>
            </Box>
          ))}
        </Paper>
      )}

      {/* ================= SKILLS ================= */}

      {skills.length === 0 ? (
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
          <IconButton size="small" sx={{ position: "absolute", top: 10, right: 10 }}>
            <CloseIcon fontSize="small" />
          </IconButton>

          <Typography variant="h6" fontWeight={600}>
            Skills
          </Typography>

          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5, mb: 2 }}>
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
      ) : (
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
              Skills
            </Typography>

            <IconButton onClick={onAddSkills}>
              <AddIcon />
            </IconButton>
          </Box>

          <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
            {skills.map((skill: any) => (
              <Chip key={skill.id} label={skill.name} />
            ))}
          </Box>
        </Paper>
      )}

    </Box>
  );
}
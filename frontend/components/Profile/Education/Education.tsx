/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  MenuItem,
  Paper,
} from "@mui/material";

import "./Education.css";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const years = Array.from({ length: 60 }, (_, i) => 1970 + i);

interface Props {
  onClose?: () => void;
  onSuccess?: () => void;
}

export default function EducationForm({ onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    schoolName: "",
    degree: "",
    fieldOfStudy: "",
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const formatDate = (month: string, year: string) => {
    if (!month || !year) return undefined;
    const monthIndex = months.indexOf(month);
    const date = new Date(Number(year), monthIndex, 1);
    return date.toISOString().split("T")[0]; // yyyy-mm-dd
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const payload = {
        schoolName: form.schoolName,
        degree: form.degree || undefined,
        fieldOfStudy: form.fieldOfStudy || undefined,
        startDate: formatDate(form.startMonth, form.startYear),
        endDate: formatDate(form.endMonth, form.endYear),
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/education`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to save education");
      }

      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="edu-overlay">
      <Paper className="edu-modal">
        <Typography variant="h6" className="edu-title">
          Add education
        </Typography>

        <Typography className="edu-required">* Indicates required</Typography>

        <TextField
          label="School*"
          name="schoolName"
          fullWidth
          margin="normal"
          value={form.schoolName}
          onChange={handleChange}
          required
        />

        <TextField
          label="Degree"
          name="degree"
          fullWidth
          margin="normal"
          value={form.degree}
          onChange={handleChange}
        />

        <TextField
          label="Field of study"
          name="fieldOfStudy"
          fullWidth
          margin="normal"
          value={form.fieldOfStudy}
          onChange={handleChange}
        />

        <Typography className="edu-section">Start date</Typography>

        <Box className="edu-row">
          <TextField
            select
            label="Month"
            name="startMonth"
            value={form.startMonth}
            onChange={handleChange}
            fullWidth
            SelectProps={{
              MenuProps: {
                disablePortal: true,
              },
            }}
          >
            {months.map((month) => (
              <MenuItem key={month} value={month}>
                {month}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Year"
            name="startYear"
            value={form.startYear}
            onChange={handleChange}
            fullWidth
            SelectProps={{
              MenuProps: {
                disablePortal: true,
              },
            }}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Typography className="edu-section">End date (or expected)</Typography>

        <Box className="edu-row">
          <TextField
            select
            label="Month"
            name="endMonth"
            value={form.endMonth}
            onChange={handleChange}
            fullWidth
            SelectProps={{
              MenuProps: {
                disablePortal: true,
              },
            }}
          >
            {months.map((month) => (
              <MenuItem key={month} value={month}>
                {month}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Year"
            name="endYear"
            value={form.endYear}
            onChange={handleChange}
            fullWidth
            SelectProps={{
              MenuProps: {
                disablePortal: true,
              },
            }}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box className="edu-actions">
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!form.schoolName || loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>

          <Button onClick={onClose}>Cancel</Button>
        </Box>
      </Paper>
    </Box>
  );
}

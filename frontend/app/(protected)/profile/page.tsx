/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

import ProfileHeader from "@/components/Profile/ProfileHeader/ProfileHeader";
import ProfileSections from "@/components/Profile/ProfileSection/ProfileSection";
import AddProfileMenuModal from "@/components/Profile/AddProfileMenuModal/AddProfileMenuModal";
import EducationForm from "@/components/Profile/Education/Education";
import ExperienceForm from "@/components/Profile/Experience/Experience";
import SkillsForm from "@/components/Profile/Skills/Skills";
import LinkedInNavbar from "@/components/Navbar/Navbar";
import CompleteProfilePage from "./completeProfile/page";

interface UserProfile {
  firstName?: string;
  lastName?: string;
  headline?: string;
  about?: string;
  profilePicture?: string;
  coverPicture?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [openUpdateProfile, setOpenUpdateProfile] = useState(false);
  const [education, setEducation] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [openMenu, setOpenMenu] = useState(false);
  const [openEducation, setOpenEducation] = useState(false);
  const [openExperience, setOpenExperience] = useState(false);
  const [openSkills, setOpenSkills] = useState(false);

  const isModalOpen =
    openMenu ||
    openEducation ||
    openExperience ||
    openSkills ||
    openUpdateProfile;

  /*
  OLD TOKEN METHOD (REMOVED)
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  */

  useEffect(() => {
    const fetchData = async () => {
      try {
        /*
        OLD HEADERS METHOD
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        */

        const axiosConfig = {
          withCredentials: true,
        };

        const [profileRes, eduRes, expRes, skillRes] = await Promise.all([
          axios.get("http://localhost:5000/users/me", axiosConfig),
          axios.get("http://localhost:5000/education", axiosConfig),
          axios.get("http://localhost:5000/experience", axiosConfig),
          axios.get("http://localhost:5000/skills", axiosConfig),
        ]);

        setProfile(profileRes.data);
        setEducation(eduRes.data || []);
        setExperience(expRes.data || []);
        setSkills(skillRes.data || []);
      } catch (error) {
        console.error("Profile fetch failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const backendUrl = "http://localhost:5000/uploads/";

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  return (
    <>
      {!isModalOpen && <LinkedInNavbar />}

      <div className={`profile-container ${isModalOpen ? "page-blur" : ""}`}>
        <ProfileHeader
          firstName={profile?.firstName}
          lastName={profile?.lastName}
          headline={profile?.headline}
          about={profile?.about}
          profilePicture={
            profile?.profilePicture
              ? backendUrl + profile.profilePicture
              : undefined
          }
          coverPicture={
            profile?.coverPicture
              ? backendUrl + profile.coverPicture
              : undefined
          }
          onAddSection={() => setOpenMenu(true)}
        />

        <ProfileSections
          education={education}
          experience={experience}
          skills={skills}
          onAddEducation={() => setOpenEducation(true)}
          onAddExperience={() => setOpenExperience(true)}
          onAddSkills={() => setOpenSkills(true)}
        />
      </div>

      {openMenu && (
        <div className="modal-wrapper" onClick={() => setOpenMenu(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <AddProfileMenuModal
              onClose={() => setOpenMenu(false)}
              onAddEducation={() => {
                setOpenMenu(false);
                setOpenEducation(true);
              }}
              onAddExperience={() => {
                setOpenMenu(false);
                setOpenExperience(true);
              }}
              onAddSkills={() => {
                setOpenMenu(false);
                setOpenSkills(true);
              }}
              onUpdateProfile={() => {
                setOpenMenu(false);
                setOpenUpdateProfile(true);
              }}
            />
          </div>
        </div>
      )}

      {openEducation && (
        <div className="modal-wrapper" onClick={() => setOpenEducation(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <EducationForm onClose={() => setOpenEducation(false)} />
          </div>
        </div>
      )}

      {openExperience && (
        <div className="modal-wrapper" onClick={() => setOpenExperience(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <ExperienceForm onClose={() => setOpenExperience(false)} />
          </div>
        </div>
      )}

      {openSkills && (
        <div className="modal-wrapper" onClick={() => setOpenSkills(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <SkillsForm onClose={() => setOpenSkills(false)} />
          </div>
        </div>
      )}

      {openUpdateProfile && (
        <div
          className="modal-wrapper"
          onClick={() => setOpenUpdateProfile(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <CompleteProfilePage onClose={() => setOpenUpdateProfile(false)} />
          </div>
        </div>
      )}
    </>
  );
}
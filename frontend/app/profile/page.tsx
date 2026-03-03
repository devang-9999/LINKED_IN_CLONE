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

interface UserProfile {
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  coverPicture?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [openMenu, setOpenMenu] = useState(false);
  const [openEducation, setOpenEducation] = useState(false);
  const [openExperience, setOpenExperience] = useState(false);
  const [openSkills, setOpenSkills] = useState(false);

  const isModalOpen =
    openMenu || openEducation || openExperience || openSkills;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/users/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProfile(res.data);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };

    fetchProfile();
  }, []);

  const backendUrl = "http://localhost:5000/uploads/";

  return (
    <>
      {!isModalOpen && <LinkedInNavbar />}

      <div className={`profile-container ${isModalOpen ? "page-blur" : ""}`}>

        <ProfileHeader
          firstName={profile?.firstName}
          lastName={profile?.lastName}
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
            />
          </div>
        </div>
      )}

      {openEducation && (
        <div className="modal-wrapper" onClick={() => setOpenEducation(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <EducationForm />
          </div>
        </div>
      )}

      {openExperience && (
        <div className="modal-wrapper" onClick={() => setOpenExperience(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <ExperienceForm />
          </div>
        </div>
      )}

      {openSkills && (
        <div className="modal-wrapper" onClick={() => setOpenSkills(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <SkillsForm />
          </div>
        </div>
      )}
    </>
  );
}
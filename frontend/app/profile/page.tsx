"use client";

import { useState } from "react";
import "./Profile.css";

import ProfileHeader from "@/components/Profile/ProfileHeader/ProfileHeader";
import ProfileSections from "@/components/Profile/ProfileSection/ProfileSection";
import AddProfileMenuModal from "@/components/Profile/AddProfileMenuModal/AddProfileMenuModal";
import EducationForm from "@/components/Profile/Education/Education";
import ExperienceForm from "@/components/Profile/Experience/Experience";
import SkillsForm from "@/components/Profile/Skills/Skills";
import LinkedInNavbar from "@/components/Navbar/Navbar";

export default function ProfilePage() {
  const [openMenu, setOpenMenu] = useState(false);
  const [openEducation, setOpenEducation] = useState(false);
  const [openExperience, setOpenExperience] = useState(false);
  const [openSkills, setOpenSkills] = useState(false);

  const isModalOpen =
    openMenu || openEducation || openExperience || openSkills;

  return (
    <>
      {!isModalOpen && <LinkedInNavbar />}

      <div className={`profile-container ${isModalOpen ? "page-blur" : ""}`}>

        <ProfileHeader onAddSection={() => setOpenMenu(true)} />

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
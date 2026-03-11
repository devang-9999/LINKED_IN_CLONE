"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import NetworkLeftSidebar from "../../../components/MyNetworks/LeftSideBar/LeftSideBar";
import InviteConnectionsCard from "../../../components/MyNetworks/InviteConnectionCard/Card";
import SuggestionCard from "../../../components/MyNetworks/SuggestionCard/SuggestionCard";
import LinkedInNavbar from "@/components/Navbar/Navbar";

import "./Networks.css";

export default function MyNetworkPage() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = "http://localhost:5000";

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const res = await axios.get(
        `${API}/users`,
        { withCredentials: true }
      );

      setUsers(res.data);

    } catch (error) {
      console.error("Failed to load suggestions", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="network-loading">Loading network...</div>;
  }

  return (
    <div className="my-network-wrapper">

      <LinkedInNavbar />

      <div className="my-network-container">

        {/* LEFT SIDEBAR */}
        <aside className="left-column">
          <NetworkLeftSidebar />
        </aside>


        {/* MAIN CONTENT */}
        <main className="main-column">

          <InviteConnectionsCard />

          <div className="suggestion-section">

            <div className="suggestion-header">
              <h3>People you may know</h3>
              <span className="show-all">Show all</span>
            </div>

            <div className="suggestion-grid">

              {users.length === 0 ? (
                <div className="no-users">
                  No suggestions available
                </div>
              ) : (
                users.map((user) => (
                  <SuggestionCard
                    key={user.id}
                    user={user}
                  />
                ))
              )}

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}
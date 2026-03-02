"use client";

import NetworkLeftSidebar from "../../components/MyNetworks/LeftSideBar/LeftSideBar";
import "./Networks.css";
import InviteConnectionsCard from "../../components/MyNetworks/InviteConnectionCard/Card";
import LinkedInNavbar from "@/components/Navbar/Navbar";
import SuggestionCard from "../../components/MyNetworks/SuggestionCard/SuggestionCard";

export default function MyNetworkPage() {
  return (
    <div className="my-network-wrapper">
      <LinkedInNavbar />

      <div className="my-network-container">

        <aside className="left-column">
          <NetworkLeftSidebar />
        </aside>

        <main className="main-column">

          <InviteConnectionsCard />

          <div className="suggestion-section">

            <div className="suggestion-header">
              <h3>
                People skilled in Procedural Programming also follow these people
              </h3>
              <span className="show-all">Show all</span>
            </div>

            <div className="suggestion-grid">
              <SuggestionCard />
              <SuggestionCard />
              <SuggestionCard />
              <SuggestionCard />
              <SuggestionCard />
              <SuggestionCard />
            </div>

          </div>

        </main>

      </div>
    </div>
  );
}
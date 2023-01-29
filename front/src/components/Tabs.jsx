import React, { useState } from "react";
import "../styles/tabs.css";
import "../styles/social.css";
import ProfileCard from "../components/ProfileCard";
import FriendList from "./FriendList";

export default function Tabs() {
  const [ToggleState, setToggleState] = useState(1);

  const toggleTab = (index) => {
    setToggleState(index);
  };

  const getActiveClass = (index, className) =>
    ToggleState === index ? className : "";

  return (
    <div className="container-tabs">
      <div className="container-shiny">
        <ul className="tab-list">
          <li
            className={`tabs ${getActiveClass(1, "active-tabs")}`}
            onClick={() => toggleTab(1)}
          >
            Profile
          </li>
          <li
            className={`tabs ${getActiveClass(2, "active-tabs")}`}
            onClick={() => toggleTab(2)}
          >
            Friend List
          </li>
        </ul>
        <div className="">
          {ToggleState === 1 && (
            <div className="active-content">
              <ProfileCard />
            </div>
          )}
          {ToggleState === 2 && (
            <div className="active-content">
              <FriendList />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

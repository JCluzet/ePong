import React, {useState} from 'react';
import "../styles/tabs.css"
import "../styles/social.css"
import ProfileCard from "../components/ProfileCard";
import FriendList from './FriendList';
import Chat from '../pages/Chat';

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
            <li
            className={`tabs ${getActiveClass(3, "active-tabs")}`}
            onClick={() => toggleTab(3)}
            >
            Chat
            </li>
        </ul>
        <div className="content-container">
            <div className={`content ${getActiveClass(1, "active-content")}`}>
                <ProfileCard/>
            </div>
            <div className={`content ${getActiveClass(2, "active-content")}`}>
                <FriendList/>
            </div>
            <div className={`content ${getActiveClass(3, "active-content")}`}>
                <Chat/>
            </div>
        </div>
        </div>
    </div>
  );
};

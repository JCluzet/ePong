import React from "react";
import { accountService } from "../hooks/account_service";
import "../styles/social.css";
import Statscard from "./StatsCard";
import Historic from "./HistoricCard";
import FriendList from "./FriendList";

// faire un composent "carte profile" avec login, si en ligne, image de login

const user = {
  name: accountService.userLogin(),
  imgUrl: accountService.userAvatarUrl(),
  size: 100,
};

export default function ProfileCard() {
  return (
    <div className="container">
      <div className="container-social">
        <section className="container-profilCard-info">
          <div className="column-stats1">
            <div>

            <img
              src={user.imgUrl}
              alt={"profile picture"}
              className="profile-image-social"
              />
            {/* <div className="login-text-social">{user.name}</div> */}
              </div>
            <Statscard />
          </div>
        </section>

        <section className="container-profilCard">
          <Historic />
          </section>
        <section className="container-profilCard">
      <FriendList/>
        </section>

      </div>
    </div>
  );
}

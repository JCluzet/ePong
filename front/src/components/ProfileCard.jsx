import React from "react";
import { accountService } from "../hooks/account_service";
import "../styles/social.css";
import Statscard from "./StatsCard";
import Historic from "./HistoricCard";

const user = {
  name: accountService.userName(),
  imgUrl: accountService.userAvatarUrl(),
};

export default function ProfileCard() {
  return (
    <div className="container-global">
      <section className="">
        <div className="row">
          <div className="column-stats1">
            <img
              src={user.imgUrl}
              alt="userimage"
              style={{ height: 100, width: 100 }}
              className="circle-img"
            />
            <h1>{user.name}</h1>
            <Statscard />
          </div>
          <div className="column-stats2">
            <Historic />
          </div>
        </div>
      </section>
    </div>
  );
}

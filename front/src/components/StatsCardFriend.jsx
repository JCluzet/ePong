import axios from "axios";
import React, { useEffect, useState } from "react";
import { accountService } from "../hooks/account_service";

export default function StatsCardFriend() {
  const [friend, setFriend] = useState({});
  useEffect(() => {
    var config = {
      method: "get",
      url: "/users/public/" + accountService.friendName(),
      headers: { Authorization: "Bearer " + accountService.userToken() },
    };
    axios(config).then((response) => setFriend(response.data));
  }, []);
  return (
    <div>
      <h2> Stats </h2>
      <ul>
        <p>winrate : {friend.kda} %</p>
        <p>Nb Wins :</p>
        <p style={{ color: "green" }}>{friend.nbWins}</p>
        <p>Nb Loses : </p>
        <p style={{ color: "red" }}>{friend.nbLoses}</p>
        <p>total game : {friend.totalGame}</p>
      </ul>
    </div>
  );
}

import React, { useEffect } from "react";
import "../styles/historic.css";
import "../styles/social.css";
import { useState } from "react";
import { accountService } from "../hooks/account_service";
import axios from "axios";

const games = [{
  player1 : "bmaudet",
  player2 : "malick"
},{
  player1 : "bmaudet",
  player2 : "malick"
},{
  player1 : "bmaudet",
  player2 : "malick"
},{
  player1 : "bmaudet",
  player2 : "malick"
}]
    




export default function SpectateList() {
    const [historic, setHistoric] = useState([]);
  
    useEffect(() => {
      var config = {
        method: "get",
        url: "/game-history/history/" + accountService.userLogin(),
        headers: { Authorization: "Bearer " + accountService.userToken() },
      };
      axios(config).then((response) => setHistoric(response.data));
    }, []);
  
    const [isToggled, setIsToggled] = useState(false);
  
    const onToggle = () => setIsToggled(!isToggled);
    return (
      <div className="main">
        <div className="text-title-container">Current Matches</div>
        {games.map((element) => {
          return (
            <dir>
              <div className="container-shiny" onClick={onToggle}>
                {isToggled ? (window.location.href = "/spectate?login=" + element.player1)
                :
                <div className="row">
                  <div className="column-profile">
                    {element.player1}
                  </div>
                  <div className="column-profile">
                    {element.player2}
                  </div>
                </div>
                }
              </div>
            </dir>
          );
        })}
      </div>
    );
  }
  
import React from "react";
import { accountService } from "../hooks/account_service";

export default function StatsCard() {
  const [kda, setKda] = React.useState(accountService.userKda());
  const [nbWins, setNbWins] = React.useState(accountService.userNbWins());
  const [nbLoses, setNbLoses] = React.useState(accountService.userNbLoses());
  const [totalGame, setTotalGame] = React.useState(
    accountService.userTotalGame()
  );
  if (!kda) setKda("0");
  if (!nbLoses) setNbLoses("0");
  if (!nbWins) setNbWins("0");
  if (!totalGame) setTotalGame("0");
  return (
    <div>
      <div className="container-stats">
        <div className="container-stats-content">
          <div className="stat-uniq">
            Winrate
            <div className="stat-uniq-number">{kda} %</div>
          </div>
          <div className="stat-uniq">
            Nb Wins
            <div className="stat-uniq-number" style={{ color: "green" }}>
              {nbWins}
            </div>
          </div>
          <div className="stat-uniq">
            Nb Loses
            <div className="stat-uniq-number" style={{ color: "red" }}>
              {nbLoses}
            </div>
          </div>
          <div className="stat-uniq">
            Total Game
            <div className="stat-uniq-number">{totalGame}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

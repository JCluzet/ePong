import React from 'react';
import { accountService } from "../hooks/account_service";

export default function StatsCard() {
    const [kda, setKda] = React.useState(accountService.userKda());
    const [nbWins, setNbWins] = React.useState(accountService.userNbWins());
    const [nbLoses, setNbLoses] = React.useState(accountService.userNbLoses());
    const [totalGame, setTotalGame]  = React.useState(accountService.userTotalGame());
    if (!kda) setKda("0");
    if (!nbLoses) setNbLoses("0");
    if (!nbWins) setNbWins("0");
    if (!totalGame) setTotalGame("0");
    return (
        <div>
            <h2> Stats </h2>
                <ul>
                    <p>winrate : {kda}</p>
                    <p>Nb Wins : {nbWins}</p>
                    <p>Nb Loses : {nbLoses}</p>
                    <p>total game : {totalGame}</p>
                </ul>
        </div>
    );
}

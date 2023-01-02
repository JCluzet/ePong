import React from "react";
import { accountService } from "../hooks/account_service";
import "../styles/social.css"
import Statscard from "./StatsCard";
import Historic from "./HistoricCard";


// faire un composent "carte profile" avec login, si en ligne, image de login

const user = {
    name: accountService.userLogin(),
    imgUrl: accountService.userAvatarUrl(),
    size: 100,
};


export default function ProfileCard() {
    return (
        <div className="container">
            {/* j'ai creer une class container-social dans le css qui contient direct tout le style */}
            <section className="container-shiny">
                // {alert(user.imgUrl)}
                <div className="row">
                    <div className="column-stats1">
                        <img src={user.imgUrl} alt={'profile picture'} style= {{height: 100 ,width: 100}}/>
                        <h1>{user.name}</h1>
                        <Statscard/>
                    </div>
                    <div className="column-stats2">
                        <Historic/>
                    </div>
                </div>
            </section>
        </div>
    )
}

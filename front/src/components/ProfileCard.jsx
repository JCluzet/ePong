import React from "react";
import { accountService } from "../hooks/account_service";
import "../styles/social.css"
import Statscard from "./StatsCard";
import Historic from "./HistoricCard";


// faire un composent "carte profile" avec login, si en ligne, image de login

const user = {
    name: accountService.userLogin(),
    imgUrl: "https://imgs.search.brave.com/GCunwEG5n0hqM6h_GMUWFPu0z-g9NN7qRZncZ4gPr2k/rs:fit:358:389:1/g:ce/aHR0cDovLzQuYnAu/YmxvZ3Nwb3QuY29t/L193cncxTUdjVWVT/QS9UT2x2VmhmVEdY/SS9BQUFBQUFBQUFD/Yy9rajQwOEdQcV9s/MC9zMTYwMC9NYXJp/byUyQjIwMDguanBn",
    size: 100,
};


export default function ProfileCard() {
    return (
        <div className="container">
            {/* j'ai creer une class container-social dans le css qui contient direct tout le style */}
            <section className="container-shiny">
                <div className="row">
                    <div className="column-stats">
                        <img src={user.imgUrl} alt={'profile picture'} style= {{height: 100 ,width: 100}}/>
                        <h1>{user.name}</h1>
                        <Statscard/>
                    </div>
                    <div className="column-stats">
                        <Historic/>
                    </div>
                </div>
            </section>
        </div>
    )
}
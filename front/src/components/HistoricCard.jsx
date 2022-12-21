import React from "react";
import "../styles/historic.css"
import "../styles/social.css"
import {useEffect, useState} from 'react';
import Trophy from "../assets/images/trophy.png";
import Modal from "./HistoricModal";


const historic = [
    {
        playerOne: "malick",
        playerTwo: "wane",
        scoreP1: 10,
        scoreP2: 6,
        date: "12/12/22",
        winner: true
    },
    {
        playerOne: "malick",
        playerTwo: "mathias",
        scoreP1: 10,
        scoreP2: 7,
        date: "12/12/22",
        winner: true
    },
    {
        playerOne: "malick",
        playerTwo: "antoine",
        scoreP1: 7,
        scoreP2: 10,
        date: "12/12/22",
        winner: false
    },
    {
        playerOne: "malick",
        playerTwo: "baidy",
        scoreP1: 4,
        scoreP2: 10,
        date: "12/12/22",
        winner: false
    },{
        playerOne: "malick",
        playerTwo: "wane",
        scoreP1: 10,
        scoreP2: 6,
        date: "12/12/22",
        winner: true
    },
    {
        playerOne: "malick",
        playerTwo: "mathias",
        scoreP1: 10,
        scoreP2: 7,
        date: "12/12/22",
        winner: true
    },
    {
        playerOne: "malick",
        playerTwo: "antoine",
        scoreP1: 7,
        scoreP2: 10,
        date: "12/12/22",
        winner: false
    },
    {
        playerOne: "malick",
        playerTwo: "baidy",
        scoreP1: 4,
        scoreP2: 10,
        date: "12/12/22",
        winner: false
    }
]

export default function Historic() {
    const [isToggled, setIsToggled] = useState(false);

    const onToggle = () => setIsToggled(!isToggled);
    return (
        <div className="main">
            {historic.map(({playerOne, playerTwo, scoreP1, scoreP2, date, winner}) => {
                return (
                    <dir>
                        <div className="container-shiny" onClick={onToggle}>
                            <div className="row">
                                <div className="column-profile">
                                {winner ?
                                        <div >
                                        <p>{playerOne}</p>
                                    <div className="winnerp1">
                                        <p>{scoreP1}</p>
                                        </div>
                                        <img src={Trophy} alt="pict" className="imagep1" />
                                        </div>
                                        :
                                        <div>
                                        <p>{playerOne}</p>
                                        <div className="loserp1">
                                        <p>{scoreP1}</p>
                                        </div> 
                                        </div> 
                                        }
                                    </div>
                                    <div className="column-profile">
                                    {winner ?
                                        <div>
                                            <p>{playerTwo}</p>
                                        <div className="loserp2">
                                            <p>{scoreP2}</p>
                                        </div>
                                        </div>
                                        :
                                        <div>
                                            <p>{playerTwo}</p>
                                        <div className="winnerp2">
                                            <p>{scoreP2}</p>
                                        </div>
                                        <img src={Trophy} alt="pict" className="imagep2" />
                                        </div>
                                    }
                                    </div>
                                </div>
                            <div className="date">
                                {date}
                            </div>
                            <Modal show={isToggled} onClose={onToggle}>
                                
                                
                            </Modal>
                            </div>
                        </dir>
                    );
                })}
        </div>
    )
}
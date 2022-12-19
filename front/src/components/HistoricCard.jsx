import React from "react";
import "../styles/historic.css"

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
    return (
        <div className="main">
            {historic.map(({playerOne, playerTwo, scoreP1, scoreP2, date, winner}) => {
                return (
                    <div className="row">
                            <div className="column-profile">
                               {winner ? 
                                <div className="winner">
                                    <p>{playerOne}</p>
                                    <p>{scoreP1}</p>
                                    </div> 
                                    : 
                                    <div className="loser">
                                    <p>{playerOne}</p>
                                    <p>{scoreP1}</p>
                                    </div> 
                                    }
                                </div>
                                <div className="column-profile">
                                {winner ? 
                                    <div className="loser">
                                        <p>{playerTwo}</p>
                                        <p>{scoreP2}</p>
                                    </div> 
                                    :
                                    <div className="winner">
                                        <p>{playerTwo}</p>
                                        <p>{scoreP2}</p>
                                    </div> 
                                }
                            </div>
                            <div className="column-profile" style={{textAlign : 'center'}}>
                                {date}
                            </div>
                        </div>
                    );
                })}
        </div>
    )
}
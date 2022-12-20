import React from "react";

class StatsCard extends React.Component {
    constructor() {
        super()
        this.state = {
            totalgames: 10,
            winrate: 50,
            rank: 4,
            level: 2
        }
    }
    render ()
    {
        return (

            <div>
            <h2> Stats </h2>
                <ul>
                    <p>winrate : {this.state.winrate}</p>
                    <p>rank : {this.state.rank}</p>
                    <p>level : {this.state.level}</p>
                    <p>total game : {this.state.totalgames}</p>
                </ul>
        </div>
        )
    }
}

export default StatsCard
import React from 'react';

const BACKGROUND = 0;
const PLAYER = 1;
const BALL = 2;
export {
    BACKGROUND,
    PLAYER,
    BALL,
}

const backgroundStyle = {
    height: "50px",
    width: "50px",
    justifyContent: "center",
    backgroundColor : "black",
}
const playerStyle = {
    height: "50px",
    width: "50px",
    justifyContent: "center",
    backgroundColor : "blue",
    color: "white"
}

const ballStyle = {
    height: "50px",
    width: "50px",
    display: "block",
    backgroundColor: "yellow",
    justifyContent: "center",
    borderRadius: "100%",
    color:"white",
    zIndex: "10",
    position: 'relative'
}

const getStyle = (val) => {
    if (val === BACKGROUND) {
        return {};
    } if (val === PLAYER) {
        return playerStyle;
    } else {
        return ballStyle;
    }
}

const Box = (props) => <div style={backgroundStyle}> 
                        <div style={getStyle(props.name)} /> 
                    </div>

export default Box;
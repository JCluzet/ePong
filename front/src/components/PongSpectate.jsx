import React, { useEffect, useState } from "react";
import "../styles/Pong.scss";
import io from "socket.io-client";
import "/node_modules/react-rain-animation/lib/style.css";
import { accountService } from "../hooks/account_service";
import versusLogo from "../assets/images/versusLogo.svg";
import "semantic-ui-css/semantic.min.css";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

var joueur = accountService.userLogin();
let url_begin = "";
if (process.env.REACT_APP_IP === "" || process.env.REACT_APP_IP === undefined)
  url_begin = "http://localhost";
else url_begin = "http://".concat(process.env.REACT_APP_IP);

var socket = io(url_begin.concat(":5001/game"), { query: { login: joueur } });

export default function PongSpectate() {
  const [playerScore1, SetPlayerScore1] = useState(0);
  const [playerScore2, SetPlayerScore2] = useState(0);
  const [joueur1, setJoueur1] = useState("");
  const [joueur2, setJoueur2] = useState("");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // eslint-disable-next-line
    canvas = document.getElementById("canvas");
    initParty();
    var config = {
      method: "get",
      url: "/api/game/" + searchParams.get("login"),
      headers: { Authorization: "Bearer " + accountService.userToken() },
    };
    axios(config).then((responce) => {
      socket.emit("room", responce.data);
    });
    return () => {};
  }, []);

  socket.on("updateBall", (...args) => {
    game.ball.x = args[0].x;
    game.ball.y = args[0].y;
    game.player.y = args[1].player1;
    game.player2.y = args[1].player2;
    draw();
  });

  socket.on("scoreUpdate", (...args) => {
    if (args[0].player1.login === joueur1) {
      SetPlayerScore1(args[0].player1.score);
      SetPlayerScore2(args[0].player2.score);
    } else {
      SetPlayerScore1(args[0].player2.score);
      SetPlayerScore2(args[0].player1.score);
    }
  });

  socket.on("stopGame", (...args) => {
    document.getElementById("victoryMessage").innerHTML =
      args[0].name + " a gagné !";
    setTimeout(() => {
      window.location.href = "/";
    }, 5000);
  });

  socket.on("spectateJoin", (...args) => {
    setJoueur1(args[0].player1);
    setJoueur2(args[0].player2);
  });

  var canvas;
  var game;
  var PLAYER_HEIGHT = 80;
  var PLAYER_WIDTH = 10;

  function draw() {
    if (canvas) {
      var context = canvas.getContext("2d");
      context.fillStyle = "white";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.strokeStyle = "black";
      context.beginPath();
      context.moveTo(canvas.width / 2, 0);
      context.lineTo(canvas.width / 2, canvas.height);
      context.stroke();
      context.fillStyle = "black";
      context.fillRect(0, game.player.y, PLAYER_WIDTH, PLAYER_HEIGHT);
      context.fillRect(
        canvas.width - PLAYER_WIDTH,
        game.player2.y,
        PLAYER_WIDTH,
        PLAYER_HEIGHT
      );
      context.beginPath();
      context.fillStyle = "black";
      context.fillRect(
        game.ball.x,
        game.ball.y,
        game.ball.side,
        game.ball.side
      );
      context.fill();
    }
  }

  function initParty() {
    if (canvas) {
      game = {
        player: {
          y: canvas.height / 2 - PLAYER_HEIGHT / 2,
          score: 0,
        },
        player2: {
          y: canvas.height / 2 - PLAYER_HEIGHT / 2,
          score: 0,
        },
        ball: {
          x: canvas.width / 2 - 10 / 2,
          y: canvas.height / 2 - 10 / 2,
          side: 10,
        },
      };
    }
    draw();
  }

  window.addEventListener(
    "resize",
    function () {
      draw();
    },
    true
  );

  return (
    <>
      <div>
        <main role="main">
          <p id="victoryMessage" className="VictoryMessage"></p>
          <p id="waitingPlayer"></p>
          <div className="container-game">
            <div className="container-score">
              <div className="container-score-and-versus">
                <div className="container-score-player">
                  <div className="score_player" id="player-score">
                    {playerScore1}
                  </div>
                </div>
                <img src={versusLogo} alt="versus" className="versusLogo" />
                <div className="container-score-player">
                  <div className="score_player" id="player2-score">
                    {playerScore2}
                  </div>
                </div>
              </div>
              <div className="canvas-name-player" id="scores">
                <div className="name_player_left" id="joueur1">
                  {joueur1}
                </div>
                <div className="name_player_right" id="joueur2">
                  {joueur2}
                </div>
              </div>
            </div>
            <div className="container-canva">
              <canvas
                id="canvas"
                className="game-canva"
                width={500}
                height={400}
              ></canvas>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

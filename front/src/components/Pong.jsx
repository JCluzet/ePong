import { useEffect, useState } from "react";
import "../styles/Pong.scss";
import JSConfetti from 'js-confetti'
// import useWindowDimensions from "./useWindowDimensions";
import io from "socket.io-client";
import { Form } from "react-bootstrap";
import "/node_modules/react-rain-animation/lib/style.css";
import { toast } from "react-toastify";
import { accountService } from "../hooks/account_service";
import versusLogo from "../assets/images/versusLogo.svg";
import "semantic-ui-css/semantic.min.css";

var joueur = accountService.userName();
var login = accountService.userLogin();
const jsConfetti = new JSConfetti()
let joueur1;
let joueur2;

let url_begin = "";
if (process.env.REACT_APP_IP === "" || process.env.REACT_APP_IP === undefined)
url_begin = "http://localhost";
else url_begin = "http://".concat(process.env.REACT_APP_IP);

var socket;
if (!socket)
  socket = io(url_begin.concat(":5001/game"), { query: { login: login} });

export default function Pong() {
  const [toastid, setToastid] = useState(0);
  const [isActive, setActive] = useState(true);
  const [isActive2, setActive2] = useState(false);
  const [gameMode, setGM] = useState("classic");
	const [isSearching, setIsSearching] = useState(false);
  const [playerScore1, SetPlayerScore1] = useState(0);
  const [playerScore2, SetPlayerScore2] = useState(0);
//   const [inGame, setInGame] = useState(false);

  const queryParams = new URLSearchParams(window.location.search);
  const vs = queryParams.get("vs");
  const live = queryParams.get("live");
  let vshisto = false;
  var SearchText = "Launch Matchmaking";

  useEffect(() => {
    doVersus();
    // eslint-disable-next-line
     canvas = document.getElementById("canvas");
     initParty();
     // send playerMove just in case we actually move the mouse
     window.addEventListener("mousemove", playerMove);
    window.addEventListener("keydown", playerMoveKey);
    if (live !== null) {
      setActive(false);
      setActive2(false);
    }
    return () => {};
  }, []);

  function doVersus() {
    if (vs !== null && !vshisto) {
      setActive(false);
      socket.emit("versus", joueur + ":" + vs);
      setActive2(true);
      vshisto = true;
    }
  }

  const sendSearch = () => {
    if(joueur) {
      if(!isSearching) {
        setIsSearching(true);
        socket.emit("queue", gameMode);
        const toastid = toast.loading("Searching for a player");
        setToastid(toastid);
      }
      else {
        setIsSearching(false);
        console.log("stop search");
        socket.emit("leaveQueue");
        toast.update(toastid, {
          render: "Matchmaking cancelled",
          type: "error",
          isLoading: false,
          hideProgressBar: false,
          autoClose: 3000,
        });
      }
    }
  }

  const playerMove = (event) => {
    var canvasLocation = canvas.getBoundingClientRect();
    var mouseLocation = event.clientY - canvasLocation.y;
    if (joueur === joueur1) {
      game.player.y = mouseLocation - PLAYER_HEIGHT / 2;
      if (mouseLocation < PLAYER_HEIGHT / 2) {
        game.player.y = 0;
      } else if (mouseLocation > canvas.height - PLAYER_HEIGHT / 2) {
        game.player.y = canvas.height - PLAYER_HEIGHT;
      } else {
        game.player.y = mouseLocation - PLAYER_HEIGHT / 2;
      }
      socket.emit("cursor", game.player.y);
    } else if (joueur === joueur2) {
      game.player2.y = mouseLocation - PLAYER_HEIGHT / 2;
      if (mouseLocation < PLAYER_HEIGHT / 2) {
        game.player2.y = 0;
      } else if (mouseLocation > canvas.height - PLAYER_HEIGHT / 2) {
        game.player2.y = canvas.height - PLAYER_HEIGHT;
      } else {
        game.player2.y = mouseLocation - PLAYER_HEIGHT / 2;
      }
      socket.emit("cursor", game.player2.y);
    }
  }

  const playerMoveKey = (event) => {
    if (event.key === "ArrowUp") {
        if (joueur === joueur1) {
            game.player.y -= 5;
            if (game.player.y < 0) {
                game.player.y = 0;
            }
            socket.emit("cursor", game.player.y);
        } else if (joueur === joueur2) {
            game.player2.y -= 5;
            if (game.player2.y < 0) {
                game.player2.y = 0;
            }
            socket.emit("cursor", game.player2.y);
        }
    } else if (event.key === "ArrowDown") {
        if (joueur === joueur1) {
            game.player.y += 5;
            if (game.player.y > canvas.height - PLAYER_HEIGHT) {
                game.player.y = canvas.height - PLAYER_HEIGHT;
            }
            socket.emit("cursor", game.player.y);
        } else if (joueur === joueur2) {
            game.player2.y += 5;
            if (game.player2.y > canvas.height - PLAYER_HEIGHT) {
                game.player2.y = canvas.height - PLAYER_HEIGHT;
            }
            socket.emit("cursor", game.player2.y);
        }
    }
    }

  socket.on("updateBall", (...args) => {
    game.ball.x = args[0].x;
    game.ball.y = args[0].y;
    game.player.y = args[1].player1;
    game.player2.y = args[1].player2;
    draw();
  })

  socket.on("scoreUpdate", (...args) => {
    if (args[0].player1.login === joueur1) {
      SetPlayerScore1(args[0].player1.score);
      SetPlayerScore2(args[0].player2.score);
    } else {
      SetPlayerScore1(args[0].player2.score);
      SetPlayerScore2(args[0].player1.score);
    }
  })

  socket.on("startGame", (...args) => {
    setActive(false);
    // setInGame(true);
    document.querySelector("#victoryMessage").textContent = "";
    // dismiss all toasts
    toast.dismiss();
    toast.success("Game found", { autoClose: 3000 });
    // toast.update(toastid, { render: "Game found", type: "success", isLoading: false, hideProgressBar: false, autoClose: 3000 });
    setIsSearching(false);
    joueur1 = args[1][0].name;
    joueur2 = args[1][1].name;
    game.ball.side = args[0].ball.y;
    SetPlayerScore1(0);
    SetPlayerScore2(0);
  })

  socket.on("stopGame", (...args) => {
    setGM("classic");
    if (args[0].login === accountService.userLogin()) {
        document.querySelector("#victoryMessage").textContent = "Victory";
              jsConfetti.addConfetti({
        emojis: ["✅", "⚡️", "🌈", "😜", "🥇", "🤑"],
      });
    } else {
        document.querySelector("#victoryMessage").textContent = "Defeat";
              jsConfetti.addConfetti({
        emojis: ["❌", "⚡️", "💥", "😢", "🤕", "💢"],
      });
    }
    setActive(true);
    initParty();
  })

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
      context.fillRect(canvas.width - PLAYER_WIDTH, game.player2.y, PLAYER_WIDTH, PLAYER_HEIGHT);
      context.beginPath();
      context.fillStyle = "black";
      context.fillRect(game.ball.x, game.ball.y, game.ball.side, game.ball.side);
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
  return (
    <>
      <div>
        <div className="container">
          {window.location.href.includes("vs") && isActive2 ? (
            <div id="game-root" className="game-root">
              <button
                type="button"
                className="ui labeled icon button"
                id="search-button"
                onClick={() => (window.location.href = "/play")}
              >
                <i className="loading spinner icon"></i>
                Waiting for {}
                {window.location.href.split("vs=")[1]}
                ...
              </button>
            </div>
          ) : (
            ""
          )}

          {isActive && (
            <div id="game-root" className="game-root">
              {/* {isWin ? <Confetti width={width} height={height} /> : ""} */}
              {isActive && !isSearching && (
                <button
                  type="button"
                  className="ui button button-match-making"
                  id="search-button"
                  onClick={() => sendSearch()}
                >
                  {SearchText}
                </button>
              )}

              {isActive && isSearching && (
                <button
                  type="button"
                  className="ui labeled icon button button-match-making"
                  id="search-button"
                  onClick={sendSearch}
                >
                  <i className="loading spinner icon"></i>
                  Cancel matchmaking
                </button>
              )}

              {!isSearching ? (
                // <Form>
                <div className="choosing-game">
                  <Form.Select
                    id="form-select-gamemode"
                    aria-label="Modes de jeux:"
                    className="form-select"
                    defaultValue="original"
                    onChange={(e) => setGM(e.target.value)}
                  >
                    <option value="classic">Classic</option>
                    <option value="fast">Fast</option>
                    <option value="bigball">Big Ball</option>
                  </Form.Select>
                </div>
              ) : (
                ""
              )}
            </div>
          )}
        </div>

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
                <div className="name_player_left" id="joueur1">{joueur1}</div>
                <div className="name_player_right" id="joueur2">{joueur2}</div>
              </div>
            </div>
            {/* { inGame && */}
            <div className="container-canva">
              <canvas
                id="canvas"
                className="game-canva"
                width={500}
                height={400}
              ></canvas>
            </div>
{/* } */}
          </div>
        </main>
      </div>
    </>
  );
}

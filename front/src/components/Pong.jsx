import React, { useEffect, useState } from "react";
import "../styles/Pong.scss";
import JSConfetti from "js-confetti";
// import useWindowDimensions from "./useWindowDimensions";
import io from "socket.io-client";
import { Form } from "react-bootstrap";
// import Confetti from "react-confetti";
import "/node_modules/react-rain-animation/lib/style.css";
import { toast } from "react-toastify";
import { accountService } from "../hooks/account_service";
// import { Select } from "semantic-ui-react";
// import { Dropdown } from "semantic-ui-react";
import versusLogo from "../assets/images/versusLogo.svg";
import "semantic-ui-css/semantic.min.css";

var adversaire;
var joueur = accountService.userName();
// var avatarUrl = accountService.userAvatarUrl();
let joueur1;
let joueur2;
var isSearching = false;
var gm = 0;

let url_begin = "";
if (process.env.REACT_APP_IP === "" || process.env.REACT_APP_IP === undefined)
  url_begin = "http://localhost";
else url_begin = "http://".concat(process.env.REACT_APP_IP);
let selectedUser = "";

var socket = io(url_begin.concat(":5001/game"), {
  query: { username: joueur },
});
console.log(`SOCKET:`);
console.log(socket);

export default function Pong() {
  const jsConfetti = new JSConfetti();
  //   const { height, width } = useWindowDimensions();
  const [toastid, setToastid] = useState(0);

  const [isActive, setActive] = useState(true);
  const [isActive2, setActive2] = useState(false);
  const [modeButton, setModeButton] = useState(true);
  //   const [isWin, setWin] = useState(false);
  const [gameMode, setGM] = useState("original");

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
    if (live == null) window.addEventListener("mousemove", playerMove);
    if (live !== null) {
      setModeButton(false);
      setActive(false);
      setActive2(false);
    }
    return () => {};
  }, []);

  function doVersus() {
    if (vs !== null && !vshisto) {
      setModeButton(false);
      setActive(false);
      socket.emit("versus", joueur + ":" + vs);
      setActive2(true);
      vshisto = true;
    }
  }

  //   function removeInvit() {
  //     setActive2(false);
  //     socket.emit("removeInvit", true);
  //     setActive(true);
  //     setModeButton(true);
  //   }

  function sendSearch() {
    console.log("check search game");
    if (joueur) {
      isSearching = isSearching ? false : true;
      if (isSearching) {
        setModeButton(false);
        SearchText = "Cancel matchmaking";
        socket.emit("search", gameMode);
        document.querySelector("#search-button").textContent = SearchText;
        const toastid = toast.loading("Searching for a player");
        setToastid(toastid);
      } else {
        setModeButton(true);
        SearchText = "Restart matchmaking";
        socket.emit("search", "STOPSEARCH-" + gameMode);
        document.querySelector("#search-button").textContent = SearchText;
        toast.update(toastid, {
          render: "Matchmaking cancelled",
          type: "error",
          isLoading: false,
          hideProgressBar: false,
          autoClose: 3000,
        });
      }
      setGM("original");
    } else {
      document.querySelector("#search-button").textContent =
        "Cannot launch matchmaking";
      toast.update(toastid, {
        render: "Cannot launch matchmaking",
        type: "error",
        isLoading: false,
        hideProgressBar: false,
        autoClose: 3000,
      });
    }
  }

  socket.on("roundStartLIVE", (...args) => {
    if (
      live !== null &&
      (document.querySelector("#player-score").textContent === "5" ||
        document.querySelector("#player2-score").textContent === "5") &&
      joueur !== joueur2 &&
      joueur !== joueur1
    )
      window.top.location = url_begin.concat(":3000/live");

    if (live !== null || joueur === joueur2) {
      const b = args[0].split(":");
      document.querySelector("#joueur1").textContent = b[1];
      document.querySelector("#joueur2").textContent = b[2];
      document.querySelector("#player-score").textContent = String(b[3]);
      document.querySelector("#player2-score").textContent = String(b[4]);
      joueur1 = b[1];
      joueur2 = b[2];
      console.log("HERE: " + isActive);
      setModeButton(false);
      setActive(false);
      setActive2(false);
      if (game) {
        game.player.score = b[3];
        game.player2.score = b[4];
      }
      if (
        (document.querySelector("#player-score").textContent === "5" ||
          document.querySelector("#player2-score").textContent === "5") &&
        live == null
      ) {
        stop();
        clearDataGame();
      }
    }
  });

  socket.on("gameStart", (...args) => {
    // setWin(false);
    document.querySelector("#player-score").textContent = "0";
    document.querySelector("#player2-score").textContent = "0";
    document.querySelector("#victoryMessage").textContent = "";
    document.querySelector("#waitingPlayer").textContent = "";
    joueur1 = args[0];
    joueur2 = args[1];
    // const str = "";
    if (joueur1 === joueur) {
      adversaire = joueur2;
    } else {
      adversaire = joueur1;
    }
    toast.update(toastid, {
      render: "Game found with " + adversaire + " !",
      type: "success",
      isLoading: false,
      hideProgressBar: false,
      autoClose: 3000,
    });
    gm = args[2];
    setGameMode(gm);
    initParty();
    if (joueur1 !== adversaire && joueur1 === joueur && game) {
      adversaire = joueur2;
      document.querySelector("#joueur1").textContent = joueur1;
      document.querySelector("#joueur2").textContent = joueur2;
      cancelAnimationFrame(anim);
      play();
      setModeButton(false);
      setActive(false);
      setActive2(false);
    } else if (joueur2 !== adversaire && joueur2 === joueur && game) {
      adversaire = joueur1;
      document.querySelector("#joueur1").textContent = joueur1;
      document.querySelector("#joueur2").textContent = joueur2;
      cancelAnimationFrame(anim);
      play();
      setModeButton(false);
      setActive(false);
      setActive2(false);
    }
  });

  function setGameMode(g) {
    if (g === 0) {
      PLAYER_WIDTH = 10;
      BALL_SIDE = 10;
      BALL_SPEED = 2;
    } else if (g === 1) {
      PLAYER_WIDTH = 10;
      BALL_SIDE = 50;
      BALL_SPEED = 2;
    } else if (g === 2) {
      PLAYER_WIDTH = 10;
      BALL_SIDE = 10;
      BALL_SPEED = 5;
    }
  }

  var canvas;
  var game;
  var anim;
  // On peut changer les dimensions de la balle et des joueurs
  var PLAYER_HEIGHT = 80;
  var PLAYER_WIDTH = 10;
  var BALL_SIDE = 10;
  var BALL_SPEED = 2;

  function draw() {
    // Draw Canvas
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
      context.fillRect(game.ball.x, game.ball.y, BALL_SIDE, BALL_SIDE);
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
            x: canvas.width / 2 - BALL_SIDE / 2,
            y: canvas.height / 2 - BALL_SIDE / 2,
            speed: {
              x: BALL_SPEED,
              y: BALL_SPEED,
            },
          },
        };
      }
      //   {isActive && draw();}
      draw();
  }

  window.addEventListener(
    "resize",
    function () {
      draw();
    },
    true
  );

  function play() {
    draw();
    ballMove();
    anim = requestAnimationFrame(play);
  }

  function playerMove(event) {
    // Get the mouse location in the canvas
    var canvasLocation = canvas.getBoundingClientRect();
    var mouseLocation = event.clientY - canvasLocation.y;
    // Emit socket player position
    if (joueur === joueur1) {
      game.player.y = mouseLocation - PLAYER_HEIGHT / 2;
      if (mouseLocation < PLAYER_HEIGHT / 2) {
        game.player.y = 0;
      } else if (mouseLocation > canvas.height - PLAYER_HEIGHT / 2) {
        game.player.y = canvas.height - PLAYER_HEIGHT;
      } else {
        game.player.y = mouseLocation - PLAYER_HEIGHT / 2;
      }
      if (joueur && game.player.y && adversaire)
        socket.emit(
          "playerMove",
          `${joueur}:${game.player.y}:${adversaire}:gauche:${gm}`
        );
    } else if (joueur === joueur2) {
      game.player2.y = mouseLocation - PLAYER_HEIGHT / 2;
      if (mouseLocation < PLAYER_HEIGHT / 2) {
        game.player2.y = 0;
      } else if (mouseLocation > canvas.height - PLAYER_HEIGHT / 2) {
        game.player2.y = canvas.height - PLAYER_HEIGHT;
      } else {
        game.player2.y = mouseLocation - PLAYER_HEIGHT / 2;
      }
      if (joueur && game.player.y && adversaire)
        socket.emit(
          "playerMove",
          `${joueur}:${game.player2.y}:${adversaire}:droit:${gm}`
        );
    }
  }

  socket.on("playerMove", (body) => {
    if (game) {
      // Update Paddle position in real time
      const b = body.split(":");
      if (b[0] === joueur2 && joueur !== joueur2) {
        game.player2.y = b[1];
      } else if (b[0] === joueur1 && joueur !== joueur1) {
        game.player.y = b[1];
      }

      if (live !== null) {
        const l = live.split("+");
        const li = l[0].split(" ");
        if (b[0] === li[0]) game.player.y = b[1];
        else if (b[0] === li[1]) game.player2.y = b[1];
        draw();
      }
    }
  });

  function acceptInvitePlay() {
    window.top.location = url_begin
      .concat(":3000/play?vs=")
      .concat(selectedUser);
  }

  const InvitetoPlay = () => {
    return (
      <div>
        {selectedUser} wants to play with you !
        <button className="btn btn-dark" onClick={acceptInvitePlay}>
          Accept
        </button>
      </div>
    );
  };

  socket.on("inviteToPlay", (...args) => {
    if (joueur === args[1] && selectedUser !== args[0]) selectedUser = args[0];
    else return;

    toast.dark(<InvitetoPlay />, {
      position: "top-right",
      autoClose: 10000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      closeButton: false,
      //progress: undefined
    });
  });

  function ballMove() {
    // Rebounds on top and bottom
    if (joueur === joueur1 && live === null) {
      if (game.ball.y + BALL_SIDE > canvas.height || game.ball.y < 0) {
        game.ball.speed.y *= -1;
      }
      if (game.ball.x + BALL_SIDE > canvas.width - PLAYER_WIDTH) {
        collide(game.player2);
      } else if (game.ball.x < PLAYER_WIDTH) {
        collide(game.player);
      }
      // Ball progressive speed
      game.ball.x += game.ball.speed.x;
      game.ball.y += game.ball.speed.y;
      socket.emit(
        "ballMoveFront",
        `${joueur1}:${joueur2}:${game.ball.x}:${game.ball.y}:${game.ball.speed.x}:${game.ball.speed.y}`
      );
    }
  }

  socket.on("ballMoveBack", (body) => {
    const b = body.split(":");
    if (game !== undefined)
      if (
        (joueur === joueur2 && joueur2 === b[1] && joueur1 === b[0]) ||
        live !== null
      ) {
        game.ball.x = b[2];
        game.ball.y = b[3];
        if (live !== null) draw();
      }
  });

  function collide(player) {
    // The player does not hit the ball
    var bottom;
    bottom = Number(player.y) + Number(PLAYER_HEIGHT);
    if (game.ball.y + BALL_SIDE < player.y || game.ball.y > bottom) {
      // Set ball and players to the center
      game.ball.x = canvas.width / 2 - BALL_SIDE / 2;
      game.ball.y = canvas.height / 2 - BALL_SIDE / 2;
      game.ball.speed.y = BALL_SPEED;

      if (player === game.player) {
        // Change ball direction + reset speed
        game.ball.speed.x = BALL_SPEED * -1;
        // Update score
        game.player2.score++;
        socket.emit(
          "roundStart",
          `${0}:${joueur1}:${joueur2}:${game.player.score}:${
            game.player2.score
          }:right`
        );
        document.querySelector("#player2-score").textContent =
          game.player2.score;
        if (
          game.player2.score === 5 ||
          document.querySelector("#player2-score").textContent === "5"
        ) {
          stop();
          clearDataGame();
        }
      } else {
        // Change ball direction + reset speed
        game.ball.speed.x = BALL_SPEED;
        // Update score
        game.player.score++;
        socket.emit(
          "roundStart",
          `${0}:${joueur1}:${joueur2}:${game.player.score}:${
            game.player2.score
          }:left`
        );
        document.querySelector("#player-score").textContent = game.player.score;
        if (
          game.player.score === 5 ||
          document.querySelector("#player-score").textContent === "5"
        ) {
          stop();
          clearDataGame();
        }
      }
    } else {
      // Increase speed and change direction
      game.ball.speed.x *= -1.2;
      changeDirection(player.y);
    }
  }

  function changeDirection(playerY) {
    // Ball bounce
    var impact = game.ball.y + BALL_SIDE / 2 - playerY - PLAYER_HEIGHT / 2;
    var ratio = 100 / (PLAYER_HEIGHT / 2);
    game.ball.speed.y = Math.round((impact * ratio) / 10);
  }

  function stop() {
    // console.log("username: ", joueur, ", adversaire: ", adversaire, ", score player 1: ", game.player.score, ", score player 2: ", game.player.score, ", gameMode: ", gm)
    if (
      game !== undefined &&
      game.player.score > game.player2.score &&
      joueur1 &&
      joueur2 &&
      joueur1 === joueur
    ) {
      socket.emit(
        "gameEnd",
        `${joueur1}:${joueur2}:${game.player.score}:${game.player2.score}:${gm}`
      );
      document.querySelector("#victoryMessage").textContent = "Victory";
    }
    if (
      game !== undefined &&
      game.player.score < game.player2.score &&
      joueur1 &&
      joueur2 &&
      joueur2 === joueur
    ) {
      socket.emit(
        "gameEnd",
        `${joueur2}:${joueur1}:${game.player2.score}:${game.player.score}:${gm}`
      );
      document.querySelector("#victoryMessage").textContent = "Victory";
    }
    if (document.querySelector("#victoryMessage").textContent !== "Victory") {
      document.querySelector("#victoryMessage").textContent = "Defeat";
      jsConfetti.addConfetti({
        emojis: ["❌", "⚡️", "💥", "😢", "🤕", "💢"],
      });
    } else {
      //   setWin(true);
      jsConfetti.addConfetti({
        emojis: ["✅", "⚡️", "🌈", "😜", "🥇", "🤑"],
      });
    }
    cancelAnimationFrame(anim);

    // Set ball and players to the center
    game.ball.x = canvas.width / 2 - BALL_SIDE / 2;
    game.ball.y = canvas.height / 2 - BALL_SIDE / 2;
    game.player.y = canvas.height / 2 - PLAYER_HEIGHT / 2;
    game.player2.y = canvas.height / 2 - PLAYER_HEIGHT / 2;
    // Reset speed
    game.ball.speed.x = 0;
    game.ball.speed.y = 0;
  }

  function clearDataGame() {
    if (live !== null) window.top.location = url_begin.concat(":3000/live");
    joueur1 = null;
    joueur2 = null;
    game = {
      player: {
        y: canvas.height / 2 - PLAYER_HEIGHT / 2,
      },
      player2: {
        y: canvas.height / 2 - PLAYER_HEIGHT / 2,
      },
      ball: {
        x: canvas.width / 2 - BALL_SIDE / 2,
        y: canvas.height / 2 - BALL_SIDE / 2,
        speed: {
          x: 0,
          y: 0,
        },
      },
    };
    cancelAnimationFrame(anim);
    isSearching = false;
    setModeButton(true);
    setActive(true);
    setActive2(false);
    SearchText = "Play Again";
  }

//   const gameOptions = [
//     { key: "original", text: "Classic", value: "original" },
//     { key: "bigball", text: "Big Ball", value: "bigball" },
//     { key: "fast", text: "Fast", value: "fast" },
//   ];

  // if url have a get parameter vs, then it's a live game
  //   if (window.location.href.includes("vs")) {
  //     alert("Live game");
  //   }
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
              {isActive && modeButton && (
                <button
                  type="button"
                  className="ui button button-match-making"
                  id="search-button"
                  onClick={() => sendSearch()}
                >
                  {SearchText}
                </button>
              )}

              {isActive && !modeButton && (
                <button
                  type="button"
                  className="ui labeled icon button"
                  id="search-button"
                  onClick={() => sendSearch()}
                >
                  <i className="loading spinner icon"></i>
                  Cancel matchmaking
                </button>
              )}

              {modeButton ? (
                // <Form>
                <div className="choosing-game">
                  <Form.Select
                    id="form-select-gamemode"
                    aria-label="Modes de jeux:"
                    className="form-select"
                    defaultValue="original"
                    onChange={(e) => setGM(e.target.value)}
                  >
                    <option value="original">Classic</option>
                    <option value="bigball ">Big Ball</option>
                    <option value="fast">Fast</option>
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
                    0
                  </div>
                </div>
                <img src={versusLogo} alt="versus" className="versusLogo" />
                <div className="container-score-player">
                  <div className="score_player" id="player2-score">
                    0
                  </div>
                </div>
              </div>
              <div className="canvas-name-player" id="scores">
                <div className="name_player_left" id="joueur1" />
                <div className="name_player_right" id="joueur2" />
              </div>
              {/* </div> */}
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

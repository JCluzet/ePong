import React, { useEffect } from 'react';
import './Pong.scss';
import useWindowDimensions from "./useWindowDimensions"
import io from "socket.io-client";
import axios from "axios";
import { Form } from 'react-bootstrap'
import Confetti from 'react-confetti';
import { Offline, Online } from "react-detect-offline";
import "../../../node_modules/react-rain-animation/lib/style.css";
import { toast } from "react-toastify";

var adversaire;
var joueur;
let joueur1;
let joueur2;
var isSearching = false;
var gm = 0;

let url_begin = "";
if (process.env.REACT_APP_IP === "" || process.env.REACT_APP_IP === undefined)
	url_begin = "http://localhost";
else
	url_begin = "http://".concat(process.env.REACT_APP_IP);
let selectedUser = "";

export default function Pong() {

	const { height, width } = useWindowDimensions();

	const [isActive, setActive] = React.useState(true);
	const [isActive2, setActive2] = React.useState(false);
	const [isWin, setWin] = React.useState(false);
	const [gameMode, chanScopeSet] = React.useState("original");

	const queryParams = new URLSearchParams(window.location.search);
	const vs = queryParams.get('vs');
	const live = queryParams.get('live');

	let vshisto = false;

	const [username, setUsername] = React.useState("");
	function getUser() {
		let url = url_begin.concat(":3000/api/auth/");
		let username = "";
		axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
		axios.defaults.withCredentials = true;
		axios.get(url)
			.then(res => {
				username = res.data.login;
				joueur = username;
				setUsername(username);
				if (vs !== null && !vshisto) {
					setActive(false);
					socket.emit('versus', joueur + ":" + vs)
					setActive2(true);
					vshisto = true;
				}
			})
			.catch((err) => {
			})
	}
	var SearchText = "Rechercher une partie"
	var socket = io(url_begin.concat(":3000/play"), { query: { username: username } });
	var socket2 = io(url_begin.concat(":3000/chat"), { query: { username: username } });

	function removeInvit() {
		setActive2(false);
		socket.emit('removeInvit', true)
		setActive(true);
	}

	function sendSearch() {
		if (joueur) {
			isSearching = isSearching ? false : true;
			if (isSearching) {
				SearchText = "Annuler la recherche"
				socket.emit('search', gameMode);
			}
			else {
				SearchText = "Rechercher une partie à nouveau"
				socket.emit('search', "STOPSEARCH-" + gameMode);
			}
			document.querySelector('#search-button').textContent = SearchText;
		}
		else
			document.querySelector('#search-button').textContent = "Impossible de te connecter !"
	}

	socket.on("roundStartLIVE", (...args) => {
		if (live !== null && (document.querySelector('#player-score').textContent === "5" ||
			document.querySelector('#player2-score').textContent === "5") && joueur !== joueur2 && joueur !== joueur1)
			window.top.location = url_begin.concat(":3000/live");

		if (live !== null || joueur === joueur2) {
			const b = args[0].split(':');
			document.querySelector('#joueur1').textContent = b[1] + ": ";
			document.querySelector('#joueur2').textContent = b[2] + ": ";
			document.querySelector('#player-score').textContent = String(b[3]);
			document.querySelector('#player2-score').textContent = String(b[4]);
			joueur1 = b[1];
			joueur2 = b[2];
			setActive(false);
			setActive2(false);
			if (game) {
				game.player.score = b[3];
				game.player2.score = b[4];
			}
			if ((document.querySelector('#player-score').textContent === "5" ||
				document.querySelector('#player2-score').textContent === "5") && live == null) {
				stop();
				clearDataGame();
			}
		}
	});

	socket.on("gameStart", (...args) => {
		setWin(false);
		document.querySelector('#player-score').textContent = "0";
		document.querySelector('#player2-score').textContent = "0";
		document.querySelector('#victoryMessage').textContent = "";
		document.querySelector('#waitingPlayer').textContent = "";
		joueur1 = args[0];
		joueur2 = args[1];
		socket2.emit("update", joueur1 + ":ingame");
		socket2.emit("update", joueur2 + ":ingame");
		gm = args[2];
		initParty();
		if (joueur1 !== adversaire && joueur1 === joueur && game) {
			adversaire = joueur2;
			document.querySelector('#joueur1').textContent = joueur1 + ": ";
			document.querySelector('#joueur2').textContent = joueur2 + ": ";
			cancelAnimationFrame(anim);
			play();
			setActive(false);
			setActive2(false);
			setGameMode(gm);
		}
		else if (joueur2 !== adversaire && joueur2 === joueur && game) {
			adversaire = joueur1;
			document.querySelector('#joueur1').textContent = joueur1 + ": ";
			document.querySelector('#joueur2').textContent = joueur2 + ": ";
			cancelAnimationFrame(anim);
			play();
			setActive(false);
			setActive2(false);
			setGameMode(gm);
		}

	});

	function setGameMode(g) {
		if (g === 0) {
			PLAYER_HEIGHT = 80;
			PLAYER_WIDTH = 10;
			BALL_HEIGHT = 10;
			BALL_SPEED = 2;
			BALL_ACCELERATE = true;
		} else if (g === 1) {
			PLAYER_HEIGHT = 80;
			PLAYER_WIDTH = 10;
			BALL_HEIGHT = 50;
			BALL_SPEED = 2;
			BALL_ACCELERATE = true;
		} else if (g === 2) {
			PLAYER_HEIGHT = 80;
			PLAYER_WIDTH = 10;
			BALL_HEIGHT = 10;
			BALL_SPEED = 5;
			BALL_ACCELERATE = true;
		} else if (g === 3) {
			PLAYER_HEIGHT = 80;
			PLAYER_WIDTH = 10;
			BALL_HEIGHT = 10;
			BALL_SPEED = 0.5;
			BALL_ACCELERATE = false;
		} else if (g === 4) {
			PLAYER_HEIGHT = 80;
			PLAYER_WIDTH = 80;
			BALL_HEIGHT = 10;
			BALL_SPEED = 2;
			BALL_ACCELERATE = true;
		}
	}


	// PONG CODE BELOW
	var canvas;
	var game;
	var anim;
	// On peut changer les dimensions de la balle et des joueurs, ex: autres modes de jeux
	var PLAYER_HEIGHT = 80;
	var PLAYER_WIDTH = 10;
	var BALL_HEIGHT = 10;
	var BALL_SPEED = 2;
	var BALL_ACCELERATE = true;
	function draw() {
		// Draw Canvas
		if (canvas) {
			var context = canvas.getContext('2d');
			context.fillStyle = 'black';
			context.fillRect(0, 0, canvas.width, canvas.height);
			context.strokeStyle = 'white';
			context.beginPath();
			context.moveTo(canvas.width / 2, 0);
			context.lineTo(canvas.width / 2, canvas.height);
			context.stroke();
			context.fillStyle = 'white';
			context.fillRect(0, game.player.y, PLAYER_WIDTH, PLAYER_HEIGHT);
			context.fillRect(canvas.width - PLAYER_WIDTH, game.player2.y, PLAYER_WIDTH, PLAYER_HEIGHT);
			context.beginPath();
			context.fillStyle = 'white';
			context.fillRect(game.ball.x, game.ball.y, BALL_HEIGHT, BALL_HEIGHT);
			context.fill();
		}
	}

	function initParty() {
		if (canvas) {
			game = {
				player: {
					y: canvas.height / 2 - PLAYER_HEIGHT / 2,
					score: 0
				},
				player2: {
					y: canvas.height / 2 - PLAYER_HEIGHT / 2,
					score: 0
				},
				ball: {
					x: canvas.width / 2 - BALL_HEIGHT / 2,
					y: canvas.height / 2 - BALL_HEIGHT / 2,
					speed: {
						x: BALL_SPEED,
						y: BALL_SPEED
					}
				}
			}
			draw();
		}
	}

	useEffect(() => {
		let isMounted = true;
		// First page loading event (only one time)
		getUser();
		canvas = document.getElementById('canvas');
		initParty();
		if (live == null)
			canvas.addEventListener('mousemove', playerMove);

		if (live !== null) {
			setActive(false);
			setActive2(false);
		}
		return () => { isMounted = false };
	}, []);

	window.addEventListener('resize', function (event) {
		draw();
	}, true);

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
				socket.emit('playerMove', joueur + ":" + game.player.y + ":" + adversaire + ":" + "gauche" + ":" + gm);
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
				socket.emit('playerMove', joueur + ":" + game.player2.y + ":" + adversaire + ":" + "droit" + ":" + gm);
		}
	}

	socket.on("playerMove", (body) => {
		if (game) {
			// Update Paddle position in real time
			const b = body.split(':');
			if (b[0] === joueur2 && joueur !== joueur2) {
				game.player2.y = b[1];
			} else if (b[0] === joueur1 && joueur !== joueur1) {
				game.player.y = b[1];
			}

			if (live !== null) {
				const l = live.split('+');
				const li = l[0].split(' ');
				if (b[0] === li[0])
					game.player.y = b[1];
				else if (b[0] === li[1])
					game.player2.y = b[1];
				draw();
			}
		}
	});

	function acceptInvitePlay() {
		window.top.location = url_begin.concat(":3000/play?vs=").concat(selectedUser);;
	}

	const InvitetoPlay = () => {
		return (
			<div>
				{selectedUser} wants to play with you !
				<button className="btn btn-dark" onClick={acceptInvitePlay}>Accept</button>
			</div>)
	}

	socket.on('inviteToPlay', (...args) => {
		if (username === args[1] && selectedUser !== args[0])
			selectedUser = args[0];
		else
			return;

		toast.dark(<InvitetoPlay />, {
			position: "top-right",
			autoClose: 10000,
			hideProgressBar: false,
			closeOnClick: false,
			pauseOnHover: false,
			draggable: false,
			closeButton: false
			//progress: undefined
		});
	});

	function ballMove() {
		// Rebounds on top and bottom
		if (joueur === joueur1 && live === null) {
			if (game.ball.y > canvas.height || game.ball.y < 0) {
				game.ball.speed.y *= -1;
			}
			if (game.ball.x > canvas.width - PLAYER_WIDTH) {
				collide(game.player2);
			} else if (game.ball.x < PLAYER_WIDTH) {
				collide(game.player);
			}
			// Ball progressive speed
			game.ball.x += game.ball.speed.x;
			game.ball.y += game.ball.speed.y;
			socket.emit('ballMoveFront', joueur1 + ":" + joueur2 + ":" + game.ball.x + ":" + game.ball.y + ":" + game.ball.speed.x + ":" + game.ball.speed.y);
		}
	}

	socket.on("ballMoveBack", (body) => {
		const b = body.split(':');
		if (game !== undefined)
			if ((joueur === joueur2 && joueur2 === b[1] && joueur1 === b[0]) || live !== null) {
				game.ball.x = b[2];
				game.ball.y = b[3];
				if (live !== null)
					draw();
			}
	});

	function collide(player) {
		// The player does not hit the ball
		var bottom;
		bottom = Number(player.y) + Number(PLAYER_HEIGHT);
		if (game.ball.y < player.y || game.ball.y > bottom) {
			// Set ball and players to the center
			game.ball.x = canvas.width / 2 - BALL_HEIGHT / 2;
			game.ball.y = canvas.height / 2 - BALL_HEIGHT / 2;
			game.ball.speed.y = BALL_SPEED;

			if (player === game.player) {
				// Change ball direction + reset speed
				game.ball.speed.x = BALL_SPEED * -1;
				// Update score
				game.player2.score++;
				socket.emit('roundStart', 0 + ":" + joueur1 + ":" + joueur2 + ":" + game.player.score + ":" + game.player2.score + ":right");
				document.querySelector('#player2-score').textContent = game.player2.score;
				if (game.player2.score === 5 || document.querySelector('#player2-score').textContent === "5") {
					stop();
					clearDataGame();
				}
			} else {
				// Change ball direction + reset speed
				game.ball.speed.x = BALL_SPEED;
				// Update score
				game.player.score++;
				socket.emit('roundStart', 0 + ":" + joueur1 + ":" + joueur2 + ":" + game.player.score + ":" + game.player2.score + ":left");
				document.querySelector('#player-score').textContent = game.player.score;
				if (game.player.score === 5 || document.querySelector('#player-score').textContent === "5") {
					stop();
					clearDataGame();
				}
			}
		} else {
			// Increase speed and change direction
			if (BALL_ACCELERATE)
				game.ball.speed.x *= -1.2;
			else
				game.ball.speed.x *= -1;
			changeDirection(player.y);
		}
	}

	function changeDirection(playerPosition) {
		// Ball bounce
		var impact = game.ball.y - playerPosition - PLAYER_HEIGHT / 2;
		var ratio = 100 / (PLAYER_HEIGHT / 2);
		game.ball.speed.y = Math.round(impact * ratio / 10);
	}

	function stop() {
		// console.log("username: ", joueur, ", adversaire: ", adversaire, ", score player 1: ", game.player.score, ", score player 2: ", game.player.score, ", gameMode: ", gm)
		if (game !== undefined && game.player.score > game.player2.score && joueur1 && joueur2 && joueur1 === joueur) {
			socket.emit('gameEnd', joueur1 + ":" + joueur2 + ":" + game.player.score + ":" + game.player2.score + ":" + gm);
			document.querySelector('#victoryMessage').textContent = "Victory";
		}
		if (game !== undefined && game.player.score < game.player2.score && joueur1 && joueur2 && joueur2 === joueur) {
			socket.emit('gameEnd', joueur2 + ":" + joueur1 + ":" + game.player2.score + ":" + game.player.score + ":" + gm);
			document.querySelector('#victoryMessage').textContent = "Victory";
		}
		if (document.querySelector('#victoryMessage').textContent !== "Victory")
			document.querySelector('#victoryMessage').textContent = "Game Over";
		else
			setWin(true);
		cancelAnimationFrame(anim);
		// Set ball and players to the center

		game.ball.x = canvas.width / 2 - BALL_HEIGHT / 2;
		game.ball.y = canvas.height / 2 - BALL_HEIGHT / 2;
		game.player.y = canvas.height / 2 - PLAYER_HEIGHT / 2;
		game.player2.y = canvas.height / 2 - PLAYER_HEIGHT / 2;
		// Reset speed
		game.ball.speed.x = 0;
		game.ball.speed.y = 0;

		socket2.emit("update", joueur1 + ":online");
		socket2.emit("update", joueur2 + ":online");
	}

	function clearDataGame() {
		if (live !== null)
			window.top.location = url_begin.concat(":3000/live");
		joueur1 = null;
		joueur2 = null;
		// adversaire = null;
		game = {
			player: {
				y: canvas.height / 2 - PLAYER_HEIGHT / 2
			},
			player2: {
				y: canvas.height / 2 - PLAYER_HEIGHT / 2
			},
			ball: {
				x: canvas.width / 2 - BALL_HEIGHT / 2,
				y: canvas.height / 2 - BALL_HEIGHT / 2,
				speed: {
					x: 0,
					y: 0
				}
			}
		}
		cancelAnimationFrame(anim);
		isSearching = false;
		setActive(true);
		setActive2(false);
		// document.querySelector('#search-button').textContent = "Refaire une partie";
		SearchText = "Refaire une partie";
	}

	return (
		<>
			<div>
				<Online>
					<div id="game-root">
						<div className="container">
							<div className="row d-flex justify-content-center text-center">
								{isWin ? <Confetti width={width} height={height} /> : ""}
								{isActive ?
									<Form>
										<Form.Group>
											<div className="row d-flex justify-content-center text-center">
												<Form.Label className="form--label">Choose game option : </Form.Label>
												<Form.Select id="form-select" aria-label="Modes de jeux:" defaultValue="original" onChange={e => chanScopeSet(e.target.value)}>
													<option>Modes de jeux:</option>
													<option value="original">Classic</option>
													<option value="bigball">Big Ball</option>
													<option value="blitz">Fast</option>
													<option value="cube">Cubic</option>
												</Form.Select>
											</div>
										</Form.Group>
									</Form>
									: ""}
								<div className="row d-flex justify-content-center text-center">
									{isActive ? <button type="button" className="btn btn-outline-light" id="search-button" onClick={() => sendSearch()}>{SearchText}</button> : ""}
									{isActive2 ? <button type="button" className="btn btn-outline-light" id="search-button2" onClick={() => removeInvit()}>Annuler l'invitation</button> : ""}
								</div>
								<p id="victoryMessage"></p>
								<p id="waitingPlayer"></p>
								<main role="main">
									<p className="canvas-score" id="scores">
										<em className="canvas-score" id="joueur1"></em>
										<em className="canvas-score" id="player-score">0</em> - <em id="joueur2"></em>
										<em className="canvas-score" id="player2-score">0</em></p>
									<canvas id="canvas" width={500} height={500}></canvas>
								</main>
							</div>
						</div>
					</div>
				</Online>
				<Offline>
					<div id="offline">Vous n'êtes pas connecté à internet !</div>
				</Offline>
			</div>
		</>
	);
}

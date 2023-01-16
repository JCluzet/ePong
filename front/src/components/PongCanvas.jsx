import React, { useEffect, useState } from 'react';
import '../styles/Pong.scss';
import useWindowDimensions from "./useWindowDimensions"
import io from "socket.io-client";
import { Form } from 'react-bootstrap'
import Confetti from 'react-confetti';
// import { Offline, Online } from "react-detect-offline";
import "/node_modules/react-rain-animation/lib/style.css";
import { toast } from "react-toastify";
import { accountService } from "../hooks/account_service";

var adversaire;
var joueur = accountService.userLogin();
let joueur1;
let joueur2;
var isSearching = false;
var gm = 0;
let selectedUser = "";
let url_begin = "http://localhost";
	
export default function PongCanvas() {
	
	const { height, width } = useWindowDimensions();
	
	const [isActive, setActive] = useState(true);
	const [isActive2, setActive2] = useState(false);
	const [isWin, setWin] = useState(false);
	const [gameMode, setGM] = useState("original");
	const [username, setUsername] = useState(joueur);
	
	const queryParams = new URLSearchParams(window.location.search);
	const vs = queryParams.get('vs');
	const live = queryParams.get('live');
	let vshisto = false;
	var SearchText = "Rechercher une partie";

	useEffect(() => {
		setUsername(joueur);
		doVersus();
		// eslint-disable-next-line
		canvas = document.getElementById('canvas');
		initParty();
		// if (live == null)
		// 	window.addEventListener('mousemove', playerMove);
		if (live !== null) {
			setActive(false);
			setActive2(false);
		}
		return () => {};
	}, []);
		
	function doVersus() {
		if (vs !== null && !vshisto) {
			setActive(false);
			socket.emit('versus', joueur + ":" + vs)
			setActive2(true);
			vshisto = true;
		}
	}
	
	var socket = io(url_begin.concat(":5001/game"), { query: { username: username } });
	
	function removeInvit() {
		setActive2(false);
		socket.emit('removeInvit', true)
		setActive(true);
	}
	
	function sendSearch() {
		console.log('check search game');
		if (joueur) {
			isSearching = isSearching ? false : true;
			if (isSearching) {
				SearchText = "Annuler le matchmaking"
				socket.emit('search', gameMode);
			}
			else {
				SearchText = "Relancer le matchmaking"
				socket.emit('search', "STOPSEARCH-" + gameMode);
			}
			document.querySelector('#search-button').textContent = SearchText;
			setGM("original");
		}
		else
			document.querySelector('#search-button').textContent = "Impossible de lancer le matchmaking"
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
		gm = args[2];
		setGameMode(gm);
		initParty();
		if (joueur1 !== adversaire && joueur1 === joueur && game) {
			adversaire = joueur2;
			document.querySelector('#joueur1').textContent = joueur1 + ": ";
			document.querySelector('#joueur2').textContent = joueur2 + ": ";
			cancelAnimationFrame(anim);
			play();
			setActive(false);
			setActive2(false);
		}
		else if (joueur2 !== adversaire && joueur2 === joueur && game) {
			adversaire = joueur1;
			document.querySelector('#joueur1').textContent = joueur1 + ": ";
			document.querySelector('#joueur2').textContent = joueur2 + ": ";
			cancelAnimationFrame(anim);
			play();
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
			context.fillRect(game.ball.x, game.ball.y, BALL_SIDE, BALL_SIDE);
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
					x: canvas.width / 2 - BALL_SIDE / 2,
					y: canvas.height / 2 - BALL_SIDE / 2,
					speed: {
						x: BALL_SPEED,
						y: BALL_SPEED
					}
				}
			}
			draw();
		}
	}

	window.addEventListener('resize', function () {
		draw();
	}, true);

	function play() {
		draw();
		anim = requestAnimationFrame(play);
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
		window.top.location = url_begin.concat(":3000/play?vs=").concat(selectedUser);
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

	socket.on("stop", (body) => {
		// console.log("username: ", joueur, ", adversaire: ", adversaire, ", score player 1: ", game.player.score, ", score player 2: ", game.player.score, ", gameMode: ", gm)
		if (game !== undefined && game.player.score > game.player2.score && joueur1 && joueur2 && joueur1 === joueur) {
			document.querySelector('#victoryMessage').textContent = "Victory";
		}
		if (game !== undefined && game.player.score < game.player2.score && joueur1 && joueur2 && joueur2 === joueur) {
			document.querySelector('#victoryMessage').textContent = "Victory";
		}
		if (document.querySelector('#victoryMessage').textContent !== "Victory")
			document.querySelector('#victoryMessage').textContent = "Game Over";
		else
			setWin(true);
		cancelAnimationFrame(anim);
		
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
				x: canvas.width / 2 - BALL_SIDE / 2,
				y: canvas.height / 2 - BALL_SIDE / 2,
				speed: {
					x: 0,
					y: 0
				}
			}
		}
		isSearching = false;
		setActive(true);
		setActive2(false);
		SearchText = "Refaire une partie";
	});

	return (
		<>
			<div>
					<div id="game-root">
						<div className="container">
							<div className="row-game d-flex justify-content-center text-center">
								{isWin ? <Confetti width={width} height={height} /> : ""}
								{isActive ?
									<Form>
										<Form.Group>
											<div className="row-game d-flex justify-content-center text-center">
												<Form.Label className="form--label">Choose game option</Form.Label>
												<Form.Select id="form-select" aria-label="Modes de jeux:" defaultValue="original" onChange={e => setGM(e.target.value)}>
													<option>Modes de jeux:</option>
													<option value="original">Classic Pong</option>
													<option value="bigball">Big Ball</option>
													<option value="fast">Fast</option>
												</Form.Select>
											</div>
										</Form.Group>
									</Form>
									: ""}
								<div className="row-game d-flex justify-content-center text-center">
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
									<canvas id="canvas" width={500} height={400}></canvas>
								</main>
							</div>
						</div>
					</div>
			</div>
		</>
	);
}

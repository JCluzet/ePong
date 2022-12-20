import React, { useEffect } from 'react';
import '../../styles/Live.scss';
import Header from "./Header";
import io from "socket.io-client";

var game = [];

let url_begin = "";
if (process.env.REACT_APP_IP == "" || process.env.REACT_APP_IP == undefined)
	url_begin = "http://localhost";
else
	url_begin = "http://".concat(process.env.REACT_APP_IP);

export default function Live() {
	var joueurs = [];
	var adversaires = [];

	let socket = io(url_begin.concat(":3000/play"));
	const [displayedNo, setDisplayedNo] = React.useState(false);
	const [load, setLoad] = React.useState(false);

	function display_no() {
		if (displayedNo == false) {
			let check = document.getElementsByClassName("nogame");
			if (check.length == 0) {
				let nogame = document.createElement("div");
				nogame.className = "nogame";
				let parent = document.getElementById("list");
				let newContent = document.createTextNode("Nobody is currently playing");
				nogame.appendChild(newContent);
				parent.appendChild(nogame);
			}
			setDisplayedNo(true);
		}

	}

	function remove_no() {
		const todelete = Array.from(document.getElementsByClassName("nogame"));
		todelete.forEach(del => {
			del.remove();
		});
		if (displayedNo == true)
			setDisplayedNo(false);
	}

	function display(args) {
		let parent;
		let exists;
		let newdiv;
		let newContent;

		remove_no();
		Object.keys(joueurs).map(joueur => {
			adversaires.map(adversaire => {
				parent = document.getElementById("list");
				if (parent) {
					exists = document.getElementById("div_".concat(joueur).concat("_").concat(adversaire));
					if (!exists || exists == null || exists == undefined) {
						newdiv = document.createElement("div");
						newdiv.id = "div_".concat(joueur).concat("_").concat(adversaire);
						newdiv.className = "game";
						newContent = document.createTextNode('🏓 A game is being played by ' + joueurs + " against " + adversaire);
						newdiv.appendChild(newContent);
						parent.appendChild(newdiv);
						let newbutton = document.createElement("button");
						newbutton.innerHTML = "See match";
						newbutton.type = "submit";
						newbutton.className = "btn btn-light watch";
						newbutton.onclick = function () {
							window.top.location = url_begin.concat(":3000/play?live=").concat(joueurs[joueur]).concat("+").concat(adversaire);
						};
						newdiv.appendChild(newbutton);
					}
				}
				initParty(adversaires.indexOf(adversaire));
			})
		})
	}

	useEffect(() => {
		let isMounted = true;
		setLoad(true);
		// if (displayedNo == false)
			display_no();
		// return () => { isMounted = false }; 
		return () => { setLoad(false)};
	}, []);

	//Initialisation de variables
	function initParty(idGame) {
		game[idGame] = {
			player: {
				score: 0
			},
			player2: {
				score: 0
			},
		}
	}

	function display_null() {
		const todelete = Array.from(document.getElementsByClassName("game"));

		todelete.forEach(del => {
			del.remove();
		});

		const todelete2 = Array.from(document.getElementsByClassName("btn btn-lignt watch"));
		todelete2.forEach(del => {
			del.remove();
		});

		display_no();
	}

	socket.on("roundStartLIVE", (...args) => {

		let len;
		let i = 0;
		len = args.length;

		if (args) {
			if (args[i]) {
				let check = args[i].split(':');
				if (check[1] == "null") {
					display_null();
				}
			}
		}
	})

	socket.on("ballMoveBack", (body) => {
		// Update Paddle position in real time
		const b = body.split(':');
		if (joueurs.indexOf(b[0]) == -1 && adversaires.indexOf(b[0]) == -1
			&& joueurs.indexOf(b[1]) == -1 && adversaires.indexOf(b[1])) {
			joueurs.push(b[0]);
			adversaires.push(b[1]);
			display(body);
		}
		else
			return;

	});

	return (
		<div id="live-page">
			<Header />
			<div className="container">
				<div className="row d-flex justify-content-center text-center">
					<div className="col-9">
						<div className="live--div">
							{/* { load == true ?  */}
							{/* <> */}
								<p id="titre">📺 Watch games live</p>
								<div id="content">
									<div id="box">
										<ul id="list">
										</ul>
									</div>
								</div>
							{/* </> */}
							{/* : "" */}
							{/* } */}
						</div>
					</div>
				</div>
			</div>
		</div>
	)

}

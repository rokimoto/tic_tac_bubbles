(function() {
	angular
		.module("TicTacToeApp")
		.controller("GamesController", GamesController);

	GamesController.$inject = ['$firebaseArray','$firebaseObject'];

	function GamesController($firebaseArray, $firebaseObject) {
		var self = this;

		// variable thats holding object from firebase
		self.games = {};

		// game functions
		self.initNewGame = initNewGame;
		self.joinGame = joinGame;
		self.makeMove = makeMove;
		self.clearBoard = clearBoard;
		self.makePlayer1 = makePlayer1;
		self.makePlayer2 = makePlayer2;
		self.endGame = endGame;
		self.id = null;

		self.gamesList = getGameList();

		self.getId = getId;


		self.toggelHighlight = toggelHighlight;
		function toggelHighlight(index) {
			var game = self.gamesList[index];
			if (!game.highlighted) {
				for(var i = 0; i < self.gamesList.length; i++) {
					self.gamesList[i].highlighted = false;
					game.highlighted = true;
				}
			}
			else {
				game.highlighted = false;
			}
		}

		// gets game object from firebase when creating new game
		function getGames() {
			console.log("get new game");
			var idGen = Math.round(Math.random() * 10000);
			self.id = idGen;
			var ref = "https://tictacfish.firebaseio.com/" + idGen;
		  	ref = new Firebase(ref);
		  	var games = $firebaseObject(ref);
		  	return games;
		}
		
		// gets list of games to display when picking game to join
		function getGameList() {
			var ref = new Firebase("https://tictacfish.firebaseio.com/");
			ref = $firebaseArray(ref);
			return ref;
		}

		// initializes new game on button click
		function initNewGame() {
			self.games = getGames();
		}

		// gets game object from firebase when joining game
		function getJoinGames() {
			var ref = "https://tictacfish.firebaseio.com/" + self.id;
		  	ref = new Firebase(ref);
		  	var games = $firebaseObject(ref);
		  	return games;
		}

		// initializes the joining of game on button click
		function joinGame() {
			self.games = getJoinGames();
		}

		// gets ID of game to join
		function getId(id) {
			self.id = id;
			console.log(id);
		}

		// creates gameboard
		var gameboard = [];
		makeBoard();

		// html elements for manipulation
		var overlay = document.getElementById('overlay');
		var winnerSpan = document.getElementById('winnerSpan');


		// /***************************
		//  *      INITIALIZERS       *
		//  ***************************/

		// makes gameboard
		function makeBoard() {
			for (var i = 0; i < 9; i++) {
				gameboard.push( new Square() );
			}
		}

		// creates player1 and new game
		function makePlayer1() {
			var player1 = new Player(self.games.player1.name, "X", true);
			self.games.player1 = player1;	
			self.games.inPlay = false;
			self.games.highlighted = false;
			self.games.id = self.id;
			self.games.gameboard = gameboard;
			self.games.display = false;
			self.games.$save();
		}

		// creates player 2
		function makePlayer2(gameid) {
			console.log(self.games);
			console.log(self.games.player2);
			console.log(self.games.player2.name);
			var player2 = new Player(self.games.player2.name, "O", false);
			self.games.player2 = player2;
			self.games.inPlay = true;
			self.games.player
			self.games.$save();
		}

		// /***************************
		//  *  Constructor Functions  *
		//  ***************************/

		// // game square constructor
		function Square() {
			// checks if square has already been played
			this.beenClicked = false;
			// checks which player marked square - will get set to 'x' or 'o'
			this.marked = "";
		}

		// // player constructor 
		function Player(name, symbol, turn) {
			this.wins = 0;
			this.name = name;
			this.symbol = symbol;
			this.turn = turn;
		}

		// /***************************
		//  *      User Functions     *
		//  ***************************/

		// function checkForTurn() {
		// 	if (self.turn === self.games.player1.turn) {
		// 		makeMove(index)
		// 		self.turn = !self.turn;
		// 	}
		// }

		// makes player move
		function makeMove(index) {
			var winner;
			var thisSquare = self.games.gameboard[index];
			
			if (thisSquare.beenClicked) {
				alert("ALREADY BEEN CLICKED");
			}

			else if (self.games.player1.turn) {
				thisSquare.marked = "X";
				thisSquare.beenClicked = true;
				winner = checkForWinner("X");
				if (winner) {
					self.games.player1.wins++;
				
					restartGame(self.games.player1.name);
				}
				else {
					checkForTie();
				}
				self.games.player1.turn = false;
				self.games.player2.turn = true;
				self.games.$save();
			}

			else {
				thisSquare.marked = "O";
				thisSquare.beenClicked = true;

				winner = checkForWinner("O");
				if (winner) {
					self.games.player2.wins++;
					restartGame(self.games.player2.name);
				}
				else {
					checkForTie();
				}
				self.games.player2.turn = false;
				self.games.player1.turn = true;
				self.games.$save();
			}
			
		}


		// **************************
		//  *  HIDDEN COMPUTER FUNCS  *
		//  **************************

		// // asks user if they want to restart game
		function restartGame(winnerName) {
			setTimeout(function() {
				self.games.winner = winnerName;
				self.games.display = true;
				self.games.$save();
			}, 1000);
		}

		// clears board 
		function clearBoard() {
			for (var i = 0; i < 9; i++) {
				self.games.gameboard[i].marked = "";
				self.games.gameboard[i].beenClicked = false;
			}
			self.games.display = false;
			self.games.$save();
		}

		function endGame() {
			self.games.$remove();

		}


		// // checks for tie
		function checkForTie() {
			var checkedSquareCount = 0;
			for (var i = 0; i < 9; i++) {
				if(self.games.gameboard[i].marked !== "") {
					checkedSquareCount += 1;
				}
			}
			if (checkedSquareCount > 8) {
				restartGame("No one");
			}
		}

		// checks for winner
		function checkForWinner (player) {
			var winner;
			if (self.games.gameboard[0].marked == player) {
				if (self.games.gameboard[1].marked == player && self.games.gameboard[2].marked == player) {
					winner = player;
				}
				if (self.games.gameboard[3].marked == player && self.games.gameboard[6].marked == player) {
					winner = player;
				}
				if (self.games.gameboard[4].marked == player && self.games.gameboard[8].marked == player) {
					winner = player;
				}
			}
			else if (self.games.gameboard[1].marked == player) {			
				if (self.games.gameboard[4].marked == player && self.games.gameboard[7].marked == player) {
					winner = player;
				}
			}
			else if (self.games.gameboard[2].marked == player) {
				if (self.games.gameboard[5].marked == player && self.games.gameboard[8].marked == player) {
					winner = player;
				}	
				if (self.games.gameboard[4].marked == player && self.games.gameboard[6].marked == player) {
					winner = player;
				}
			}
			else if (self.games.gameboard[3].marked == player) {
				if (self.games.gameboard[4].marked == player && self.games.gameboard[5].marked == player) {
					winner = player;
				}
			}
			else if (self.games.gameboard[6].marked == player) {
				if (self.games.gameboard[7].marked == player && self.games.gameboard[8].marked == player) {
					winner = player;
				}
			}
			return winner;
		}

	}

})();
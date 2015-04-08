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
		self.checkForTurn = checkForTurn;
		self.clearBoard = clearBoard;
		self.makePlayer1 = makePlayer1;
		self.makePlayer2 = makePlayer2;
		self.endGame = endGame;
		self.clearTurnModal = clearTurnModal;
		self.clearClickedModal = clearClickedModal;
		self.toggelHighlight = toggelHighlight;
		self.id;
		self.getId = getId;
		self.turn;
		self.gamesList = getGameList();


		// gets game object from firebase when creating new game
		function getGames() {
			var idGen = Math.round(Math.random() * 10000);
			self.id = idGen;
			var ref = "https://tictacfish.firebaseio.com/" + idGen;
		  	ref = new Firebase(ref);
		  	ref.onDisconnect().remove();
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
		  	ref.onDisconnect().remove();
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
			// game is not in play until player2 joins
			self.games.inPlay = false;
			// game is not highlighted in join menu
			self.games.highlighted = false;
			//sets game id
			self.games.id = self.id;
			self.games.gameboard = gameboard;
			// display winner modal is set to false
			self.games.display = false;
			// display whos turn it is is set to false
			self.games.displayturn = false;
			// variable to compare to local turn
			self.games.turn = true;
			self.games.currentPlayer = self.games.player1.name;
			self.games.$save();
			self.turn = true;
		}

		// creates player 2
		function makePlayer2(gameid) {
			var player2 = new Player(self.games.player2.name, "O", false);
			self.games.player2 = player2;
			// sets inPlay to true and will remove games from game list
			self.games.inPlay = true;
			// toggles modal to display whos turn it is
			self.games.displayturn = true;
			self.games.player
			self.games.$save();
			self.turn = false;
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

		// closes "whos turn is it" modal
		function clearTurnModal() {
			self.games.displayturn = false
		}

		// clears "already been clicked" modal
		function clearClickedModal() {
			self.beenClickedAlert = false;
		}
		
		// checks to see if it is your turn
		function checkForTurn(index) {
			if (self.turn === self.games.turn) {
				makeMove(index)
			}
		}

		// makes player move
		function makeMove(index) {
			var winner;
			var thisSquare = self.games.gameboard[index];
			
			if (thisSquare.beenClicked) {
				self.beenClickedAlert = true;
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
				self.games.turn = !self.games.turn;
				self.games.currentPlayer = self.games.player2.name;
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
				self.games.turn = !self.games.turn;
				self.games.currentPlayer = self.games.player1.name;
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
			setTimeout(function() {
				self.games.displayturn = true;
				self.games.$save();
			}, 200)
		}

		// removes game from firebase
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
			console.log("checking")
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
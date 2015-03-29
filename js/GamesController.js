(function() {
	angular
		.module("TicTacToeApp")
		.controller("GamesController", GamesController);

	function GamesController() {
		var self = this;
		var overlay = document.getElementById('overlay');
		var winnerSpan = document.getElementById('winnerSpan');
		self.init = init;
		self.makeMove = makeMove;
		self.clearBoard = clearBoard;
		self.startNewGame = startNewGame;
		self.board = [];
		self.turns = 0;
		self.player1;
		self.player2;

		// keeps track of what page the user is seeing
		self.pageDisplay;

		/***************************
		 *      INITIALIZERS       *
		 ***************************/

		// initializes game
		function init() {
			makeBoard();
			makePlayers();
			self.player1.turn = true;
		}

		// makes gameboard
		function makeBoard() {
			for (var i = 0; i < 9; i++) {
				self.board.push( new Square() );
			}
		}

		// creates 2 players
		function makePlayers() {
			/*
			self.player1 = new Player(getName());
			self.player2 = new Player(getName());
			*/
			self.player1 = new Player("Rachel", "X");
			self.player2 = new Player("Bob", "O");
		}

		/***************************
		 *  Constructor Functions  *
		 ***************************/

		// game square constructor
		function Square() {
			// checks if square has already been played
			this.beenClicked = false;
			// checks which player marked square - will get set to 'x' or 'o'
			this.marked = "";
		}

		// player constructor 
		function Player(name, symbol) {
			this.wins = 0;
			this.makeMove = makeMove;
			this.name = name;
			this.symbol = symbol;
			this.turn = true;
		}

		/***************************
		 *      User Functions     *
		 ***************************/

		function makeMove(index) {
			var winner;
			var playerSymbol;
			var thisSquare = self.board[index];
			
			if (thisSquare.beenClicked) {
				alert("ALREADY BEEN CLICKED");
			}

			else if (self.turns % 2 === 0) {
				playerSymbol = self.player1.symbol;
				updateSquare(thisSquare, playerSymbol);
				winner = checkForWinner(playerSymbol);
				if (winner) {
					self.player1.wins++;
					restartGame(self.player1.name);
				}
				else {
					checkForTie();
				}
				self.player1.turn = false;
				self.player2.turn = true;
			}
			else {
				playerSymbol = self.player2.symbol;
				updateSquare(thisSquare, playerSymbol);

				winner = checkForWinner(playerSymbol);
				if (winner) {
					self.player2.wins++;
					restartGame(self.player2.name);
				}
				else {
					checkForTie();
				}
				self.player2.turn = false;
				self.player1.turn = true;
			}
		}

		function updateSquare(square, player) {
			square.marked = player;
			square.beenClicked = true;
			self.turns++;
		}

		// change this to retrieve value of input box
		function getName() {
			var name = prompt("What is your name?");
			return name;
		}

		/***************************
		 *  HIDDEN COMPUTER FUNCS  *
		 ***************************/

		// changes page to new game
		function startNewGame() {
			self.pageDisplay = 1;
		}

		// asks user if they want to restart game
		function restartGame(winnerName) {
			setTimeout(function() {
				winnerSpan.innerHTML = winnerName;
				overlay.style.visibility="visible";
			}, 1000);
		}

		// clears board 
		function clearBoard() {
			for (var i = 0; i < 9; i++) {
				self.board[i].marked = "";
				self.board[i].beenClicked = false;
			}
			overlay.style.visibility="hidden";
			console.log(self.board);
		}

		// checks for tie
		function checkForTie() {
			var checkedSquareCount = 0;
			for (var i = 0; i < 9; i++) {
				if(self.board[i].marked !== "") {
					checkedSquareCount += 1;
				}
			}
			if (checkedSquareCount > 8) {
				restartGame("No one");
			}
			console.log(checkedSquareCount);
		}

		// checks for winner
		function checkForWinner (player) {
			var winner;
			if (self.board[0].marked == player) {
				if (self.board[1].marked == player && self.board[2].marked == player) {
					winner = player;
				}
				if (self.board[3].marked == player && self.board[6].marked == player) {
					winner = player;
				}
				if (self.board[4].marked == player && self.board[8].marked == player) {
					winner = player;
				}
			}
			else if (self.board[1].marked == player) {			
				if (self.board[4].marked == player && self.board[7].marked == player) {
					winner = player;
				}
			}

			else if (self.board[2].marked == player) {
				if (self.board[5].marked == player && self.board[8].marked == player) {
					winner = player;
				}	
				if (self.board[4].marked == player && self.board[6].marked == player) {
					winner = player;
				}
			}

			else if (self.board[3].marked == player) {
				if (self.board[4].marked == player && self.board[5].marked == player) {
					winner = player;
				}
			}

			else if (self.board[6].marked == player) {
				if (self.board[7].marked == player && self.board[8].marked == player) {
					winner = player;
				}
			}
			return winner;
		}

		// change init call to button later and remove
		init();
	}



})();
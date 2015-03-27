(function() {
	angular
		.module("TicTacToeApp")
		.controller("GamesController", GamesController);

	function GamesController() {
		
		var self = this;
		self.init = init;
		self.makeMove = makeMove;
		self.board = [];
		self.turns = 0;
		self.player1;
		self.player2;

		/***************************
		 *      INITIALIZERS       *
		 ***************************/

		// initializes game
		function init() {
			makeBoard();
			makePlayers();
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
			self.player1 = new Player("rachel", "X");
			self.player2 = new Player("bob", "O");
		}

		/***************************
		 *  Constructor Functions  *
		 ***************************/

		// game square constructor
		function Square() {
			// checks if square has already been played
			this.beenClicked = false;
			// checks which player marked square - will get set to 'x' or 'o'
			this.marked = " ";
		}

		// player constructor 
		function Player(name, symbol) {
			this.wins = 0;
			this.makeMove = makeMove;
			this.name = name;
			this.symbol = symbol;
		}

		/***************************
		 *      User Functions     *
		 ***************************/

		function makeMove(index) {
			var winner;
			var thisSquare = self.board[index];
			if (thisSquare.beenClicked) {
				alert("ALREADY BEEN CLICKED");
			}
			else if (self.turns % 2 === 0) {
				thisSquare.marked = self.player1.symbol;
				thisSquare.beenClicked = true;
				self.turns++;
				winner = checkForWinner("X");
				alertWinner(winner);
			}
			else {
				thisSquare.marked = self.player2.symbol;
				thisSquare.beenClicked = true;
				self.turns++;
				winner = checkForWinner("O");
				alertWinner(winner);
			}
		}

		// change this to retrieve value of input box
		function getName() {
			var name = prompt("What is your name?");
			return name;
		}

		/***************************
		 *  HIDDEN COMPUTER FUNCS  *
		 ***************************/

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

		// alert winner
		function alertWinner (winner) {
			if (winner) {
				alert("winner!");
			}
		}

		// change init call to button later and remove
		init();
		console.log(self.board);
		console.log(self.player1);
		console.log(self.player2);
	}



})();
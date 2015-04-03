(function() {
	angular
		.module("TicTacToeApp")
		.controller("GamesController", GamesController);

	GamesController.$inject = ['$firebaseArray', '$firebaseObject'];

	function GamesController($firebaseArray, $firebaseObject) {
		var self = this;

		// variable thats holding object from firebase
		self.games;

		// game functions
		self.initNewGame = initNewGame;
		self.joinGame = joinGame;
		self.makeMove = makeMove;
		self.clearBoard = clearBoard;
		self.makePlayer1 = makePlayer1;
		self.makePlayer2 = makePlayer2;
		self.endGame = endGame;
		self.id;

		self.gamesList;
		getGameList();

		self.getId = getId;


		// gets game object from firebase
		function getGames() {
			console.log("get new game");
			var idGen = Math.round(Math.random() * 10000);
			self.id = idGen;
			var ref = "https://tictacfish.firebaseio.com/" + idGen;
		  	ref = new Firebase(ref);
		  	var games = $firebaseObject(ref);
		  	return games;
		}
		
		var gameListArray = [];
		function getGameList() {
			var ref = new Firebase("https://tictacfish.firebaseio.com/");
			ref = $firebaseObject(ref);
			// Retrieve new posts as they are added to Firebase
			// ref.on("value", function(snapshot) {
		 //  		var newPost = snapshot.val();
		 //  		for (prop in newPost) {
   //  				gameListArray.push(prop);
   //  				console.log("inside for " + gameListArray);
			// 	}
			// });
			self.gamesList = ref;
		}


		function initNewGame() {
			self.games = getGames();
		}

		function getJoinGames() {
			var ref = "https://tictacfish.firebaseio.com/" + self.id;
		  	ref = new Firebase(ref);
		  	var games = $firebaseObject(ref);
		  	return games;
		}


		function joinGame() {
			self.games = getJoinGames();
		}

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
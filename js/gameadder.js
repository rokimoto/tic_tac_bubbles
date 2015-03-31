(function() {
	angular
		.module('TicTacToeApp')
		.factory('gameadder', gameAdderFactory);

	gameAdderFactory.$inject = ['$firebaseObject', '$firebaseArray'];

	function gameAdderFactory($firebaseObject, $firebaseArray) {

		var gameCreater = function() {
			var self = this;
			self.gameList = getGame();
			function addGame (player1name, gameName) {
				self.gameList.$add({
					task: taskItem,
					done: false
				});
			}
			function getGame() {
				var ref = "https://todotodo.firebaseio.com/todos";
				ref = new Firebase(ref);
				var todos = $firebaseArray(ref);
				return todos;
			}
		};
		return gameCreater;

	}

})
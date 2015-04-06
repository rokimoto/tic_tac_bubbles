(function() {
	angular
		.module("TicTacToeApp")
		.controller("PagesController", PagesController);

	// controls what page is being displayed
	function PagesController() {
		var self = this;
		self.pageDisplay = null;
		self.clicked = false;
		self.changePage = changePage;

		// changes the page
		function changePage(page) {
			if (page === 4) {
				if (!self.clicked) {
					alert ("You must select a game!");
				}
				else {
					self.pageDisplay = page;
				}
			}
			else {
				self.pageDisplay = page;
			}
		}

	}

	// function to display all after window is loaded
	window.onload = function() {
		var body = document.getElementById('docBody');
		docBody.style.visibility = "visible";
	}

})();
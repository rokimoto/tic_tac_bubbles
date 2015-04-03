(function() {
	angular
		.module("TicTacToeApp")
		.controller("PagesController", PagesController);

	function PagesController() {
		var self = this;
		self.pageDisplay;
		self.changePage = changePage;


	function changePage(page) {
		self.pageDisplay = page;
	}
		
	}
})();
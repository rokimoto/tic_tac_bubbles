(function() {
	var container = document.getElementById('container');

	function makeBubbles() {
		for(var i = 0; i < 30; i++) {
			var opacity = getRandomOpacity();
			var dimension = getRandomSize();
			var location = getRandomLocation();
			var delay = getRandomDelay();
			var speed = getRandomSpeed();
			var bubble = document.createElement("div");
			$(bubble).addClass('circle');
			bubble.style.height = dimension + "px";
			bubble.style.width = dimension + "px";
			bubble.style.left = location + "%";
			bubble.style.bottom = "-300px";
			bubble.style.opacity = opacity;
			$(bubble).delay(delay).animate({
				bottom: "105%"}, speed, "swing", function() {
					$(bubble).remove();
				});
			container.appendChild(bubble);
		}
	}

	function infiniteBubbles() {
		makeBubbles();
		setTimeout(infiniteBubbles, 8000);
	}

	infiniteBubbles();

	function getRandomOpacity() {
		var num = Math.random();
		num = num.toFixed(1);
		return num;
	}

	function getRandomSpeed() {
		var num = Math.floor(20000 * Math.random() + 5000);
		return num;
	}

	function getRandomDelay() {
		var num = Math.floor(5000 * Math.random());
		return num;
	}

	function getRandomSize() {
		var num = Math.floor(40 * Math.random() + 15);
		return num;
	}

	function getRandomLocation() {
		var num = Math.floor(90 * Math.random() + 5);
		return num;
	}

})();
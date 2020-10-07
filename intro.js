const intro = document.getElementById('intro');

intro.innerHTML = `
	<label for="intro__input">
		Hola! Como te llamas?
	</label>
	<input type="text" id="intro__input" class="intro__input">
`
document.getElementById("intro__input").focus();

intro.addEventListener('keydown', maybeSubmit);

function maybeSubmit(e) {
	if (e.keyCode === 13) { //enter
		intro.innerHTML = `
			<p>Encantado de conocerte, ${e.target.value}!</p>
			<p>Quieres jugar a un juego?</p>
			<button type="button" class="btn btn-primary" onclick="loadGame()">SI!</button>
			<button type="button" class="btn">NO!</button>
		`
	}
}

function loadGame() {
	window.location.replace('snake.html');
}


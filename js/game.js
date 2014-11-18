
/* Game namespace */
var game = {

	// an object where to store game information
	data : {
		// score
		// Interact with this through the StateManager, values are otherwise
		// read-only
		score : 0,
        stateManager : null,
		gameplayManager : null,
		depression : 0,
		baseDepression : 0,
		DEPRESSION_TIME_CONST : 4.0,
		DEPRESSION_THRESHOLD : 0.01,
		money : 0,
		job : "none",
		incomeMult : 1.0
	},
	resetData : function() {
		this.data.score = 0;
		this.data.stateManager = null;
		this.data.gameplayManager = null;
		this.data.depression = 0;
		this.data.baseDepression = 0;
		this.data.money = 0;
		this.data.job = "none";
		this.data.incomeMult = 1.0;
	},


	// Run on page load.
	"onload" : function () {
	// Initialize the video.
	if (!me.video.init("screen",  me.video.CANVAS, 640, 480, true, 'auto')) {
		alert("Your browser does not support HTML5 canvas.");
		return;
	}

	// add "#debug" to the URL to enable the debug Panel
	if (document.location.hash === "#debug") {
		window.onReady(function () {
			me.plugin.register.defer(this, debugPanel, "debug");
		});
	}

	// Initialize the audio.
	me.audio.init("mp3,ogg");

	// Set a callback to run when loading is complete.
	me.loader.onload = this.loaded.bind(this);

	// Load the resources.
	me.loader.preload(game.resources);

	// Initialize melonJS and display a loading screen.
	me.state.change(me.state.LOADING);
},

	// Run on game resources loaded.
	"loaded" : function () {
		me.state.set(me.state.MENU, new game.TitleScreen());
		me.state.set(me.state.PLAY, new game.PlayScreen());

		me.pool.register("mainplayer", game.PlayerEntity);
		me.pool.register("bullets", game.BulletEntity);
		me.pool.register("money", game.MoneyEntity);

		me.input.bindKey(me.input.KEY.A, "left");
		me.input.bindKey(me.input.KEY.D, "right");
		me.input.bindKey(me.input.KEY.W, "up");
		me.input.bindKey(me.input.KEY.S, "down");
		me.input.bindKey(me.input.KEY.UP, "fireup");
		me.input.bindKey(me.input.KEY.DOWN, "firedown");
		me.input.bindKey(me.input.KEY.LEFT, "fireleft");
		me.input.bindKey(me.input.KEY.RIGHT, "fireright");
		// Start the game.
		me.state.change(me.state.PLAY);
	}
};

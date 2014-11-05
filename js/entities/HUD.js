

/**
 * a HUD container and child items
 */

game.HUD = game.HUD || {};


game.HUD.Container = me.Container.extend({

	init: function() {
		// call the constructor
		this._super(me.Container, 'init');

		// persistent across level change
		this.isPersistent = true;

		// non collidable
		this.collidable = false;

		// make sure our object is always draw first
		this.z = Infinity;

		// give a name
		this.name = "HUD";

		// add our child score object at the top left corner
		this.addChild(new game.HUD.EmotionIcon(20, 20));
	}
});


/**
 * a basic HUD item to display score
 */
game.HUD.ScoreItem = me.Renderable.extend({
	/**
	 * constructor
	 */
	init: function(x, y) {

		// call the parent constructor
		// (size does not matter here)
		this._super(me.Renderable, 'init', [x, y, 10, 10]);

		// local copy of the global score
		this.score = -1;

		// make sure we use screen coordinates
		this.floating = true;
	},

	/**
	 * update function
	 */
	update : function () {
		// we don't do anything fancy here, so just
		// return true if the score has been updated
		if (this.score !== game.data.score) {
			this.score = game.data.score;
			return true;
		}
		return false;
	},

	/**
	 * draw the score
	 */
	draw : function (context) {
		// draw it baby !
	}

});

/** HUD icon representing emotion. */
game.HUD.EmotionIcon = me.AnimationSheet.extend({
	init: function(x, y) {
		settings = {
			image: me.loader.getImage("mood"),
			spritewidth: 32,
			spriteheight: 32
		};
		this._super(me.AnimationSheet, 'init', [x, y, settings]);
		// Make the icon huge!
		this.resize(2.0, 2.0);
		this.addAnimation("states", [0, 1, 2, 3, 4, 5, 6, 7, 8]);
		this.setCurrentAnimation("states");
		this.animationpause = true;

		// local copy of the global score
		this.depression = -1;

		// make sure we use screen coordinates
		this.floating = true;
	},

	/**
	* update function
	*/
	update : function () {
		// we don't do anything fancy here, so just
		// return true if the score has been updated
		if (this.depression !== game.data.depression) {
			this.depression = game.data.depression;
			// Scale depression from the range 1..-1 to the range 0..9
			var frame = Math.floor((this.depression - 1.0) * 9.0 / -2.0);
			frame = Math.max(0, Math.min(8, frame));
			this.setAnimationFrame(frame);
			return true;
		}
		return false;
	}
});

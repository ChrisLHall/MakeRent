game.PlayScreen = me.ScreenObject.extend({
	/**
	 *  action to perform on state change
	 */
	onResetEvent: function() {

		// did someone say boats? <-- lol nice one
		me.levelDirector.loadLevel('lolboats');

		// reset the score
		game.data.score = 0;

		// add our HUD to the game world
		this.HUD = new game.HUD.Container();
		me.game.world.addChild(this.HUD);

        // TODO REMOVE
        me.game.world.addChild(new game.ObstacleEntity(100, 100));
	},


	/**
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
		// remove the HUD from the game world
		me.game.world.removeChild(this.HUD);
	}
});

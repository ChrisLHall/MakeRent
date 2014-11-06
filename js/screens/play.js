game.PlayScreen = me.ScreenObject.extend({
	/**
	 *  action to perform on state change
	 */
	onResetEvent: function() {

		// did someone say goats??
		// TODO this is a test
		//me.levelDirector.loadLevel('lolboats');

		game.resetData();

		// add our HUD to the game world
		this.HUD = new game.HUD.Container();
		me.game.world.addChild(this.HUD);
		me.game.world.addChild(new game.ScrollingBg("bg1"));

        game.data.stateManager = new game.StateManager();
        me.game.world.addChild(game.data.stateManager);
		game.data.gameplayManager = new game.GameplayManager();
		me.game.world.addChild(game.data.gameplayManager);

		this.player = new game.PlayerEntity(400, 200);
		me.game.world.addChild(this.player);
		game.data.stateManager.setPlayer(this.player);


        // TODO REMOVE
        me.game.world.addChild(new game.ObstacleEntity(300, 100));
        me.game.world.addChild(new game.EnemyEntity(100, 120));
	},


	/**
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
		// remove the HUD from the game world
		me.game.world.removeChild(this.HUD);
	}
});

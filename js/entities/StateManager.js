/** Object to manage the global state of money, mood and jobs. Renderable is the
 * most basic object that can be in a scene (I think?) but don't be confused,
 * this object does not render anything. */
game.StateManager = me.Renderable.extend({
    init: function() {
        // Initialize as a 1x1 object just outside of the viewport
        this._super(me.Renderable, 'init', [-1, -1, 1, 1]);
        this.alwaysUpdate = true;
        this.player = null
    },

    setPlayer: function(playerEntity) {
        this.player = playerEntity;
    },

    addDepression: function(amount) {
        game.data.depression = Math.max(-1.0, Math.min(1.0, game.data.depression + amount))
    },

    update: function(dt) {
        game.data.depression = game.data.baseDepression
                + (game.data.depression - game.data.baseDepression)
                * Math.exp(-dt/(1000 * game.data.DEPRESSION_TIME_CONST));
        if (Math.abs(game.data.depression - game.data.baseDepression)
                < game.data.DEPRESSION_THRESHOLD) {
            game.data.depression = game.data.baseDepression;
        }
        return false;
    }
});

/** HUD icon representing emotion. */
game.ScrollingBg = me.Sprite.extend({
    init: function(imageName) {
        this._super(me.Sprite, 'init', [0, 0, me.loader.getImage(imageName),
                me.game.viewport.width * 2, me.game.viewport.height]);
        this.z = -Infinity;
    },

    update : function () {
        var updated = false;
        // If the viewport scrolls to the right past the end of this background,
        // shift it over by one screen width to maintain the illusion that the
        // background is continuous.
        while (me.game.viewport.pos.x >= this.pos.x + me.game.viewport.width) {
            this.pos.x += me.game.viewport.width;
            this.updateBounds();
            updated = true;
        }
        return updated;
    }
});

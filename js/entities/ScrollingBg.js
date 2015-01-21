/** HUD icon representing emotion. */
game.ScrollingBg = me.Sprite.extend({
    init: function(imageName) {
        this.name = "ScrollingBg";
        this._super(me.Sprite, 'init', [0, 0, me.loader.getImage(imageName),
                me.game.viewport.width * 2, me.game.viewport.height * 2]);
        this.z = -Infinity;
    },

    update : function () {
        var updated = false;
        // If the viewport scrolls past the end of this background,
        // shift it over to maintain the illusion that the
        // background is continuous. This is contingent on the bg image being
        // the same size as the viewport.

        // TODO: String different background images together based on direciton
        // of travel
        while (me.game.viewport.pos.x >= this.pos.x + me.game.viewport.width) {
            this.pos.x += me.game.viewport.width;
            this.updateBounds();
            updated = true;
        }
        while (me.game.viewport.pos.x < this.pos.x) {
            this.pos.x -= me.game.viewport.width;
            this.updateBounds();
            updated = true;
        }
        while (me.game.viewport.pos.y >= this.pos.y + me.game.viewport.height) {
            this.pos.y += me.game.viewport.height;
            this.updateBounds();
            updated = true;
        }
        while (me.game.viewport.pos.y < this.pos.y) {
            this.pos.y -= me.game.viewport.height;
            this.updateBounds();
            updated = true;
        }
        return updated;
    }
});

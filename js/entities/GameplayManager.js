/** Object to manage scrolling, enemy spawns, items, obstacles, etc. */
game.GameplayManager = me.Entity.extend({
    init: function() {
        settings = {
                width: 16,
                height: 16,
                image: "none",
                name: "GameplayManager",
                spritewidth: 16,
                spriteheight: 16
        };
        this._super(me.Entity, 'init', [0, 0, settings]);
        this.body.addShape(new me.Rect(this.y, this.x, this.width, this.height));

        this.body.collisionType = me.collision.types.NONE;
        this.body.setCollisionMask(me.collision.types.NONE);

        this.alwaysUpdate = true;
        this.body.gravity = 0;
        // TODO more testing
        // jk this absolutely does not work
        //this.body.vel.x = 0.1;
    },

    /** Update the block's animation frame based on mood. Destroy it if it is
     out of bounds. */
    update: function(dt) {
        this.body.update(dt);
        me.game.viewport.pos.x = this.pos.x;
        me.game.viewport.pos.y = this.pos.y;
        me.game.viewport.updateBounds();
        return false;
    }
});

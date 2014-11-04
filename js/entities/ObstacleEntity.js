/*------------------- 
a player entity
-------------------------------- */
game.ObstacleEntity = me.Entity.extend({
 
    /* -----
 
    constructor
 
    ------ */
 
    init: function(x, y, settings) {
        if (!settings) {
            settings = {
                    width: 32,
                    height: 32,
                    image: "obstacles",
                    name: "obstacle",
                    spritewidth: 32,
                    spriteheight: 32
            };
            this._super(me.Entity, 'init', [x, y, settings]);
            this.z = 3;
            this.body.addShape(new me.Rect(x, y, this.width, this.height));
        } else {
            this._super(me.Entity, 'init', [x, y, settings]);
        }

        this.body.collisionType = me.collision.types.WORLD_SHAPE;
        this.body.setCollisionMask(me.collision.types.PLAYER_OBJECT
                | me.collision.types.ENEMY_OBJECT);

        // Set the animation frame based on mood
        this.renderable.animationpause = true;
        this.renderable.setAnimationFrame(2);
 
        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;
        this.body.gravity = 0;
    },
 
    /** Update the block's animation frame based on mood. Destroy it if it is
     out of bounds. */
    update: function(dt) {
        updated = false;
        // check & update player movement
        this.body.update(dt);
 
        //updated = updated || this._super(me.Entity, 'update', [dt]);
        updated = this._super(me.Entity, 'update', [dt]);
        if (this.body.pos.x < -this.body.width) {
            // TODO: Destroy this
            updated = true;
        }

        // else inform the engine we did not perform
        // any update (e.g. position, animation)
        return true;
    }
});
/** Generic obstacle object. */
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
            this.body.addShape(new me.Rect(0, 0, this.width, this.height));
        } else {
            this._super(me.Entity, 'init', [x, y, settings]);
        }

        this.body.collisionType = me.collision.types.NPC_OBJECT;
        this.body.setCollisionMask(me.collision.types.PLAYER_OBJECT
                | me.collision.types.ENEMY_OBJECT);

        // Set the animation frame based on mood
        this.renderable.animationpause = true;
        this.renderable.setAnimationFrame(2);

        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;
        this.body.gravity = 0;
    },

    /** Update the animation frame based on the game's depression. */
    updateImage: function() {
        // Scale from -1..1 to 0..5
        var frame = Math.floor((game.data.depression + 1.0) * 5.0 / 2.0);
        frame = Math.max(0, Math.min(4, frame));
        if (this.renderable.getCurrentAnimationFrame() != frame) {
            this.renderable.setAnimationFrame(frame);
            return true;
        }
        return false;
    },

    /** Update the block's animation frame based on mood. Destroy it if it is
     out of bounds. */
    update: function(dt) {
        updated = false;
        // check & update player movement
        this.body.update(dt);

        updated = this.updateImage();
        updated = updated || this._super(me.Entity, 'update', [dt]);
        if (this.body.pos.x < -this.body.width) {
            // TODO: Destroy this
            updated = true;
        }
        if (this.pos.x > me.game.viewport.right + this.width || 
            this.pos.x < me.game.viewport.left  - this.width|| 
            this.pos.y < me.game.viewport.top  - this.height|| 
            this.pos.y > me.game.viewport.bottom + this.height) {
            me.game.world.removeChild(this);
        }

        // else inform the engine we did not perform
        // any update (e.g. position, animation)
        return true;
    }
});

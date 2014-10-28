/*------------------- 
a player entity
-------------------------------- */
game.PlayerEntity = me.Entity.extend({
 
    /* -----
 
    constructor
 
    ------ */
 
    init: function(x, y, settings) {
        // call the constructor
        this._super(me.Entity, 'init', [x, y, settings]);
        this.body.setCollisionMask(me.collision.types.WORLD_SHAPE
                | me.collision.types.ENEMY_OBJECT
                | me.collision.types.COLLECTABLE_OBJECT);
        this.body.onCollision = this.onCollision.bind(this);
 
        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;
        this.body.gravity = 0;
    },

    /** Collision event function, where E is the me.collision.ResponseObject. */
    onCollision: function (e) {
        if (e) {
            console.log(e);
            if (e.b.name == "obstacle") {
                var vec = e.overlapV.clone().negateSelf();
                this.pos.add(vec);
                // THE NEXT LINE IS SOOOOO FUCKING IMPORTANT YOU DONT EVEN KNOW
                this.updateBounds();
            }
        }
    },
 
    /* -----
 
    update the player pos
 
    ------ */
    update: function(dt) {
        if (me.input.isKeyPressed('left')) {
            // flip the sprite on horizontal axis
            this.flipX(true);
            // update the entity velocity
            this.body.vel.x = -3;
        } else if (me.input.isKeyPressed('right')) {
            // unflip the sprite
            this.flipX(false);
            // update the entity velocity
            this.body.vel.x = 3;
        } else {
        	this.body.vel.x = 0;
        }
        if (me.input.isKeyPressed('up')) {
         	this.body.vel.y = -3;
        } else if (me.input.isKeyPressed('down')) {
        	this.body.vel.y = 3;
        } else {
        	this.body.vel.y = 0;
        }
 
        // check & update player movement
        this.body.update(dt);
        var collided = me.collision.check(this, true, this.onCollision.bind(this), true);
 
        if (this.body.vel.x != 0 || this.body.vel.y != 0) {
            this._super(me.Entity, 'update', [dt]);
        }
     
        // else inform the engine we did not perform
        // any update (e.g. position, animation)
        return false;
    }
});
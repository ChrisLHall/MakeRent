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
 
        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;
        this.body.gravity = 0;
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
 
        // update animation if necessary
        if (this.body.vel.x!=0 || this.body.vel.y!=0) {
            // update object animation
            this._super(me.Entity, 'update', [dt]);
            return true;
        }
     
        // else inform the engine we did not perform
        // any update (e.g. position, animation)
        return false;
    }
});
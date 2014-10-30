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
        this.canFire = true;
        this.lastFire = 0;
    },

    resetFire: function() {
            this.canFire = true;
        },

    /** Collision event function, where E is the me.collision.ResponseObject. */
    onCollision: function (e) {
        if (e) {
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
        };

        this.body.update(dt);

        // fire if ready and button pressed
        if (me.input.isKeyPressed('fireleft') && this.canFire) {
            me.timer.clearTimeout(this.lastFire);
            me.game.world.addChild(new game.BulletEntity(this.pos.x/2 + 5, this.pos.y/2 + 5, {}, "left"));
            this.canFire = false;
            bullet = this;
            this.lastFire = me.timer.setTimeout(bullet.resetFire.bind(this), 250);
        } else if (me.input.isKeyPressed('fireright') && this.canFire) {
            me.timer.clearTimeout(this.lastFire);
            me.game.world.addChild(new game.BulletEntity(this.pos.x/2 + 5, this.pos.y/2 + 5, {}, "right"));
            this.canFire = false;
            bullet = this;
            this.lastFire = me.timer.setTimeout(bullet.resetFire.bind(this), 250);
        } else if (me.input.isKeyPressed('fireup') && this.canFire) {
            me.timer.clearTimeout(this.lastFire);
            me.game.world.addChild(new game.BulletEntity(this.pos.x/2 + 5, this.pos.y/2 + 5, {}, "up"));
            this.canFire = false;
            bullet = this;
            this.lastFire = me.timer.setTimeout(bullet.resetFire.bind(this), 250);
        } else if (me.input.isKeyPressed('firedown') && this.canFire) {
            me.timer.clearTimeout(this.lastFire);
            me.game.world.addChild(new game.BulletEntity(this.pos.x/2 + 5, this.pos.y/2 + 5, {}, "down"));
            this.canFire = false;
            bullet = this;
            this.lastFire = me.timer.setTimeout(bullet.resetFire.bind(this), 250);
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

/* Bullet Entity */
game.BulletEntity = me.Entity.extend({
    init: function(x, y, settings, dir) {
        settings.image = "bill_left";
        settings.spritewidth = settings.width = 20;
        settings.spriteheight = settings.height = 14;
        this._super(me.Entity, 'init', [x, y, settings]);
        this.body.addShape(new me.Rect(x, y, this.width, this.height));
        this.z = 4;
        this.body.gravity = 0;

        switch (dir) {
            case "right":
                this.body.vel.x = 10;
                break;
            /*case "downright":
                this.body.setVelocity(Math.sqrt(2), Math.sqrt(2));
                break;*/
            case "down":
                this.body.vel.y = 10;
                break;
            /*case "downleft":
                this.body.setVelocity(-1 * Math.sqrt(2), Math.sqrt(2));
                break;*/
            case "left":
                this.body.vel.x = -10;
                break;
            /*case "upleft":
                this.body.setVelocity(-1 * Math.sqrt(2), -1 * Math.sqrt(2));
                break;*/
            case "up":
                this.body.vel.y = -10;
                break;
            /*case "upright":
                this.body.setVelocity(Math.sqrt(2), -1 * Math.sqrt(2));
                break;*/
        } 
    },

    update: function(dt) {
        this.body.update(dt);
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        if (this.body.vel.y === 0 && this.body.vel.x === 0) {
            me.game.world.removeChild(this);
        }
        // I legit don't know why the hell this works, but it does.
        this.pos.y = this.pos.x = 0;
        return true;
    },

    collideHandler : function (response) {
        if (response.b.name !== 'mainplayer') {
            me.game.world.removeChild(this);
        }
    }
});
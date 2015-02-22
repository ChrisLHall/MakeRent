/*-------------------
a player entity
-------------------------------- */
game.PlayerEntity = me.Entity.extend({

    /* -----

    constructor

    ------ */

    init: function(x, y, settings) {
        // Default value for settings.
        settings = settings || {
            width: 33,
            height: 33,
            image: "master",
            name: "mainplayer",
            spritewidth: 33,
            spriteheight: 33
        };
        // call the constructor
        this._super(me.Entity, 'init', [x, y, settings]);
        if (this.body.shapes.length == 0) {
            this.body.addShape(new me.Rect(0, 0, this.width, this.height));
        }

        this.body.collisionType = me.collision.types.PLAYER_OBJECT;
        this.body.setCollisionMask(me.collision.types.NPC_OBJECT
                | me.collision.types.ENEMY_OBJECT
                | me.collision.types.COLLECTABLE_OBJECT
                | me.collision.types.PROJECTILE_OBJECT);
        this.body.onCollision = this.onCollision.bind(this);

        this.renderable.addAnimation("walk", [28, 29]);
        this.renderable.addAnimation("fire", [42, 43, 44, 45, 46], 50);
        this.renderable.setCurrentAnimation("walk");

        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;
        this.body.gravity = 0;
        this.canFire = true;
        this.lastFire = 0;
        this.onBorder = new me.Vector2d(0, 0);

        this.SPEED = 2;
    },

    resetFire: function() {
            this.canFire = true;
        },

    /** Collision event function, where E is the me.collision.ResponseObject. */
    onCollision: function (e) {
        //console.log(e);
        if (e.b.name == "obstacle") {
            collDirection = e.overlapV.clone().normalize();
            if (this.onBorder.equals(collDirection)) {
                console.log("squish")
                game.data.stateManager.subMoney(1)
                game.data.stateManager.subDepression(.2)
                me.game.world.removeChild(e.b);
            }
            var vec = e.overlapV.clone().negateSelf();
            this.pos.add(vec);
            // THE NEXT LINE IS SOOOOO FUCKING IMPORTANT YOU DONT EVEN KNOW
            this.updateBounds();
        }
    },

    keepInBounds: function() {
        if (this.left <= me.game.viewport.left) {
            this.onBorder.x = 1;
            this.pos.x = me.game.viewport.pos.x;
            this.body.vel.x = Math.max(this.body.vel.x,
                    game.data.gameplayManager.SCROLL_SPEED);
            this.updateBounds();
        } else if (this.right >= me.game.viewport.right) {
            this.onBorder.x =  -1;
            this.body.vel.x = Math.min(this.body.vel.x, 0);
            this.pos.x = me.game.viewport.right - this.width;
            this.updateBounds();
        } else {
            this.onBorder.x = 0;
        }
        if (this.top <= me.game.viewport.top) {
            this.onBorder.y = 1;
            this.pos.y = me.game.viewport.pos.y;
            this.body.vel.y = Math.max(this.body.vel.y, 0);
            this.updateBounds();
        } else if (this.bottom >= me.game.viewport.bottom) {
            this.onBorder.y = -1;
            this.pos.y = me.game.viewport.bottom - this.height;
            this.body.vel.y = Math.min(this.body.vel.y, 0);
            this.updateBounds();
        } else {
            this.onBorder.y = 0;
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
            this.body.vel.x = -this.SPEED;
        } else if (me.input.isKeyPressed('right')) {
            // unflip the sprite
            this.flipX(false);
            // update the entity velocity
            this.body.vel.x = this.SPEED;
        } else {
        	this.body.vel.x = 0;
        }
        if (me.input.isKeyPressed('up')) {
         	this.body.vel.y = -this.SPEED;
        } else if (me.input.isKeyPressed('down')) {
        	this.body.vel.y = this.SPEED;
        } else {
        	this.body.vel.y = 0;
        };

        this.keepInBounds();
        this.body.update(dt);
        game.data.playerPos = this.pos;

        // fire if ready and button pressed
        if (me.input.isKeyPressed('fireleft') && this.canFire) {
            this.renderable.setCurrentAnimation("fire", "walk");
            this.renderable.setAnimationFrame();
            me.timer.clearTimeout(this.lastFire);
            me.game.world.addChild(new game.PlayerBullet(this.pos.x + 5, this.pos.y + 5, {}, "left"));
            this.canFire = false;
            bullet = this;
            this.lastFire = me.timer.setTimeout(bullet.resetFire.bind(this), 250);
        } else if (me.input.isKeyPressed('fireright') && this.canFire) {
            this.renderable.setCurrentAnimation("fire", "walk");
            this.renderable.setAnimationFrame();
            me.timer.clearTimeout(this.lastFire);
            me.game.world.addChild(new game.PlayerBullet(this.pos.x + 5, this.pos.y + 5, {}, "right"));
            this.canFire = false;
            bullet = this;
            this.lastFire = me.timer.setTimeout(bullet.resetFire.bind(this), 250);
        } else if (me.input.isKeyPressed('fireup') && this.canFire) {
            this.renderable.setCurrentAnimation("fire", "walk");
            this.renderable.setAnimationFrame();
            me.timer.clearTimeout(this.lastFire);
            me.game.world.addChild(new game.PlayerBullet(this.pos.x + 5, this.pos.y + 5, {}, "up"));
            this.canFire = false;
            bullet = this;
            this.lastFire = me.timer.setTimeout(bullet.resetFire.bind(this), 250);
        } else if (me.input.isKeyPressed('firedown') && this.canFire) {
            this.renderable.setCurrentAnimation("fire", "walk");
            this.renderable.setAnimationFrame();
            me.timer.clearTimeout(this.lastFire);
            me.game.world.addChild(new game.PlayerBullet(this.pos.x + 5, this.pos.y + 5, {}, "down"));
            this.canFire = false;
            bullet = this;
            this.lastFire = me.timer.setTimeout(bullet.resetFire.bind(this), 250);
        }

        // check & update player movement
        this.body.update(dt);
        var collided = me.collision.check(this, true, this.onCollision.bind(this), true);

        if (this.body.vel.x != 0 || this.body.vel.y != 0 || this.renderable.isCurrentAnimation("fire")) {
            this._super(me.Entity, 'update', [dt]);
        }

        // else inform the engine we did not perform
        // any update (e.g. position, animation)
        return true;
    }
});



/* Bullet Entity */
game.BulletEntity = me.Entity.extend({
    init: function(x, y, settings, dir, vel) {
        this._super(me.Entity, 'init', [x, y, settings]);
        this.body.addShape(new me.Rect(0, 0, this.width, this.height));
        this.z = 4;

        this.body.collisionType = me.collision.types.PROJECTILE_OBJECT;
        this.body.setCollisionMask(me.collision.types.NPC_OBJECT
                | me.collision.types.ENEMY_OBJECT
                | me.collision.types.PLAYER_OBJECT);

        this.body.gravity = 0;
    },

    update: function(dt) {
        this.body.update(dt);
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        if (this.pos.x > me.game.viewport.right || 
            this.pos.x < me.game.viewport.left || 
            this.pos.y < me.game.viewport.top || 
            this.pos.y > me.game.viewport.bottom) {
            me.game.world.removeChild(this);
        }
        this._super(me.Entity, 'update', [dt]);
        return true;
    },

});

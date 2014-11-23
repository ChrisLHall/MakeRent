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
            this.onBorder.set(1, 0);
            this.pos.x = me.game.viewport.pos.x;
            this.body.vel.x = Math.max(this.body.vel.x,
                    game.data.gameplayManager.SCROLL_SPEED);
            this.updateBounds();
        } else if (this.right >= me.game.viewport.right) {
            this.onBorder.set(-1, 0);
            this.body.vel.x = Math.min(this.body.vel.x, 0);
            this.pos.x = me.game.viewport.right - this.width;
            this.updateBounds();
        }
        if (this.top <= me.game.viewport.top) {
            this.onBorder.set(0, 1);
            this.pos.y = me.game.viewport.pos.y;
            this.body.vel.y = Math.max(this.body.vel.y, 0);
            this.updateBounds();
        } else if (this.bottom >= me.game.viewport.bottom) {
            this.onBorder.set(0, -1);
            this.pos.y = me.game.viewport.bottom - this.height;
            this.body.vel.y = Math.min(this.body.vel.y, 0);
            this.updateBounds();
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
            me.timer.clearTimeout(this.lastFire);
            me.game.world.addChild(new game.BulletEntity(this.pos.x + 5, this.pos.y + 5, {}, "left", "player"));
            this.canFire = false;
            bullet = this;
            this.lastFire = me.timer.setTimeout(bullet.resetFire.bind(this), 250);
        } else if (me.input.isKeyPressed('fireright') && this.canFire) {
            me.timer.clearTimeout(this.lastFire);
            me.game.world.addChild(new game.BulletEntity(this.pos.x + 5, this.pos.y + 5, {}, "right", "player"));
            this.canFire = false;
            bullet = this;
            this.lastFire = me.timer.setTimeout(bullet.resetFire.bind(this), 250);
        } else if (me.input.isKeyPressed('fireup') && this.canFire) {
            me.timer.clearTimeout(this.lastFire);
            me.game.world.addChild(new game.BulletEntity(this.pos.x + 5, this.pos.y + 5, {}, "up", "player"));
            this.canFire = false;
            bullet = this;
            this.lastFire = me.timer.setTimeout(bullet.resetFire.bind(this), 250);
        } else if (me.input.isKeyPressed('firedown') && this.canFire) {
            me.timer.clearTimeout(this.lastFire);
            me.game.world.addChild(new game.BulletEntity(this.pos.x + 5, this.pos.y + 5, {}, "down", "player"));
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
        return true;
    }
});



/* Bullet Entity */
game.BulletEntity = me.Entity.extend({
    init: function(x, y, settings, dir, owner, vel, moneyDamage, moodDamage) {
        settings.image = "bill_left";
        settings.spritewidth = settings.width = 20;
        settings.spriteheight = settings.height = 14;
        this._super(me.Entity, 'init', [x, y, settings]);
        this.body.addShape(new me.Rect(0, 0, this.width, this.height));
        this.z = 4;

        this.body.collisionType = me.collision.types.PROJECTILE_OBJECT;
        this.body.setCollisionMask(me.collision.types.NPC_OBJECT
                | me.collision.types.ENEMY_OBJECT
                | me.collision.types.PLAYER_OBJECT);

        this.body.gravity = 0;
        this.owner = owner;

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
            case "custom":
                this.body.vel = vel;
                this.moodDamage = moodDamage;
                this.moneyDamage = moneyDamage;
                break;
            console.log(this.body.vel)
        }
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
        return true;
    },

    collideHandler : function (response) {
        if (response.b.name == 'enemy' && this.owner == "player") {
            me.game.world.removeChild(this);
            // TODO MAKE THIS WORK
            response.b.hitPoints -= 1;
            console.log("Ouch! Enemy HP: " + response.b.hitPoints.toString());
        } else if (response.b.name == 'mainplayer' && this.owner == "enemy") {
            me.game.world.removeChild(this);
            console.log("YOU GOT HIT!!!!")
            game.data.stateManager.subMoney(this.moneyDamage);
            game.data.stateManager.subDepression(this.moodDamage);
        }
    }
});

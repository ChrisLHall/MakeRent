/** The enemy. Can be created in a TMX or manually. */


game.EnemyEntity = me.Entity.extend({

    
    /** Constructor for enemies. Settings is optional. */
    init: function(x, y, settings) {
        // Default value for settings.
        settings = settings || {
                width: 33,
                height: 33,
                image: "master",
                name: "enemy",
                spritewidth: 33,
                spriteheight: 33
        };
        this._super(me.Entity, 'init', [x, y, settings]);
        this.z = 4;

        if (this.body.shapes.length == 0) {
            this.body.addShape(new me.Rect(0, 0, this.width, this.height));
        }
        this.body.collisionType = me.collision.types.ENEMY_OBJECT;
        this.body.setCollisionMask(me.collision.types.NPC_OBJECT
                | me.collision.types.PLAYER_OBJECT
                | me.collision.types.PROJECTILE_OBJECT);
        this.body.onCollision = this.onCollision.bind(this);

        this.renderable.addAnimation("walk", [0, 1]);
        this.renderable.setCurrentAnimation("walk");

        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;
        this.body.gravity = 0;
        this.flipX(true);
        this.canFire = true;
        this.lastFire = 0;

        this.hitPoints = 3;

        this.SPEED = 2;
        this.changeDir([this.SPEED, 0]);
    },

    /** Collision event function, where E is the me.collision.ResponseObject. */
    onCollision: function (e) {
        if (e.b.name == "obstacle") {
            var vec = e.overlapV.clone().negateSelf();
            this.pos.add(vec);
            this.updateBounds();
        }
    },

    resetFire: function() {
            this.canFire = true;
        },

    update: function(dt) {
        this.keepInBounds();
        this.body.update(dt);
        var collided = me.collision.check(this, true,
                this.onCollision.bind(this), true);

        this._super(me.Entity, 'update', [dt]);

        if (this.hitPoints <= 0 && this.alive) {
            me.game.world.removeChild(this);
            var money = new game.MoneyEntity(this.pos.x, this.pos.y, {})
            me.game.world.addChild(money);
            this.alive = false;
            game.data.stateManager.addDepression(0.5);
        }

        if (this.canFire && game.data.playerPos) {
            me.timer.clearTimeout(this.lastFire)
            test = new me.Vector2d(game.data.playerPos.x - this.pos.x, game.data.playerPos.y - this.pos.y)
            me.game.world.addChild(new game.BulletEntity(this.pos.x + 5, this.pos.y + 5, {}, "custom", "enemy", test.normalize().scale(10), 1, .1));
            this.canFire = false;
            bullet = this;
            this.lastFire = me.timer.setTimeout(bullet.resetFire.bind(this), 1000 + 1000 * Math.random());
        }

        return true;
    },

    changeDir: function(startSpeed) {
        if (!this.alive) {
            return;
        }
        // Choose the direction randomly from tuples. This is kind of stupid but
        // gets the job done.
        var directions = [
                [this.SPEED, 0],
                [-this.SPEED, 0],
                [0, this.SPEED],
                [0, -this.SPEED]
                ];
        var choice = [0, 0];
        if (startSpeed) {
            choice = startSpeed;
        } else {
            choice = directions[Math.floor(Math.random() * 4)];
        }

        //console.log("Change dir! alive = " + choice.toString());
        this.body.vel.x = choice[0];
        this.body.vel.y = choice[1];
        return me.timer.setTimeout(this.changeDir.bind(this),
                1000 + 500 * Math.random());
    },

    keepInBounds: function() {
        if (this.left < me.game.viewport.left) {
            this.pos.x = me.game.viewport.pos.x;
            this.body.vel.x = game.data.gameplayManager.SCROLL_SPEED;
            this.updateBounds();
        } else if (this.right > me.game.viewport.right) {
            //If off-screen to the right, just walk left
            this.body.vel.x = -this.SPEED;
            this.body.vel.y = 0;
            //this.pos.x = me.game.viewport.width - this.spritewidth;
        }
        if (this.top < me.game.viewport.top) {
            this.pos.y = me.game.viewport.pos.y;
            this.body.vel.y = 0;
            this.updateBounds();
        } else if (this.bottom > me.game.viewport.bottom) {
            this.pos.y = me.game.viewport.bottom - this.height;
            this.body.vel.y = 0;
            this.updateBounds();
        }
    }
});

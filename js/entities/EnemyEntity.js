/** The enemy. Can be created in a TMX or manually. */


game.EnemyEntity = me.Entity.extend({

    
    /** Constructor for enemies. Settings is optional. */
    init: function(x, y, dir, settings) {
        // Default value for settings.
        settings = settings || {
                width: 33,
                height: 33,
                image: "bossenemy",
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
        this.renderable.addAnimation("fire", [2]);

        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;
        this.body.gravity = 0;
        this.flipX(true);
        this.canFire = false;
        this.lastFire = me.timer.setTimeout(this.resetFire.bind(this), 500);
        game.data.gameplayManager.enemyCount += 1;
        game.data.gameplayManager.spawnedEnemies += 1;
        this.hitPoints = 3;
        this.SPEED = 2;
        me.timer.setTimeout(this.changeDir.bind(this),
                1000 + 500 * Math.random());
        this.walkcycle = 0;
        /*switch (dir) {
            case "right":
                this.changeDir([this.SPEED, 0]);
                break;
            case "left":
                this.changeDir([-this.SPEED, 0]);
                break;
            case "up":
                this.changeDir([0, -this.SPEED]);
                break;
            case "down":
                this.changeDir([0, this.SPEED]);
                break;
        }
        console.log(this.body.vel)*/
    },

    /** Collision event function, where E is the me.collision.ResponseObject. */
    onCollision: function (e) {
        if (e.b.name == "obstacle") {
            var vec = e.overlapV.clone().negateSelf();
            this.pos.add(vec);
            this.changeDir(true)
            this.updateBounds();
        }
    },

    resetFire: function() {
            this.canFire = true;
        },

    update: function(dt) {
        if (this.body.vel.x < 0) {
            this.flipX(false);
        } else if(this.body.vel.x > 0) {
            this.flipX(true);
        }
        this.keepInBounds();
        this.body.update(dt);
        var collided = me.collision.check(this, true,
                this.onCollision.bind(this), true);

        this._super(me.Entity, 'update', [dt]);

        if (this.hitPoints <= 0 && this.alive) {
            me.timer.clearTimeout(this.walkcycle)
            me.game.world.removeChild(this);
            var money = new game.MoneyEntity(this.pos.x, this.pos.y, {})
            me.game.world.addChild(money);
            this.alive = false;
            game.data.stateManager.addDepression(0.5);
            game.data.gameplayManager.enemyCount -= 1;
        }

        if (this.canFire && game.data.playerPos) {
            me.timer.clearTimeout(this.lastFire)
            test = new me.Vector2d(game.data.playerPos.x - this.pos.x, game.data.playerPos.y - this.pos.y)
            bullet = this;
            this.renderable.setCurrentAnimation("fire");
            this.body.vel = new me.Vector2d(0,0);
            this.walkcycle = me.timer.setTimeout(this.resumeWalk.bind(this), 500);
            me.game.world.addChild(new game.EnemyBullet(this.pos.x + 5, this.pos.y + 5, {}, test.normalize().scale(5), 1, .1));
            this.canFire = false;
            this.lastFire = me.timer.setTimeout(bullet.resetFire.bind(this), 1000 + 1000 * Math.random());
        }

        return true;
    },

    resumeWalk: function() {
        if (this.alive) {
            this.renderable.setCurrentAnimation("walk");
        }
        this.changeDir(true);
    },

    changeDir: function(notimer) {
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
        choice = directions[Math.floor(Math.random() * 4)];

        //console.log("Change dir! alive = " + choice.toString());
        this.body.vel.x = choice[0];
        this.body.vel.y = choice[1];
        if (notimer) return;
        return me.timer.setTimeout(this.changeDir.bind(this),
                1000 + 500 * Math.random());
    },

    keepInBounds: function() {
        if (this.left < me.game.viewport.left) {
            this.pos.x = me.game.viewport.pos.x;
            this.body.vel.x = this.SPEED;
            this.updateBounds();
        } else if (this.right > me.game.viewport.right) {
            //If off-screen to the right, just walk left
            this.body.vel.x = -this.SPEED;
            this.body.vel.y = 0;
            //this.pos.x = me.game.viewport.width - this.spritewidth;
        }
        if (this.top < me.game.viewport.top) {
            this.pos.y = me.game.viewport.pos.y;
            this.body.vel.y = this.SPEED;
            this.updateBounds();
        } else if (this.bottom > me.game.viewport.bottom) {
            this.pos.y = me.game.viewport.bottom - this.height;
            this.body.vel.y = -this.SPEED;
            this.updateBounds();
        }
    }
});

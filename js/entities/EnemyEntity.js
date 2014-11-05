/** The enemy. Can be created in a TMX or manually. */
game.EnemyEntity = me.Entity.extend({
    /** Constructor for enemies. Settings is optional. */
    init: function(x, y, settings) {
        // Default value for settings.
        settings = settings || {
                width: 28,
                height: 28,
                image: "master",
                name: "enemy",
                spritewidth: 28,
                spriteheight: 28
        };
        this._super(me.Entity, 'init', [x, y, settings]);
        this.z = 4;

        if (this.body.shapes.length == 0) {
            this.body.addShape(new me.Rect(0, 0, this.width, this.height));
        }
        this.body.collisionType = me.collision.types.ENEMY_OBJECT;
        this.body.setCollisionMask(me.collision.types.WORLD_SHAPE
                | me.collision.types.PLAYER_OBJECT);
        this.body.onCollision = this.onCollision.bind(this);

        this.renderable.addAnimation("walk", [0, 1]);
        this.renderable.setCurrentAnimation("walk");

        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;
        this.body.gravity = 0;
        this.flipX(true);

        this.hitPoints = 3;

        this.SPEED = 2;
        this.changeDir([this.SPEED, 0]);
    },

    /** Collision event function, where E is the me.collision.ResponseObject. */
    onCollision: function (e) {
        if (e) {
            if (e.b.name == "obstacle") {
                var vec = e.overlapV.clone().negateSelf();
                this.pos.add(vec);
                this.updateBounds();
            }
        }
    },

    update: function(dt) {
        this.body.update(dt);
        this.keepInBounds()
        var collided = me.collision.check(this, true, this.onCollision.bind(this), true);

        this._super(me.Entity, 'update', [dt]);

        return true;
    },

    changeDir: function(startSpeed) {
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

        console.log("Change dir! alive = " + choice.toString());
        this.body.vel.x = choice[0];
        this.body.vel.y = choice[1];
        if (this.alive) {
            me.timer.setTimeout(this.changeDir.bind(this),
                    1000 + 500 * Math.random());
        }
    },

    keepInBounds: function() {
        if (this.pos.x < me.game.viewport.pos.x) {
            this.pos.x = me.game.viewport.pos.x;
        } else if (this.pos.x > me.game.viewport.pos.x
                + me.game.viewport.width - this.spritewidth) {
            this.pos.x = me.game.viewport.width - this.spritewidth;
        }
        if (this.pos.y < me.game.viewport.pos.y) {
            this.pos.y = me.game.viewport.pos.y;
        } else if (this.pos.y > me.game.viewport.pos.y
                + me.game.viewport.height - this.spriteheight) {
            this.pos.y = me.game.viewport.height - this.spriteheight;
        }
        this.updateBounds()
    }
});

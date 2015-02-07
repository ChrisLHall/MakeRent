/** Object to manage scrolling, enemy spawns, items, obstacles, etc. */
game.GameplayManager = me.Entity.extend({
    init: function() {
        settings = {
                width: 16,
                height: 16,
                image: "none",
                name: "GameplayManager",
                spritewidth: 16,
                spriteheight: 16
        };
        this._super(me.Entity, 'init', [0, 0, settings]);
        this.body.addShape(new me.Rect(this.y, this.x, this.width, this.height));

        this.body.collisionType = me.collision.types.NONE;
        this.body.setCollisionMask(me.collision.types.NONE);

        this.alwaysUpdate = true;
        this.body.gravity = 0;
        // TODO more testing
        // jk this absolutely does not work...ok now maybe?
        this.SCROLL_SPEED = 0.6;
        this.transition = false;
        this.direction = "right";
        this.spawning = true;
        this.enemyCount = 0;
        this.spawnedEnemies = 0;
        console.log(this.enemyCount)
        this.body.vel.x = 0;
        me.timer.setTimeout(this.spawn.bind(this), 3000);
    },



    spawn: function() {
        var r1 = Math.floor(Math.random() * 15);
        var r2 = Math.floor(Math.random() * 15);
        while (r2 == r1) {
            r2 = Math.floor(Math.random() * 15);
        }

        switch (this.direction) {
            case "right":
                var x1 = x2 = me.game.viewport.right;
                var y1 = r1 * 32 + me.game.viewport.top;
                var y2 = r2 * 32 + me.game.viewport.top;
                var newvelx = 2;
                var newvely = 0;
                break;
            case "left":
                var x1 = x2 = me.game.viewport.left - 32;
                var y1 = r1 * 32 + me.game.viewport.top;
                var y2 = r2 * 32 + me.game.viewport.top;
                var newvelx = -2;
                var newvely = 0;
                break;
            case "up":
                var x1 = r1 * 43 + me.game.viewport.left;
                var x2 = r2 * 43 + me.game.viewport.left;
                var y1 = y2 = me.game.viewport.top - 32;
                var newvelx = 0;
                var newvely = -2;
                break;
            case "down":
                var x1 = r1 * 43 + me.game.viewport.left;
                var x2 = r2 * 43 + me.game.viewport.left;
                var y1 = y2 = me.game.viewport.bottom;
                var newvelx = 0;
                var newvely = 2;
                break;
        };
        if (this.transition) {
            me.game.world.addChild(new game.ObstacleEntity(x1, y1));
            me.game.world.addChild(new game.ObstacleEntity(x2, y2));
        } else {
            if (this.spawnedEnemies < 6 && this.spawning) {
                me.game.world.addChild(new game.EnemyEntity(x1, y1, this.direction));
            } else {
                this.spawning = false;
            }
            if (this.enemyCount < 1) {
                this.transition = true;
                this.body.vel.y = newvely;
                this.body.vel.x = newvelx;
                me.timer.setTimeout(this.stopTransition.bind(this), 6000);
            }
        }
        me.timer.setTimeout(this.spawn.bind(this), 1000);
        
    },

    stopTransition: function() {
        console.log("help")
        this.transition = false;
        this.spawning = true;
        this.spawnedEnemies = 0;
        this.body.vel.x = 0;
        this.body.vel.y = 0;
        switch (Math.floor(Math.random() * 4)) {
            case 0:
                this.direction = "right";
                break;
            case 1:
                this.direction = "left";
                break;
            case 2:
                this.direction = "up";
                break;
            case 3:
                this.direction = "down";
                break;
        };
    },

    /** Update the block's animation frame based on mood. Destroy it if it is
     out of bounds. */
    update: function(dt) {
        this.body.update(dt);
        me.game.viewport.pos.x = this.pos.x;
        me.game.viewport.pos.y = this.pos.y;
        me.game.viewport.updateBounds();
        return false;
    }
});

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
        this.spawning = true;
        this.enemyCount = 0;
        this.spawnedEnemies = 0;
        console.log(this.enemyCount)
        this.body.vel.x = 0;
        me.timer.setTimeout(this.spawn.bind(this), 3000);
    },



    spawn: function() {
        var y1 = Math.floor(Math.random() * 15);
        var y2 = Math.floor(Math.random() * 15);
        while (y2 == y1) {
            y2 = Math.floor(Math.random() * 15);
        }
        var y3 = Math.floor(Math.random() * 15);
        while (y3 == y1 || y3 == y2) {
            y3 = Math.floor(Math.random() * 15);
        }
        var y4 = Math.floor(Math.random() * 15);
        while (y4 == y1 || y4 == y2 || y4 == y3) {
            y4 = Math.floor(Math.random() * 15);
        }

        var x = me.game.viewport.right;
        if (this.transition) {
            me.game.world.addChild(new game.ObstacleEntity(x, y1 * 32));
            me.game.world.addChild(new game.ObstacleEntity(x, y2 * 32));
        } else {
            if (this.spawnedEnemies < 6 && this.spawning) {
                me.game.world.addChild(new game.EnemyEntity(x, y3 * 32));
            } else {
                this.spawning = false;
            }
            if (this.enemyCount < 1) {
                this.transition = true;
                this.body.vel.x = 2;
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

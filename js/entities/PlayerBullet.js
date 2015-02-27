/** Bullets shot by player */

game.PlayerBullet = game.BulletEntity.extend({

	init: function(x, y, settings, dir) {
		settings.image = "waterbullet";
		settings.spritewidth = settings.width = 26;
    	settings.spriteheight = settings.height = 19;
    	this._super(game.BulletEntity, 'init', [x, y, settings]);
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
            };

        this.renderable.addAnimation("fly", [0, 1, 2]);
        this.renderable.setCurrentAnimation("fly");
    },

    collideHandler : function (response) {
    	if (response.b.name == 'enemy') {
            me.game.world.removeChild(this);
            response.b.hitPoints -= 1;
            console.log("Ouch! Enemy HP: " + response.b.hitPoints.toString());
        }
    },
});
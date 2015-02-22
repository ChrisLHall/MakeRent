/** Bullets shot by an enemy. */

game.EnemyBullet = game.BulletEntity.extend({

	init: function(x, y, settings, vel, moodDamage, moneyDamage) {
		settings.image = "enemybullet";
		settings.spritewidth = settings.width = 21;
    	settings.spriteheight = settings.height = 11;
    	this._super(game.BulletEntity, 'init', [x, y, settings]);
    	this.body.vel = vel;
        this.moodDamage = moodDamage;
        this.moneyDamage = moneyDamage;

        this.renderable.addAnimation("fly", [0, 1, 2]);
        this.renderable.setCurrentAnimation("fly");
    },

    collideHandler : function (response) {
    	if (response.b.name == 'mainplayer') {
            me.game.world.removeChild(this);
            console.log("YOU GOT HIT!!!!")
            game.data.stateManager.subMoney(this.moneyDamage);
            game.data.stateManager.subDepression(this.moodDamage);
        }
    },
});
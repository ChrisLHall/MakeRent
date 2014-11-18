/** MONEY!!!!! */

game.MoneyEntity = me.Entity.extend({


	init: function(x, y, settings) {
		settings.image = "money-bag";
		settings.spritewidth = settings.width = settings.spriteheight = settings.height = 15;
		this._super(me.Entity, 'init', [x, y, settings]);
		this.body.addShape(new me.Rect(0, 0, this.width, this.height));
		this.z = 4;
		this.body.gravity = 0;
		this.body.onCollision = this.onCollision.bind(this);
	},

	onCollision: function(e) {

		if (e.a.name == "mainplayer") {
			this.body.setCollisionMask(me.collision.types.NO_OBJECT);
        	// remove it
        	me.game.world.removeChild(this);
        	game.data.money += 1;
        	console.log("Money Get: " + game.data.money + "$");
		}
		
	}

});
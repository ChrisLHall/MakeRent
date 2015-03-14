/** Money/time remaining bar, on the HUD. */

game.MoneyTimeBar = game.MoneyTimeBar || {};

game.MoneyTimeBar.Bar = me.Container.extend({
    /** Create a money bar at X, Y of LENGTH bar units (2 px each). */
    init: function(x, y, length) {
        // call the constructor
        this._super(me.Container, "init");
        
        // non collidable
        this.collidable = false;
        
        this.autoSort = false;
        
        this.length = length;
        
        this.units = [];
        for (var i = 0; i < length; i++) {
            this.units[i] = new game.MoneyTimeBar.BarUnit(x + 4*i, y);
            this.addChild(this.units[i]);

            if (i == 0) {
                this.units[i].makeFirst();
            } else if (i == length - 1) {
                this.units[i].makeLast();
            }
        }
		
		this.arrow = new game.MoneyTimeBar.Arrow(x, y + 8, this.length * 4);
		this.addChild(this.arrow);
    },
    
    moveTo: function(x, y) {
        this.pos.set(x, y);
        for (var i = 0; i < this.length; i++) {
            this.units[i].pos.set(x + 4*i, y);
        }
		this.arrow.moveTo(x, y);
    },
    
    update: function () {
        this._super(me.Container, "update");
        this.setFraction(game.data.money / game.data.requiredRent);
		this.setArrowFrac(0.5); // TODO TIMER
    },

    /** Set FRACTION (between 0.0 to 1.0) of the bar to be filled. */
    setFraction: function (fraction) {
        for (var i = 0; i < this.length; i++) {
			var thisFraction = i / this.length;
            if (thisFraction <= fraction) {
                this.units[i].setFilled(true);
            } else {
                this.units[i].setFilled(false);
            }
        }
    },
	
	setArrowFrac: function (fraction) {
		this.arrow.setFraction(fraction);
	},
});

game.MoneyTimeBar.BarUnit = me.AnimationSheet.extend({
    /** Creates a new time bar unit at position X, Y. FIRSTORLAST must be either
     * "first", "last", or undefined. */
    init: function (x, y) {
        this._super(me.AnimationSheet, "init", [x, y, {image: me.loader.getImage("timebar"), spritewidth: 4, spriteheight: 8}]);
	
        this.floating = true;
	
        this.filled = false;
        
        this.firstOrLast = "";
	
        this.addAnimation("off", [1]);
        this.addAnimation("on", [4]);
        this.addAnimation("first_off", [0]);
        this.addAnimation("first_on", [3]);
        this.addAnimation("last_off", [2]);
        this.addAnimation("last_on", [5]);
        this.setCurrentAnimation("off");
    },
    
    makeFirst: function () {
        this.firstOrLast = "first_";
    },
    
    makeLast: function () {
        this.firstOrLast = "last_";
    },
    
    /** Sets whether this unit ISFILLED or is empty. */
    setFilled: function (isFilled) {
        var animStr = "off";
        if (isFilled) {
            animStr = "on";
        }
        
        this.setCurrentAnimation(this.firstOrLast + animStr);
    },
});

game.MoneyTimeBar.Arrow = me.AnimationSheet.extend({
    /** Creates a new time bar unit at position X, Y. LENGTHPIXELS is the
	 * length of the whole bar. */
    init: function (x, y, lengthPixels) {
        this._super(me.AnimationSheet, "init", [x, y, {image: me.loader.getImage("timearrow"), spritewidth: 8, spriteheight: 8}]);
	
        this.floating = true;
		
		this.originalPos = {x: x, y: y};
		this.currentFraction = 0;
		this.lengthPixels = lengthPixels;
		
		this.anchorPoint = new me.Vector2d(0.5, 0.5);
	
        this.addAnimation("arrow", [0]);
        this.setCurrentAnimation("arrow");
    },
	
	moveTo: function(x, y) {
		this.originalPos.x = x;
		this.originalPos.y = y;
        this.setFraction(this.currentFraction);
    },
    
    /** Sets whether this unit ISFILLED or is empty. */
    setFraction: function (fraction) {
		this.currentFraction = this.fraction;
        this.pos.set(this.originalPos.x + this.lengthPixels * fraction, this.originalPos.y);
    },
});

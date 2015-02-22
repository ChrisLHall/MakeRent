/** Money/time remaining bar, on the HUD. */

game.MoneyTimeBar = game.MoneyTimeBar || {};

// TODO @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

game.MoneyTimeBar.Bar = me.ObjectContainer.extend({
    /** Create a money bar at X, Y of LENGTH bar units (2 px each). */
    init: function(x, y, length) {
	// call the constructor
	this.parent(x, y);
	
	// non collidable
	this.collidable = false;
	
        this.autoSort = false;
	
        this.length = length;
	
        this.units = [];
        for (var i = 0; i < length; i++) {
	    this.units[i] = new game.MoneyTimeBar.BarUnit(x + 2*i, y);
	    this.addChild(this.units[i]);

	    if (i == 0) {
		this.units[i].makeFirst();
	    } else if (i == length - 1) {
		this.units[i].makeLast();
	    }
        }
    },
    
    moveTo: function(x, y) {
        this.pos.set(x, y);
        for (var i = 0; i < this.length; i++) {
            this.units[i].pos.set(x + 2*i, y);
        }
    },

    /** Set FRACTION (between 0.0 to 1.0) of the bar to be filled. */
    setFraction: function(fraction) {
        for (var i = 0; i < this.length; i++) {
	    var thisFraction = i / this.length;
            if (thisFraction <= fraction) {
                this.units[i].setFilled(true);
            } else {
                this.unitss[i].setFilled(false);
            }
        }
    },
});

game.MoneyTimeBar.BarUnit = me.AnimationSheet.extend({
    /** Creates a new fancytext character of type TYPE at position X, Y. */
    init: function(x, y, index) {
	this.parent(x, y, me.loader.getImage("yellowfont"), 8, 8); // TODO
	
        this.floating = true;
	
        this.filled = false;
	
        this.addAnimation("off", [1]);
	this.addAnimation("on", [4]);
	this.addAnimation("first_off", [0]);
	this.addAnimation("first_on", [3]);
	this.addAnimation("last_off", [2]);
	this.addAnimation("last_on", [5]);
        this.setCurrentAnimation("off");
    },

    /** Sets whether this unit ISFILLED or is empty. */
    setFilled: function(isFilled) { // TODO
        if (c != this.character) {
            this.character = c;
            this.setCurrentAnimation(c);
        }
    },
});

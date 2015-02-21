/** Money/time remaining bar, on the HUD. */

game.MoneyTimeBar = game.MoneyTimeBar || {};

// TODO @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

game.FancyText.String = me.ObjectContainer.extend({
    /** Create a fancy string at position (x, y) with maximum length MAXLENGTH.
     *  MAXLENGTH is the number of characters that will be created. */
	init: function(x, y, maxLength) {
		// call the constructor
		this.parent(x, y);

		// non collidable
		this.collidable = false;

        this.autoSort = false;

        this.length = maxLength;

        this.characters = [];
        for (var i = 0; i < maxLength; i++) {
            this.characters[i] = new game.FancyText.Character(x + 8*i, y);
            this.addChild(this.characters[i]);
        }
	},

    moveTo: function(x, y) {
        this.pos.set(x, y);
        for (var i = 0; i < this.length; i++) {
            this.characters[i].pos.set(x + 8*i, y);
        }
    },

    setString: function(str) {
        for (var i = 0; i < this.length; i++) {
            if (i < str.length) {
                this.characters[i].setChar(str[i]);
            } else {
                this.characters[i].setChar(" ");
            }
        }
    },
});

game.FancyText.Character = me.AnimationSheet.extend({
    /** Creates a new fancytext character of type TYPE at position X, Y. */
    init: function(x, y) {
		this.parent(x, y, me.loader.getImage("yellowfont"), 8, 8);

        this.floating = true;

        this.character = " ";

        var start = " ".charCodeAt(0);
        var end = "~".charCodeAt(0);
        for (var i = start; i <= end; i++) {
            this.addAnimation(String.fromCharCode(i), [i - start]);
        }
        this.setCurrentAnimation(" ");
    },

    setChar: function(c) {
        if (c != this.character) {
            this.character = c;
            this.setCurrentAnimation(c);
        }
    },
});

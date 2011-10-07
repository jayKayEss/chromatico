function Colortoy(canvas) {
    this.snippets = new TextSnippets();
    this.randColors = null;
    this.randDrawing = null;
    this.hexchars = "0123456789ABCDEF";
    this.fonts = ['sans', 'sans-serif', 'monospace'];
    this.styles = ['', 'bold', 'italic'];
    this.sizes = [
        [500, 500], 
        [320, 480], 
        [640, 960], 
        [768, 1024], 
        [1024, 768],
        [1440, 900],
        [1600, 1000],
        [1600, 1200],
        [1920, 1200]
    ];

    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.width = canvas.getAttribute('width');
    this.height = canvas.getAttribute('height');
    this.colors = [];
    this.numColors = 0;
    this.ptrColors = 0;

    console.log(this.width+':'+this.height);
}

Colortoy.prototype = {
    changeSize: function(n) {
        var self = this;
        var tuple = this.sizes[n];
        var width = tuple[0];
        var height = tuple[1];
        var displayWidth;
        var displayHeight;

        if (width > height) {
            displayWidth = 500;
            displayHeight = Math.round(height * (displayWidth / width));
        } else {
            displayHeight = 500;
            displayWidth = Math.round(width * (displayHeight / height));
        }

        $(this.canvas).animate({
            height: displayHeight,
            width: displayWidth
        }, {
            step: function(now, fx) {
                if (fx.prop == 'width') {
                    self.width = Math.round(now/2);
                } else {
                    self.height = Math.round(now/2);
                }

                self.canvas.setAttribute('width', self.width);
                self.canvas.setAttribute('height', self.height);
                self.redraw();
            },

            complete: function(){
                self.width = width;
                self.height = height;
                self.canvas.setAttribute('width', width);
                self.canvas.setAttribute('height', height);
                self.redraw();
            }
        });
   },

    shuffle: function() {
        this.randColors = new RandomNumbers(100);
        this.populateColors();
        this.compose();
    },

    redraw: function() {
//        console.log('REDRAW: '+this.width+':'+this.height);
        this.randDrawing.reset();
        this.setMargins();
        this.setBackground();
        this.drawText();
    },

    compose: function() {
        this.randDrawing = new RandomNumbers(100);
        this.redraw();
    },

    setBackground: function() {
        this.ptrColors = this.randNum(this.numColors-1, 0);
        this.ctx.fillStyle = this.nextColor();
        this.ctx.fillRect(0, 0, this.width, this.height);

        var numRect = this.randNum(3, 0);
        for (var i=0; i<numRect; i++) {
            var x = this.getX();
            var y = this.getY();
            var w = this.getW();
            var h = this.getH();
            var c = this.nextColor();

            this.ctx.fillStyle = c;
            this.ctx.fillRect(x, y, w, h);
        }
    },

    drawText: function() {
        var snips = this.randNum(5, 3);
        for (var i=0; i<snips; i++) {
            var text = this.snippets.getRandom(this.randDrawing);
            var color = this.nextColor();
            this.ctx.fillStyle = color;
            var h = this.getTextHeight();
            var x = this.getX();
            var y = this.getY();

//            console.log('TEXT: '+x+','+y+' '+h);

            this.ctx.font = this.getFontString(h);
            this.ctx.textBaseline = 'top';
            this.renderMultilineText(text, x, y, h);
        }
    },

    renderMultilineText: function(text, x, y, h) {
        var lines = text.split("\n");
        var liney = y;
        for (var i in lines) {
            var line = lines[i];
            this.ctx.fillText(line, x, liney);
            liney += h;
        }
    },

    getFontString: function(h) {
        var style = this.styles[Math.floor(this.randDrawing.next() * this.styles.length)];
        var font = this.fonts[Math.floor(this.randDrawing.next() * this.fonts.length)];
        return style+" "+h+"px "+font;
    },

    getX: function() {
        return this.randNum(
            this.width - this.margin_x,
            0 - this.margin_x
        );
    },

    getY: function() {
        return this.randNum(
            this.height - this.margin_y,
            0 - this.margin_y
        );
    },

    getW: function() {
        return this.randNum(
            Math.floor(this.width*1.3), 
            Math.floor(this.width*.05)
        );
    },

    getH: function() {
        var min = this.height*.05;
        var max = this.height*1.3;
        return Math.floor(
            Math.pow(this.randDrawing.next(), 1) * (max-min) + min
        ); 
    },

    getTextHeight: function() {
        var min = this.height*.05;
        var max = this.height*1.3;
        return Math.floor(
            Math.pow(this.randDrawing.next(), 1) * (max-min) + min
        ); 
    },

    setMargins: function() {
        this.sqrsize = Math.floor(Math.sqrt(this.width * this.height));
        this.margin = Math.floor(this.sqrsize*.1);
        this.margin_x = Math.floor(this.width*.1);
        this.margin_y = Math.floor(this.height*.1);
    },

    populateColors: function() {
        $('#theColors').empty();
        this.colors = [];

        this.numColors = Math.floor(this.randColors.next() * 2 + 3);
        for (var i=0; i<this.numColors; i+=1) {
            var c = this.genRandColor();
            this.colors[i] = c;
            var item = $('<li>'+c+'</li>');
            item.css('background-color', c);
            $('#theColors').append(item);
        }
    },

    nextColor: function() {
        var ret = this.colors[this.ptrColors];
        this.ptrColors++;
        if (this.ptrColors >= this.numColors) {
            this.ptrColors = 0;
        }
        return ret;
    },

    randNum: function(max, min) {
        if (min == undefined) min = 1;
        var n = max-min;
        var ret = Math.round(this.randDrawing.next() * n + min);

        return ret;
    },

    genRandColor: function() {
        ret = '#';
        var hex;

        for (var i=0; i<3; i++) {
            var n = Math.floor(
                Math.pow(this.randColors.next(), 1)
                * 256
            );
            hex = n.toString(16);

            while (hex.length < 2) {
                hex = '0' + hex;
            }

            ret += hex;
        }

//        console.log(ret);
        return ret;
    },

    download: function() {
        var data = this.canvas.toDataURL('image/png');
        $('#imagedata').val(data);
        $('#downloadForm').get(0).submit();
    }
};

function TextSnippets() {
    this.text = [
        "||||||||||++++++++++||||||||||++++++++++\n"+
        "++++++++++||||||||||++++++++++||||||||||\n"+
        "||||||||||++++++++++||||||||||++++++++++\n"+
        "++++++++++||||||||||++++++++++||||||||||",

        "& & & & & & & &",

        "* * * * * * * * *",

        "Ж",

        "Jackdaws love my big sphinx of quartz.",

        "Wafting zephyrs quickly vexed jumbo.",

        "!!!!\n"+
        "!!!!\n"+
        "????\n"+
        "????\n"+
        "!!!!\n"+
        "!!!!\n"+
        "????\n"+
        "????\n"+
        "!!!!\n"+
        "!!!!",

        "“” „”  »«",

        "  \\ \\ \\ \\ \\ \\ \\ \\ \\ \\\n"+
        " \\ \\ \\ \\ \\ \\ \\ \\ \\ \\\n"+
        "      \\ \\ \\ \\ \\ \\ \\ \\ \\ \\\n"+
        "       \\ \\ \\ \\ \\ \\ \\ \\ \\ \\\n"+
        "    \\ \\ \\ \\ \\ \\ \\ \\ \\ \\\n"+
        "     \\ \\ \\ \\ \\ \\ \\ \\ \\ \\\n",

        "}}}}} {{{{{",
        "1 1 2 3 5 8 13 21 34 55 89 144 233 377 610 987 1,597 2,584 4,181 6,765 10,946 17,711 28,657 46,368 75,025 121,393",
        "++++----++++----++++----++++----++++----++++----",
        "ETAOIN SHRDLU",

        "#",

        "Ñ",

        "@",

        "-··· --·- ----- -·- -· ·- ··- -·· ·--· ·-- - ·--· -··- --·· -··- ·-·-·- --· ·· · -·· ----- ··· --- - ··-· ·--- ·-·· ····- ··--·· --- ·· -·· --·· ···-- --· ·· ·- -··- -·-- ---",

        "3",

        ">< <> >>",
        "*** *** *** ***",
        "** ** ** ** **",
        "* ** *** **** ***** ******",

        "((()))",
        "[[[]]]",

        "Ñ",
        "Y",
        "4",
        "###",
        "8",

        "å",
        "ß",
        "^",

        "?",
        "∂",
        "ƒ",
        "©",

        "Ø",
        "K",
        "Q",

        "0000 0001 0010 0011\n0100 0101 0110 0111\n1000 1001 1010 1011\n1100 1101 1110 1111"
    ];
}

TextSnippets.prototype = {

    getRandom: function(rand) {
        var i = Math.floor(rand.next() * this.text.length);
//        console.log(i+' '+this.text[i]);
        return this.text[i];
    }

};


function RandomNumbers(n) {
    this.numbers = [];
    this.ptr = 0;
    this.populate(n);
};

RandomNumbers.prototype = {

    populate: function(n) {
        for (var i=0; i<n; i++) {
            this.numbers[i] = Math.random();
        }

//        console.log(this.numbers.length);
    },

    reset: function() {
        this.ptr = 0;
    },

    next: function() {
        if (this.ptr < this.numbers.length) {
            var ret = this.numbers[this.ptr];
            this.ptr++;
            return ret;
        } else {
            console.log("Out of numbers!");
            return Math.random();
        }
    }

};

$('document').ready(function(){
    var colortoy = new Colortoy($('#theCanvas').get(0));

    $('#shuffle').click(function(event){
        colortoy.shuffle();
    });

    $('#download').click(function(event){
        colortoy.download();
    });

    $('#recompose').click(function(event){
        colortoy.compose();
    });

    $('#sizeMenu').change(function(event){
        colortoy.changeSize(event.currentTarget.value);
    });

    colortoy.shuffle();
});




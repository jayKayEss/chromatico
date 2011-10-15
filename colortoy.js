function Colortoy(canvas) {
    this.snippets = new TextSnippets();
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
    this.colors = undefined;
    this.numColors = 0;
    this.displayMax = 500;

    this.minColors = 2;
    this.maxColors = 5;
    this.numColors = 3;
}

Colortoy.prototype = {

    changeSizePreset: function(n) {
        var tuple = this.sizes[n];
        var width = tuple[0];
        var height = tuple[1];
        this.changeSize(width, height); 
    },

    changeSize: function(width, height) {
        var self = this;
        var displayWidth;
        var displayHeight;

        var currentDisplayWidth = $(this.canvas).width();
        var currentDisplayHeight = $(this.canvas).height();

//        console.log("WxH "+width+':'+height);
        if (width > height) {
            displayWidth = Math.min(width, this.displayMax);
            displayHeight = Math.round(height * (displayWidth / width));
//            console.log("W>H "+displayWidth+':'+displayHeight);
        } else {
            displayHeight = Math.min(height, this.displayMax);
            displayWidth = Math.round(width * (displayHeight / height));
//            console.log("W<H "+displayWidth+':'+displayHeight);
        }

        var marginX = Math.round((this.displayMax - displayWidth) / 2);
        var marginY = Math.round((this.displayMax - displayHeight) / 2);

        if (displayWidth != currentDisplayWidth || displayHeight != currentDisplayHeight) {
            $(this.canvas).animate({
                top: marginY,
                left: marginX,
                height: displayHeight,
                width: displayWidth,
           }, {
                step: function(now, fx) {
                    if (fx.prop == 'width') {
                        self.width = Math.round(now/2);
                    } else if (fx.prop == 'height') {
                        self.height = Math.round(now/2);
                    }

                    if (fx.prop == 'left') {
                        self.canvas.setAttribute('width', self.width);
                        self.canvas.setAttribute('height', self.height);
                        self.redraw();
                    }
                },

                complete: function(){
                    self.width = width;
                    self.height = height;
                    self.canvas.setAttribute('width', width);
                    self.canvas.setAttribute('height', height);
                    self.redraw();
                }
            });
        } else {
            this.width = width;
            this.height = height;
            this.canvas.setAttribute('width', width);
            this.canvas.setAttribute('height', height);
            this.redraw();
        }
 
    },

    shuffle: function() {
        this.populateColors();
        this.compose();
    },

    redraw: function() {
//        console.log('REDRAW: '+this.width+':'+this.height);
        this.colors.reset();
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
        this.ctx.fillStyle = this.colors.next();
        this.ctx.fillRect(0, 0, this.width, this.height);

        var numRect = this.randNum(3, 0);
        for (var i=0; i<numRect; i++) {
            var x = this.getX();
            var y = this.getY();
            var w = this.getW();
            var h = this.getH();
            var c = this.colors.next();

            this.ctx.fillStyle = c;
            this.ctx.fillRect(x, y, w, h);
        }
    },

    drawText: function() {
        var snips = this.randNum(5, 3);
        for (var i=0; i<snips; i++) {
            var text = this.snippets.getRandom(this.randDrawing);
            var color = this.colors.next();
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
            0 - this.margin_x,
            2
        );
    },

    getY: function() {
        return this.randNum(
            this.height - this.margin_y,
            0 - this.margin_y,
            2
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
        this.colors = new Colors(this.numColors);
        this.displayColors();
    },

    displayColors: function() {
        $('#theColors').empty();

        for (var i=0; i<this.colors.num; i+=1) {
            var c = this.colors.getHex(i);
            var item = $('<li>'+c+'</li>');
            item.css('background-color', c);
            $('#theColors').append(item);
        }
    },

    randNum: function(max, min, exp) {
        if (min == undefined) min = 1;
        var n = max-min;
        var ret;

        if (exp == undefined) {
            ret = Math.round(this.randDrawing.next() * n + min);
        } else {
            ret = Math.round(Math.pow(this.randDrawing.next(), exp) * n + min);
        }

        return ret;
    },


    download: function() {
        var data = this.canvas.toDataURL('image/png');
        $('#imagedata').val(data);
        $('#downloadForm').get(0).submit();
    }
}

function Colors(n) {
    this.colors = [];
    this.ptr = 0;
    this.bg = 0;

    if (n == undefined) {
        this.num = 3;
    } else {
        this.num = n;
    }

    this.populate();
    console.log(this.colors);
}

Colors.prototype = {

    populate: function() {
        this.colors = [];

        for (var i=0; i<this.num; i+=1) {
            this.choose(i);
        }

        this.ptr = 0;
        this.bg = 0;
    },

    choose: function(i) {
        var c = this.genRandColor();
        this.colors[i] = c;
    },

    more: function() {
        this.num++;
        var i = this.num-1;
        if (this.colors[i] == undefined) {
            this.choose(i);
        }
    },

    fewer: function() {
        if (this.num > 1) {
            this.num--;
        }
    },

    reset: function() {
        this.ptr = this.bg;
    },

    genRandColor: function() {
        ret = '#';
        var hex;

        for (var i=0; i<3; i++) {
            var n = Math.floor(
                Math.pow(Math.random(), 1)
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

    getHex: function(n) {
        return this.colors[n];
    },

    next: function() {
        var ret = this.colors[this.ptr];
        this.ptr++;
        if (this.ptr >= this.num) {
            this.ptr = 0;
        }
        return ret;
    },

}

function TextSnippets() {
    this.text = [
        "||||||||||++++++++++||||||||||++++++++++\n"+
        "++++++++++||||||||||++++++++++||||||||||\n"+
        "||||||||||++++++++++||||||||||++++++++++\n"+
        "++++++++++||||||||||++++++++++||||||||||",

        "& & & & & & & &",

        "* * * * * * * * *",

        "Ж",

        "Jackdaws\nlove my\nbig sphinx\nof quartz.",

        "Wafting\nzephyrs\nquickly\nvexed\nJumbo.",

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
        "ETAOIN\nSHRDLU",

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
        var v = event.currentTarget.value;

        if (v == 'custom') {
            $('#customX').val(colortoy.width);
            $('#customY').val(colortoy.height);
            $('#sizeMenu').hide();
            $('#customSize').show();
            $('#customX').select();
        } else {
            colortoy.changeSizePreset(v);
        }
    });

    $('#clearCustomSize').click(function(event){
        $('#sizeMenu').val(0);
        $('#customSize').hide();
        $('#sizeMenu').show();
        colortoy.changeSizePreset(0);
    });

    $('#customX, #customY').change(function(event){
        var elem = $(event.currentTarget);
        var val = parseInt(elem.val());

        if (isNaN(val)) {
            $('#customX').val(colortoy.width);
            $('#customY').val(colortoy.height);
            return false;
             
        } else {
            if (val < 16) {
                val = 16;
            } else if (val > 2000) {
                val = 2000;
            }
        }

        elem.val(val);

        var width = parseInt($('#customX').val());
        var height = parseInt($('#customY').val());
        colortoy.changeSize(width, height);
    });

    $('#fewerColors').click(function(event){
        if (colortoy.numColors > colortoy.minColors) {
            colortoy.numColors--;
            colortoy.colors.fewer();
            colortoy.displayColors();
            colortoy.redraw();

            if (colortoy.numColors <= colortoy.minColors) {
                $('#fewerColors').attr('disabled', true);
            }
            $('#moreColors').attr('disabled', false);
        }
    });

    $('#moreColors').click(function(event){
        if (colortoy.numColors < colortoy.maxColors) {
            colortoy.numColors++;
            colortoy.colors.more();
            colortoy.displayColors();
            colortoy.redraw();

            if (colortoy.numColors >= colortoy.maxColors) {
                $('#moreColors').attr('disabled', true);
            }
            $('#fewerColors').attr('disabled', false);
        }
    });

    $('#sizeMenu').val(0);
    colortoy.shuffle();
});



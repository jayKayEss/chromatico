function Chromatico(elem) {
    this.snippets = new TextSnippets();
    this.colors = undefined;
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

    this.elem = elem;
    this.canvas = elem.find('canvas');
    this.ctx = this.canvas.get(0).getContext('2d');

    this.numColors = 0;

    this.minColors = 2;
    this.maxColors = 5;
    this.numColors = 3;
    
    this.width = 1;
    this.height = 1;
    this.lastWidth = 1;
    this.lastHeight = 1;
}

Chromatico.prototype = {

    initialize: function(repeat) {
        this.displayMaxX = this.elem.width();
        this.displayMaxY = this.elem.height();
        
        var screenWidth = window.screen.width;
        var screenHeight = window.screen.height;
        
        if (!repeat) {
            var preset = 0;

            for (var i in this.sizes) {
                if (this.sizes[i][0] == screenWidth && this.sizes[i][1] == screenHeight) {
                    preset = i;
                }
            }

            this.width = this.sizes[preset][0];
            this.height = this.sizes[preset][1];

            this.canvas.attr({width: 1, height: 1});
            this.canvas.css({
                width: 1, height: 1,
                left: Math.floor(this.elem.width()/2),
                top: Math.floor(this.elem.height()/2)
            });

            $('#sizeMenu').val(preset);
            this.changeSizePreset(preset);
        } else {
            this.changeSize(this.lastWidth, this.lastHeight);
        }
    },

    changeSizePreset: function(n) {
        var tuple = this.sizes[n];
        var width = tuple[0];
        var height = tuple[1];
        this.changeSize(width, height); 
    },

    changeSize: function(width, height) {
        var self = this;

        var currentDisplayWidth = this.canvas.width();
        var currentDisplayHeight = this.canvas.height();

        var displayWidth = Math.min(width, this.displayMaxX);
        var factorX = displayWidth / width;
        
        var displayHeight = Math.min(height, this.displayMaxY);
        var factorY = displayHeight / height;

        if (factorX < factorY) {
            displayHeight = Math.round(height * factorX);
        } else {
            displayWidth = Math.round(width * factorY);
        }

        var marginX = Math.round((this.displayMaxX - displayWidth) / 2);
        var marginY = Math.round((this.displayMaxY - displayHeight) / 2);

        if (displayWidth != currentDisplayWidth || displayHeight != currentDisplayHeight) {
            this.canvas.stop().animate({
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
                        self.canvas.attr({width: self.width, height: self.height});
                        self.redraw();
                    }
                },

                complete: function(){
                    self.width = width;
                    self.height = height;
                    
                    self.lastWidth = width;
                    self.lastHeight = height;
                    
                    self.canvas.attr({width: self.width, height: self.height});
                    self.redraw();
                }
            });
        } else {
            this.width = width;
            this.height = height;
            this.canvas.attr({width: width, height: height});
            this.redraw();
        }
 
    },

    shuffle: function() {
        this.populateColors();
        this.compose();
    },

    redraw: function() {
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
        this.colors.ptr = this.randNum(this.numColors-1);
        this.ctx.fillStyle = this.colors.next();
        this.ctx.fillRect(0, 0, this.width, this.height);

        var numRect = this.randNum(3, 0);
        for (var i=0; i<numRect; i++) {
            var x, y, w, h;
            var c = this.colors.next();
            
            var mode = this.randNum(1, 0);
            
            if (mode == 1) {
                // horizontal stripe
                y = this.randNum(Math.floor(this.height*.9), this.height*.1);
                if (this.randNum(1, 0)) {
                    h = this.randNum(Math.floor((this.height-y)*.9), this.height*.1);
                } else {
                    h = this.height;
                }
                x = 0;
                w = this.width;
                
            } else {
                // vertical stripe
                x = this.randNum(Math.floor(this.width*.9), this.width*.1);
                if (this.randNum(1, 0)) {
                    w = this.randNum(Math.floor((this.width-x)*.9), this.width*.1);
                } else {
                    w = this.width;
                }
                y = 0;
                h = this.height;
            }

            this.ctx.fillStyle = c;
            this.ctx.fillRect(x, y, w, h);
        }
    },

    drawText: function() {
        var snips = this.randNum(8, 3);
        for (var i=0; i<snips; i++) {
            var text = this.snippets.getRandom(this.randDrawing);
            var color = this.colors.next();
            this.ctx.fillStyle = color;
            var h = this.getTextHeight();
            var x = this.getX();
            var y = this.getY();

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
        var max = this.height*2;
        return Math.floor(
            Math.pow(this.randDrawing.next(), 2) * (max-min) + min
        ); 
    },

    setMargins: function() {
        this.sqrsize = Math.floor(Math.sqrt(this.width * this.height));
        this.margin = Math.floor(this.sqrsize*.1);
        this.margin_x = Math.floor(this.width*.1);
        this.margin_y = Math.floor(this.height*.1);
    },

    populateColors: function() {
        var scale_s = $('#expS').slider('value');
        var scale_v = $('#expV').slider('value');
        this.colors = new Colors(this.numColors, scale_s, scale_v);
        this.displayColors();
    },

    initializeColors: function() {
        var list = $('#theColors');

        for (var i=0; i<this.maxColors; i+=1) {
                item = $('<li><span class="color"></span></li>');
                item.attr('data-id', i);
                item.hide();
                list.append(item);
        }

        $('#theColors li').hover(this.showColorTools, this.hideColorTools);
    },

    displayColors: function() {
        var list = $('#theColors');
        var items = list.find('li');

        for (var i=0; i<this.maxColors; i+=1) {
            var item = items.eq(i);

            if (i < this.numColors) {
                var c = this.colors.getHex(i);
                var hsv = this.colors.getHsv(i);

                if (item.size() == 0) {
                    item = $('<li><span></span></li>');
                    list.append(item);
                }

                var labelClass = 'light';
                if (hsv[2] >= .5) {
                    labelClass = 'dark';
                }
                
                item.find('span.color').html(c).attr('class', 'color '+labelClass);
                item.css('background-color', c);
                item.attr('data-id', i);
                item.show();
            } else {
                item.hide();
            }
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
        var data = this.canvas.get(0).toDataURL('image/png');
        $('#imagedata').val(data);
        $('#downloadForm').get(0).submit();
    },

    showColorTools: function(event) {
        var elem = $(event.currentTarget);
        var pos = elem.offset();
        var width = elem.width();
        var menu = $('#colorControls');

        elem.append(menu);
        menu.css({
            left: '0px',
            top: '0px',
            opacity: '1'
        }).stop().fadeIn();
    },

    hideColorTools: function(event) {
        var menu = $('#colorControls');
        if (menu.css('display') != 'none') {
            menu.stop().fadeOut();
        }
    }
}

function Colors(n, scale_s, scale_v) {
    this.rands = [];
    this.colors = [];
    this.ptr = 0;
    
    if (scale_s != undefined) {
        this.scale_s = scale_s;
    } else {
        this.scale_s = 1;
    }
    
    if (scale_v != undefined) {
        this.scale_v = scale_v;
    } else {
        this.scale_v = 1;
    }

    if (n == undefined) {
        this.num = 3;
    } else {
        this.num = n;
    }

    this.populate();
}

Colors.prototype = {

    populate: function() {
        this.colors = [];
        this.rands = [];

        for (var i=0; i<this.num; i+=1) {
            this.choose(i);
        }

        this.ptr = 0;
    },

    choose: function(i) {
        this.rands[i] = new RandomNumbers(10);
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
        this.ptr = 0;
    },

    genRandColor: function(i) {
        var rand = this.rands[i];
        rand.reset();
        
        var h = Math.floor(rand.next() * 360);
        
        var min_s = Math.max(0, 0+this.scale_s);
        var max_s = Math.min(1, 1+this.scale_s);
        var s = rand.next() * (max_s - min_s) + min_s;

        var min_v = Math.max(0, 0+this.scale_v);
        var max_v = Math.min(1, 1+this.scale_v);
        var v = rand.next() * (max_v - min_v) + min_v;

        // default curve is too dark at lower end;
        // swing everything upward a bit:
        v = Math.pow(v, .5);

        return [h, s, v];
    },

    getHex: function(i) {
        var hsv = this.genRandColor(i);
        var rgb = this.hsvToRgb(hsv);
        
        return '#' +
            this.toHex(rgb[0]) +
            this.toHex(rgb[1]) +
            this.toHex(rgb[2]);
    },

    getHsv: function(i) {
        return this.genRandColor(i);
    },

    toHex: function(n) {
        hex = n.toString(16);

        while (hex.length < 2) {
            hex = '0' + hex;
        }

        return hex;
    },

    next: function() {
        var ret = this.getHex(this.ptr);
        this.ptr++;
        if (this.ptr >= this.num) {
            this.ptr = 0;
        }
        return ret;
    },

    hsvToRgb: function(hsv) {
        var h = hsv[0];
        var s = hsv[1];
        var v = hsv[2];
        
        var i, f, p, q, t, r, g, b;

        if( s == 0 ) {
            r = g = b = Math.floor(v * 255);
            return [r, g, b];
        }

        h = h / 60;
        i = Math.floor(h);
        f = h - i;
        
        p = Math.floor(v * ( 1 - s ) * 255);
        q = Math.floor(v * ( 1 - s * f ) * 255);
        t = Math.floor(v * ( 1 - s * ( 1 - f ) ) * 255);
        v = Math.floor(v * 255);

        if (i == 0) {
            return [v, t, p];

        } else if (i == 1) {
            return [q, v, p];

        } else if (i == 2) {
            return [p, v, t];

        } else if (i == 3) {
            return [p, q, v];

        } else if (i == 4) {
            return [t, p, v];

        } else {
            return [v, p, q];
        }
    }
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

        "·-- ·- ··-· - ·· -· --·  --·· · ·--· ···· -·-- ·-· ···",

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
            return Math.random();
        }
    }

};

$('document').ready(function(){
    var chromatico = new Chromatico($('#displayArea'));

    $(window).resize(function(event){
        chromatico.initialize(true);
    })

    $('#shuffle').click(function(event){
        chromatico.shuffle();
    });

    $('#download').click(function(event){
        chromatico.download();
    });

    $('#recompose').click(function(event){
        chromatico.compose();
    });

    $('#sizeMenu').change(function(event){
        var v = event.currentTarget.value;

        if (v == 'custom') {
            $('#customX').val(chromatico.width);
            $('#customY').val(chromatico.height);
            $('#sizeMenu').hide();
            $('#customSize').show();
            $('#customX').select();
        } else {
            chromatico.changeSizePreset(v);
        }
    });

    $('#clearCustomSize').click(function(event){
        $('#sizeMenu').val(0);
        $('#customSize').hide();
        $('#sizeMenu').show();
        chromatico.changeSizePreset(0);
    });

    $('#customX, #customY').change(function(event){
        var elem = $(event.currentTarget);
        var val = parseInt(elem.val());

        if (isNaN(val)) {
            $('#customX').val(chromatico.width);
            $('#customY').val(chromatico.height);
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
        chromatico.changeSize(width, height);
    });

    $('#fewerColors').click(function(event){
        if (chromatico.numColors > chromatico.minColors) {
            chromatico.numColors--;
            chromatico.colors.fewer();
            chromatico.displayColors();
            chromatico.redraw();

            if (chromatico.numColors <= chromatico.minColors) {
                $('#fewerColors').attr('disabled', true);
            }
            $('#moreColors').attr('disabled', false);
        }
    });

    $('#moreColors').click(function(event){
        if (chromatico.numColors < chromatico.maxColors) {
            chromatico.numColors++;
            chromatico.colors.more();
            chromatico.displayColors();
            chromatico.redraw();

            if (chromatico.numColors >= chromatico.maxColors) {
                $('#moreColors').attr('disabled', true);
            }
            $('#fewerColors').attr('disabled', false);
        }
    });

    $('#newColor').click(function(event){
        var elem = $(event.currentTarget);
        var item = elem.parents('li');
        var n = item.attr('data-id');
        chromatico.colors.choose(n);
        chromatico.displayColors();
        chromatico.redraw();
    });

    $('#expS').slider({
        min: -1,
        max: 1,
        step: .05,
        value: 0,
        orientation: 'horizontal',
        change: function(event, ui) {
            chromatico.colors.scale_s = ui.value;
            chromatico.redraw();
            chromatico.displayColors();
        }
    });
    
    $('#labelS').click(function(event) {
        $('#expS').slider('value', 0);
    });

    $('#expV').slider({
        min: -1,
        max: 1,
        step: .05,
        value: 0,
        orientation: 'horizontal',
        change: function(event, ui) {
            chromatico.colors.scale_v = ui.value;
            chromatico.redraw();
            chromatico.displayColors();
        }
    });

    $('#labelV').click(function(event) {
        $('#expV').slider('value', 0);
    });

    chromatico.initializeColors();
    chromatico.populateColors();
    chromatico.shuffle();
    chromatico.initialize(false);
});



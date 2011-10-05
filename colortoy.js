function Colortoy(canvas) {
    this.snippets = new TextSnippets();
    this.hexchars = "0123456789ABCDEF";
    this.fonts = ['sans', 'sans-serif', 'monospace'];
    this.styles = ['', 'bold', 'italic'];

    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.width = canvas.getAttribute('width');
    this.height = canvas.getAttribute('height');
    this.margin = Math.floor(this.height*.1);
    this.colors = [];
    this.numColors = 0;
    this.ptrColors = 0;
}

Colortoy.prototype = {
    shuffle: function() {
        this.populateColors();
        this.compose();
    },

    compose: function() {
        this.setBackground();
        this.drawText();
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
            var text = this.snippets.getRandom();
            var color = this.nextColor();
            this.ctx.fillStyle = color;
            var h = this.getH();
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
        var style = this.styles[Math.floor(Math.random() * this.styles.length)];
        var font = this.fonts[Math.floor(Math.random() * this.fonts.length)];
        return style+" "+h+"px "+font;
    },

    getX: function() {
        return this.randNum(
            this.height - this.margin,
            0 - this.margin
        );
    },

    getY: function() {
        return this.randNum(
            this.height - this.margin,
            0 - this.margin
        );
    },

    getW: function() {
        return this.randNum(
            Math.floor(this.height*1.3), 
            Math.floor(this.height*.1)
        );
    },

    getH: function() {
        var min = this.height*.05;
        var max = this.height*1.3;
        return Math.floor(
            Math.pow(Math.random(), 1.8) * (max-min) + min
        ); 
    },

    populateColors: function() {
        $('#theColors').empty();
        this.colors = [];

        this.numColors = this.randNum(5, 3);
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
        var ret = Math.round(Math.random() * n + min);

        return ret;
    },

    genRandColor: function() {
        ret = '#';
        var hex;

        for (var i=0; i<3; i++) {
            var n = Math.floor(
                Math.pow(Math.random(), .7)
                * 256
            );
            hex = n.toString(16);

            while (hex.length < 2) {
                console.log(hex);
                hex = '0' + hex;
            }

            ret += hex;
        }

        return ret;
    },

    download: function() {
        var imagedata = this.canvas.toDataURL('image/png');
        var form = $(
            '<form method="POST" action="save.php">'+
            '<input type="hidden" name="imagedata" value="'+imagedata+'">'+
            '</form>'
        );
        form.get(0).submit();
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

    getRandom: function() {
        var i = Math.floor(Math.random() * this.text.length);
//        console.log(i+' '+this.text[i]);
        return this.text[i];
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

    colortoy.shuffle();
});




class ColorState {

    static randomItem() {
        return {
            perc_h: Math.random(),
            perc_s: Math.random(),
            perc_l: Math.random()
        }
    }

    static pickRandom(n) {
        return [...Array(n)].map(() => {
            return ColorState.randomItem();
        });
    }

    static toHSL(color, scale_s, scale_l) {
        scale_s = scale_s || 0;
        scale_l = scale_l || 0;

        var h = color.perc_h * 360,
            min_s = Math.max(0, 0 + scale_s),
            max_s = Math.min(1, 1 + scale_s),
            s = color.perc_s * (max_s - min_s) + min_s,
            min_l = Math.max(0, 0 + scale_l),
            max_l = Math.min(1, 1 + scale_l),
            l = color.perc_l * (max_l - min_l) + min_l;

        return [h, s, l];
    }

    static toRGB(color, scale_s, scale_l) {
        var hsl = ColorState.toHSL(color, scale_s, scale_l),
            h = hsl[0] / 360,
            s = hsl[1],
            l = hsl[2],
            v, min, sv, sextant, fract, vsf, rgb;

        if (l <= 0.5) v = l * (1 + s);
        else v = l + s - l * s;

        if (v === 0) return [0, 0, 0];
        else {
            min = 2 * l - v;
            sv = (v - min) / v;
            h = 6 * h;
            sextant = Math.floor(h);
            fract = h - sextant;
            vsf = v * sv * fract;
            if (sextant === 0 || sextant === 6) rgb = [v, min + vsf, min];
            else if (sextant === 1) rgb = [v - vsf, v, min];
            else if (sextant === 2) rgb = [min, v, min + vsf];
            else if (sextant === 3) rgb = [min, v - vsf, v];
            else if (sextant === 4) rgb = [min + vsf, min, v];
            else rgb = [v, min, v - vsf];
        }

        return [
            Math.floor(rgb[0] * 255),
            Math.floor(rgb[1] * 255),
            Math.floor(rgb[2] * 255)
        ];
    }

    static toHexCode(color, scale_s, scale_l) {
        var rgb = ColorState.toRGB(color, scale_s, scale_l);

        var toHex = (n) => {
            var hex = n.toString(16);
            return hex.length < 2 ? '0' + hex : hex;
        }

        return '#' +
            toHex(rgb[0]) +
            toHex(rgb[1]) +
            toHex(rgb[2]);
    }

    static toHSLString(color, scale_s, scale_l) {
        var hsl = ColorState.toHSL(color, scale_s, scale_l);

        return `hsl(${Math.floor(hsl[0])}, ${Math.floor(hsl[1] * 100)}%, ${Math.floor(hsl[2] * 100)}%)`
    }

    // Cribbed from http://24ways.org/2010/calculating-color-contrast
    static isLight(color, scale_s, scale_l) {
        var rgb = ColorState.toRGB(color, scale_s, scale_l);
        var yiq = ((rgb[0] * 299)+(rgb[1] * 587)+(rgb[2] * 114)) / 1000;
        return (yiq >= 128) ? true : false;
    }

}

export default ColorState;
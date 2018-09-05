import { randElementFromArray, Fonts, FontStyles, TextSnippets } from '../const';

class TextState {

    static randomItem() {
        return {
            text: randElementFromArray(TextSnippets),
            font: randElementFromArray(Fonts),
            style: randElementFromArray(FontStyles),
            perc_font_size: Math.random() * .75 + .1,
            perc_offset_x: Math.random(), // controls placement of text:
            perc_offset_y: Math.random()  // 0 is left edge; .5 middle; 1 right edge
        }
    }

    static pickRandom(n) {
        return [...Array(n)].map(() => {
            return TextState.randomItem();
        });
    }

}

export default TextState;
class StripeState {

    static randomItem() {
        var orientation = Math.floor(Math.random() * 2),
            perc_width = Math.random() * .8 + .1,
            perc_offset = Math.random();  

        // snap to left or right edges of canvas
        perc_offset = perc_offset < .1 ? 0 : perc_offset;
        perc_offset = perc_offset > .9 ? 1 : perc_offset;


        return {
            orientation: orientation,
            perc_width: perc_width,
            perc_offset: perc_offset * (1 - perc_width) // make relative to remaining space
        }
    }

    static get Horizontal() {
        return 0;
    }

    static get Vertical() {
        return 1;
    }

    static pickRandom(n) {
        return [...Array(n)].map(() => {
            return StripeState.randomItem();
        });
    }
}

export default StripeState;
class RoundRobin {

    constructor(items) {
        this.items = items;
        this.ptr = 0;
    }

    next() {
        var pick = this.items[this.ptr];

        if (++this.ptr >= this.items.length) {
            this.ptr = 0;
        }

        return pick;
    }
}

export default RoundRobin;
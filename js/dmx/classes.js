class Universe {
    index = 0;
    data = [new DataBlock()]

    constructor(index = 0) {
        this.index = index;
        for (let i = this.data.length; i < 512; i++) {
            this.data[i] = new DataBlock();
        }
    }
}

class DataBlock {
    isRGB = false;
    value = 255; // can be Vector3 (as color, r/g/b as x/y/z)
}
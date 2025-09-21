class BaseWorker {
    write(node1) {

    }
}

class TestWorker extends BaseWorker {
    matrix = [
        [0, 8, 16, 24, 32, 40, 48, 56],
        [1, 9, 17, 25, 33, 41, 49, 57],
        [2, 10, 18, 26, 34, 42, 50, 58],
        [3, 11, 19, 27, 35, 43, 51, 59],
        [4, 12, 20, 28, 36, 44, 52, 60],
        [5, 13, 21, 29, 37, 45, 53, 61],
        [6, 14, 22, 30, 38, 46, 54, 62],
        [7, 15, 23, 31, 39, 47, 55, 63],
    ]
    mi = 0;
    timeToFlash = 12;
    timerToFlash = 0;
    subtractFactor = 2;
    scrollReverse = false;
    timerscroll = 0;
    scrollMax = 5;
    mirror = false;

    write(node1) {
        this.timerToFlash += 1
        if (this.scrollReverse) {
            if (this.mi < 0) {
                this.mi = this.matrix.length - 1;
                this.timerscroll++;
                if (this.timerscroll > this.scrollMax) {
                    this.timerscroll = 0;
                    this.scrollReverse = !this.scrollReverse;
                }
            }
        } else {
            if (this.mi >= this.matrix.length) {
                this.mi = 0;
                this.timerscroll++;
                if (this.timerscroll > this.scrollMax) {
                    this.timerscroll = 0;
                    this.scrollReverse = !this.scrollReverse;
                }
            }
        }
        if (this.timerToFlash >= this.timeToFlash) {
            this.timerToFlash = 0;

            for (let i = 0; i < node1.pixelSettings.count.x * node1.pixelSettings.count.y; i++) {
                let value = node1.data[i];
                //if (index == i) {
                //    value = RandomString.randomNumberInRange(55, 125) 
                //}
                //if (index >= data.length) index = 0;
                
                /*let isBright = RandomString.randomNumberInRange(0, 10) > 8
                value = isBright 
                    ? RandomString.randomNumberInRange(24, 50) 
                    : 0*/

                if (this.matrix[this.mi].includes(i)) {
                    if (isVector3(value)) {
                        value.set(125, 125, 125)
                    } else {
                        value = 125;
                    }
                }

                apply_data_to_block(node1.data[i], value);
                //data[i] = RandomString.randomNumberInRange(0, 255);// i % 2 == 0 ? 255 : 125
            }

            this.mi += this.scrollReverse ? -1 : 1;
            
            if (this.mirror) apply_mirror(node1.data)
        } else {
            for (let i = 0; i < node1.data.length; i++) {
                /*if (isVector3(data[i])) {
                    value = data[i]
                    if (value.x > 0) value.x -= 8;
                    if (value.y > 0) value.y -= 8;
                    if (value.z > 0) value.z -= 8;
                }*/
                if (isVector3(node1.data[i])) {
                    if (isVector3NaN(node1.data[i])) throw `Vector3 found to have NaN.`, node1.data[i];

                    // Fade values
                    node1.data[i].subtract(this.subtractFactor, this.subtractFactor, this.subtractFactor);
                    if (node1.data[i].x < 0) node1.data[i].x = 0; // Maybe put in vector3 method.
                    if (node1.data[i].y < 0) node1.data[i].y = 0;
                    if (node1.data[i].z < 0) node1.data[i].z = 0;
                } else {
                    if (isNaN(node1.data[i])) throw `Number found to be NaN at ${i} in data array.`, node1.data[i];
                    
                    // Fade value
                    node1.data[i] -= this.subtractFactor;
                    if (node1.data[i] < 0) node1.data[i] = 0;
                }
            }
        }
    }
}

class FrameTestWorker extends BaseWorker {
    frames = [
        [
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
        ],
        [
            0, 0, 0, 255, 255, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
        ],
        [
            0, 0, 255, 0, 0, 255, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
        ],
        [
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 255, 255, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
        ],
        [
            0, 255, 0, 0, 0, 0, 255, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
        ],
        [
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 255, 0, 0, 255, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
        ],
        [
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 255, 0, 0, 255, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
        ],
        [
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 255, 0, 0, 0, 0, 255, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
        ],
        [
            255, 0, 0, 0, 0, 0, 0, 255,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
        ],
        /*[
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
        ],
        [
            255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255,
        ],*/
        // Rear flash
        /*[
            255, 255, 255, 255, 0, 0, 0, 0,
            255, 255, 255, 255, 0, 0, 0, 0,
            255, 255, 255, 255, 0, 0, 0, 0,
            255, 255, 255, 255, 0, 0, 0, 0,
            255, 255, 255, 255, 0, 0, 0, 0,
            255, 255, 255, 255, 0, 0, 0, 0,
            255, 255, 255, 255, 0, 0, 0, 0,
            255, 255, 255, 255, 0, 0, 0, 0,
        ],*/
        // scrol;l
        /*[
            255, 255, 255, 255, 0, 0, 0, 0,
            255, 255, 255, 255, 0, 0, 0, 0,
            0, 255, 255, 255, 0, 0, 0, 0,
            0, 0, 255, 255, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
        ],
        [
            255, 255, 0, 0, 0, 0, 0, 0,
            255, 255, 255, 0, 0, 0, 0, 0,
            255, 255, 255, 0, 0, 0, 0, 0,
            0, 255, 255, 255, 0, 0, 0, 0,
            0, 0, 255, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
        ],
        [
            0, 0, 0, 0, 0, 0, 0, 0,
            255, 255, 0, 0, 0, 0, 0, 0,
            255, 255, 0, 0, 0, 0, 0, 0,
            255, 255, 255, 0, 0, 0, 0, 0,
            255, 255, 255, 0, 0, 0, 0, 0,
            0, 0, 255, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
        ],*/
        /*[
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 255, 0, 0,
            0, 0, 0, 0, 255, 255, 255, 0,
            0, 0, 0, 0, 0, 255, 255, 255,
            0, 0, 0, 0, 0, 0, 255, 255,
        ],[
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 255, 255, 0, 0, 0,
            0, 255, 255, 255, 0, 0, 0, 0,
            255, 255, 255, 0, 0, 0, 0, 0,
            255, 255, 0, 0, 0, 0, 0, 0,
        ],
        [
            255, 255, 0, 0, 0, 0, 0, 0,
            255, 255, 255, 0, 0, 0, 0, 0,
            0, 255, 255, 255, 0, 0, 0, 0,
            0, 0, 255, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
        ],
        [
            0, 0, 0, 0, 0, 0, 255, 255,
            0, 0, 0, 0, 0, 255, 255, 255,
            0, 0, 0, 0, 255, 255, 255, 0,
            0, 0, 0, 0, 255, 255, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
        ],*/
    ]
    frame = 0;
    timeToFlash = 12;
    timerToFlash = 0;
    subtractFactor = 2;
    mirror = true;
    
    roll_values(node1) {
        this.timerToFlash += 1
        if (this.frame >= this.frames.length) this.frame = 0;

        if (this.timerToFlash >= this.timeToFlash) {
            this.timerToFlash = 0;

            for (let i = 0; i < node1.pixelSettings.count.x * node1.pixelSettings.count.y; i++) {
                let value = node1.data[i];
                //if (index == i) {
                //    value = RandomString.randomNumberInRange(55, 125) 
                //}
                //if (index >= data.length) index = 0;

                /*let isBright = RandomString.randomNumberInRange(0, 10) > 8
                value = isBright 
                    ? RandomString.randomNumberInRange(24, 50) 
                    : 0*/

                // frame-based render
                let _frame = this.frames[this.frame];
                value = _frame[i]
                // mirror by X-axis
                if (i < 32) {
                    if (_frame[i] != 0) value = _frame[i] - 125;
                } else {
                    let index = _frame.length - i - 1;
                    if (_frame[index] != 0) value = _frame[index] - 125;
                }
                value = _frame[i];

                apply_data_to_block(node1.data[i], value); // value = undefined
                //data[i] = RandomString.randomNumberInRange(0, 255);// i % 2 == 0 ? 255 : 125
            }

            this.frame++;
            
            if (this.mirror) apply_mirror(node1.data)
        } else {
            for (let i = 0; i < node1.data.length; i++) {
                if (isVector3(node1.data[i])) {
                    if (isVector3NaN(node1.data[i])) throw `Vector3 found to have NaN.`, node1.data[i];

                    // Fade values
                    node1.data[i].subtract(this.subtractFactor, this.subtractFactor, this.subtractFactor);
                    if (node1.data[i].x < 0) node1.data[i].x = 0; // Maybe put in vector3 method.
                    if (node1.data[i].y < 0) node1.data[i].y = 0;
                    if (node1.data[i].z < 0) node1.data[i].z = 0;
                } else {
                    if (isNaN(node1.data[i])) throw `Number found to be NaN at ${i} in data array.`, node1.data[i];
                    
                    // Fade value
                    node1.data[i] -= this.subtractFactor;
                    if (node1.data[i] < 0) node1.data[i] = 0;
                }
            }
        }
    }

    write(node1) {
        this.roll_values(node1);
    }
}


class AllColorWorker extends BaseWorker {
    color = new Vector2(255, 255, 255)

    write(node1) {
        for (let i = 0; i < node1.data.length; i++) {
            if (isVector3(node1.data[i])) {
                if (isVector3NaN(node1.data[i])) throw `Vector3 found to have NaN.`, node1.data[i];

                node1.data[i].set(this.color.x, this.color.y, this.color.z)
            } else {
                if (isNaN(node1.data[i])) throw `Number found to be NaN at ${i} in data array.`, node1.data[i];
                
                node1.data[i] = this.color.x
            }
        }
    }
}
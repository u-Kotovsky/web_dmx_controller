// maybe do hierarchy/render view/inspector style editor
// so it can assign stuff manually or with inspector selection through transform manually entering values.
// base workflow
let canvas = newCanvas(1920, 1080);
let ctx = canvas.getContext('2d')

// Settings
let pixel = {
    realSize: new Vector2(16, 16), // default 16px
    count: new Vector2(8, 8), // default 8
    gridSize: new Vector2(0, 0)
}
pixel.gridSize.set(pixel.count.x * pixel.realSize.x, pixel.count.y * pixel.realSize.y);
let renderer = {
    lastPixelPosition: new Vector2(0, 0) // position of pixel to render at
}

// Debug
let isGridPreview = false;
let canvas2, ctx2;
if (isGridPreview) {
    canvas2 = newCanvas(pixel.gridSize.x, pixel.gridSize.y);
    ctx2 = canvas2.getContext('2d')
}

// how to get corner?
// prob additive X/Y
// last pixel (right bottom corner) = canvas.width/height (1920, 1080)
// soo subtract from that width of our custom shit
// Grid position on screen
let offset = 
    new Vector2(canvas.width - pixel.gridSize.x, canvas.height - pixel.gridSize.y); // bottom right corner
    //new Vector2(0, 0); // default

console.log(`canvas scale ${canvas.width} ${canvas.height}` + 
    `\nreal pixel size ${pixel.realSize.x} ${pixel.realSize.y}` + 
    `\npixels ${pixel.count.x} ${pixel.count.y} (total ${pixel.count.x * pixel.count.y})` + 
    `\ngrid size ${pixel.gridSize.x} ${pixel.gridSize.y}` + 
    `\noffset ${offset.x} ${offset.y}`
)

let universes = []
for (let i = 0; i < 3; i++) {
    universes[i] = new Universe(i);
}

let data = [];
function fill(array, length, template_callback = (i) => 0) {
    for (let i = 0; i < length; i++)
        array[i] = template_callback(i);
}
fill(data, pixel.count.x * pixel.count.y, (i) => { return new Vector3(255, 0, 0) })


let frames = [
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

let frame = 0;

// Current patched gridnode
let matrix = [
    [0, 8, 16, 24, 32, 40, 48, 56],
    [1, 9, 17, 25, 33, 41, 49, 57],
    [2, 10, 18, 26, 34, 42, 50, 58],
    [3, 11, 19, 27, 35, 43, 51, 59],
    [4, 12, 20, 28, 36, 44, 52, 60],
    [5, 13, 21, 29, 37, 45, 53, 61],
    [6, 14, 22, 30, 38, 46, 54, 62],
    [7, 15, 23, 31, 39, 47, 55, 63],
]
let mi = 0;
let timeToFlash = 12;
let timerToFlash = 0;
let subtractFactor = 2;
let scrollReverse = false;
let timerscroll = 0;
let scrollMax = 5;
let mirror = false;
function roll_values() {
    timerToFlash += 1
    if (scrollReverse) {
        if (mi < 0) {
            mi = matrix.length - 1;
            timerscroll++;
            if (timerscroll > scrollMax) {
                timerscroll = 0;
                scrollReverse = !scrollReverse;
            }
        }
    } else {
        if (mi >= matrix.length) {
            mi = 0;
            timerscroll++;
            if (timerscroll > scrollMax) {
                timerscroll = 0;
                scrollReverse = !scrollReverse;
            }
        }
    }
    if (frame >= frames.length) frame = 0;

    if (timerToFlash >= timeToFlash) {
        timerToFlash = 0;

        for (let i = 0; i < pixel.count.x * pixel.count.y; i++) {
            let value = data[i];
            //if (index == i) {
            //    value = RandomString.randomNumberInRange(55, 125) 
            //}
            //if (index >= data.length) index = 0;
            
            /*let isBright = RandomString.randomNumberInRange(0, 10) > 8
            value = isBright 
                ? RandomString.randomNumberInRange(24, 50) 
                : 0*/

            if (matrix[mi].includes(i)) {
                if (isVector3(value)) {
                    value.set(125, 125, 125)
                } else {
                    value = 125;
                }
            }

            // frame-based render
            //let _frame = frames[frame];
            //value = _frame[i]

            // mirror by X-axis
            //if (i < 32) {
            //    if (_frame[i] != 0) value = _frame[i] - 125;
            //} else {
            //    let index = _frame.length - i - 1;
            //    if (_frame[index] != 0) value = _frame[index] - 125;
            //}
            //value = _frame[i];

            if (isVector3(data[i])) {
                if (isVector3(value)) {
                    data[i].set(value.x, value.y, value.z)
                } else {
                    data[i].x = value
                    data[i].y = value
                    data[i].z = value
                }
                // Set diff color here.
                //data[i].y = value.y
                //data[i].z = value.z
            } else {
                //data[i] = value
                if (isVector3(value)) {
                    data[i] = value.x
                } else {
                    data[i] = value
                }
            }

            //data[i] = RandomString.randomNumberInRange(0, 255);// i % 2 == 0 ? 255 : 125
        }

        mi += scrollReverse ? -1 : 1;
        frame++;
        
        // mirror shit
        if (mirror) {
            for (let i = 0; i < data.length; i++) {
                let value = data[i];

                if (i < 32) {
                    let index = data.length - i - 1;
                    //if (value != 0) value = value;
                    if (isVector3(value)) {
                        data[index].set(value.x, value.y, value.z)
                        /*if (value.x > 0) data[index].x = value.x;
                        if (value.y > 0) data[index].y = value.y;
                        if (value.z > 0) data[index].z = value.z;*/
                    } else {
                        if (value > 0)  data[index] = value;
                    }
                }
            }
        }
    } else {
        for (let i = 0; i < data.length; i++) {
            /*if (isVector3(data[i])) {
                value = data[i]
                if (value.x > 0) value.x -= 8;
                if (value.y > 0) value.y -= 8;
                if (value.z > 0) value.z -= 8;
            }*/
            if (isVector3(data[i])) {
                if (isVector3NaN(data[i])) throw `Vector3 found to have NaN.`, data[i];

                // Fade values
                data[i].subtract(subtractFactor, subtractFactor, subtractFactor);
                if (data[i].x < 0) data[i].x = 0; // Maybe put in vector3 method.
                if (data[i].y < 0) data[i].y = 0;
                if (data[i].z < 0) data[i].z = 0;
            } else {
                if (isNaN(data[i])) throw `Number found to be NaN at ${i} in data array.`, data[i];
                
                // Fade value
                data[i] -= subtractFactor;
                if (data[i] < 0) data[i] = 0;
            }
        }
    }
    
}

let length = pixel.count.x * pixel.count.y - 5
let debug_patch = false;
let counter = 0;
let time = 0;
let tps = 0;
let ticks = 0;
let tick_array = []

// Main render

let _pos = new Vector2(0, 0);
function render() {
    time = performance.now()
    counter = 0;
    renderer.lastPixelPosition.set(0, 0)
    roll_values();

    //data[0] = new Vector3(50, 0, 0)
    for (let i = 0; i < (data.length > length ? data.length : length); i++) {
        let vector = new Vector3(); // out color
        _pos.set(offset.x + renderer.lastPixelPosition.x, offset.y + renderer.lastPixelPosition.y);

        if (debug_patch) {
            if (data.length > length) {
                vector.z = 255;
            } else {
                vector.y = 255;
            }

            if (data[i] == null) vector.x = 255;
            ctx.fillStyle = 'rgb(255, 0, 0)'
            _pos.add(2, 12)
            draw_text(ctx, _pos, `${i}`, '.9em', 'Calibri', 'start', 'alphabetic', false)
        } else {
            if (data[i] == null) {
                vector.set(125, 0, 0);
            } else {
                if (isVector3(data[i]))
                    vector.set(data[i].x, data[i].y, data[i].z);
                else 
                    vector.set(data[i], data[i], data[i]);
            }
            //_pos.add(2, 12)
            //ctx.fillStyle = 'rgb(255, 255, 0)'
            //draw_text(ctx, _pos, `${i}`, '.7em', 'Arial', 'start', 'alphabetic', false)
            //draw_rect(ctx2, renderer.lastPixelPosition, pixel.realSize, 
            //    data[i] != null ? vector.getColor() : 'rgb(255, 0, 0)');
        }
        
        draw_rect(ctx, _pos, pixel.realSize, 
            debug_patch 
            ? data[i] != null ? vector.getColor() : 'rgb(255, 255, 0)'
            : vector.getColor());
        if (isGridPreview) {
            draw_rect(ctx2, renderer.lastPixelPosition, pixel.realSize, debug_patch 
                ? data[i] != null ? vector.getColor() : 'rgb(255, 0, 0)'
                : vector.getColor());
        }

        counter++;
        renderer.lastPixelPosition.y += pixel.realSize.y;
        if (renderer.lastPixelPosition.y >= pixel.realSize.y * pixel.count.y) {
            renderer.lastPixelPosition.y = 0;
            renderer.lastPixelPosition.x += pixel.realSize.x;
        }
    }

    tick_array.push(performance.now() - time)
}

// Main render

let pause = false;

function request_render() {
    if (!pause) render();

    //setTimeout(() => {
        requestAnimationFrame( request_render )
    //}, 500)
}

request_render()

setInterval(() => {
    calculateAverageTime()
}, 1000);

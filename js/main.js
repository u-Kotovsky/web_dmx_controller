function appendButton(parentId, elementId, onclick) {
    let button = document.createElement('button');
    button.onclick = onclick;
    button.textContent = 'test';
    document.getElementById('elements').appendChild(button);
}
// new
function newCanvas(width = 1920, height = 1080) {
    let canvas = document.createElement('canvas')
    canvas.width = width;
    canvas.height = height;
    return document.body.appendChild(canvas);
}
const pi2 = Math.PI*2
/**
 * Drawing circle in canvas
 * @param {*} ctx 
 * @param {Vector2} position 
 * @param {Number} scale 
 * @param {String} color 
 */
function draw_circle(ctx, position, scale, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(position.x, position.y, scale, 0, pi2);
    ctx.fill();
}
/**
 * Drawing rectangle in canvas
 * @param {*} ctx 
 * @param {Vector2} position 
 * @param {Vector2} scale 
 * @param {String} color 
 */
function draw_rect(ctx, position, scale, color) {
    ctx.fillStyle = color;
    ctx.fillRect(position.x, position.y, scale.x, scale.y)
}
/**
 * Drawing image in canvas
 * @param {*} ctx 
 * @param {Vector2} position 
 * @param {*} image 
 */
function draw_image(ctx, position, image) {
    ctx.drawImage(image, position.x, position.y);
}
/**
 * Drawing text in canvas
 * @param {Context} ctx 
 * @param {Vector2} position 
 * @param {String} text 
 * @param {String} size 
 * @param {String} font 
 * @param {String} align 
 * @param {String} baseline 
 * @param {Boolean} stroke 
 */
function draw_text(ctx, position, text, size, font, align, baseline, stroke) {
    ctx.font = `${size} ${font}`;
    ctx.textAlign = align;
    ctx.textBaseline = baseline;

    if (stroke) {
        ctx.strokeText(text, position.x, position.y);
        return;
    }

    ctx.fillText(text, position.x, position.y);
}

// maybe do hierarchy/render view/inspector style editor
// so it can assign stuff manually or with inspector selection through transform manually entering values.
// base workflow
let canvas = newCanvas(1920, 1080);
let ctx = canvas.getContext('2d')
// pixel workflow
let realPixelSize = new Vector2(16, 16) // default 16px
let pixels = new Vector2(8, 8) // default 8
let gridSize = new Vector2(pixels.x * realPixelSize.x, pixels.y * realPixelSize.y)
let position = new Vector2(0, 0); // position of pixel to render at
// debug
//let canvas2 = newCanvas(gridSize.x, gridSize.y);
//let ctx2 = canvas2.getContext('2d')

// how to get corner?
// prob additive X/Y
// last pixel (right bottom corner) = canvas.width/height (1920, 1080)
// soo subtract from that width of our custom shit
let offset = 
    new Vector2(canvas.width - gridSize.x, canvas.height - gridSize.y); // bottom right corner
    //new Vector2(0, 0); // default

console.log(`canvas scale ${canvas.width} ${canvas.height}` + 
    `\nreal pixel size ${realPixelSize.x} ${realPixelSize.y}` + 
    `\npixels ${pixels.x} ${pixels.y} (total ${pixels.x * pixels.y})` + 
    `\ngrid size ${gridSize.x} ${gridSize.y}` + 
    `\noffset ${offset.x} ${offset.y}`
)

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

let universes = []
for (let i = 0; i < 3; i++) {
    universes[i] = new Universe(i);
}

let timeToFlash = 25;
let timerToFlash = 0;
let data = [];
function fill(array, length, template_callback = (i) => 0) {
    for (let i = 0; i < length; i++)
        array[i] = template_callback(i);
}
fill(data, pixels.x * pixels.y, (i) => { return new Vector3(255, 0, 0) })

let index = 0;

function roll_values() {
    timerToFlash += 1
    if (timerToFlash >= timeToFlash) {
        timerToFlash = 0;

        for (let i = 0; i < pixels.x * pixels.y; i++) {
            let value = 0;
            if (index == i) {
                value = RandomString.randomNumberInRange(55, 125) 
            }
            if (index >= data.length) index = 0;
            
            let isBright = RandomString.randomNumberInRange(0, 10) > 8
            value = isBright 
                ? RandomString.randomNumberInRange(24, 50) 
                : RandomString.randomNumberInRange(0, 0)
            if (isVector3OrNumber(data[i])) {
                data[i].x = value
                data[i].z = value
            } else {
                data[i] = value
            }

            //data[i] = RandomString.randomNumberInRange(0, 255);// i % 2 == 0 ? 255 : 125
        }

        index++;
    } else {
        for (let i = 0; i < data.length; i++) {
            if (data[i] == null) {
                console.error(`found null at ${i} in data`)
                throw data;
            }

            if (isVector3OrNumber(data[i])) {
                if (isNaN(data[i].x)) {
                    console.error(`found NaN at ${i} ${data[i]} in data`)
                    throw data;
                }

                // decrease value
                if (data[i].x <= 0) {
                    data[i].x = 0;
                    continue;
                } // skip zeros
                data[i].x -= 4;
            } else {
                if (isNaN(data[i])) {
                    console.error(`found NaN at ${i} ${data[i]} in data`)
                    throw data;
                }

                // decrease value
                if (data[i] <= 0) {
                    data[i] = 0;
                    continue;
                } // skip zeros
                data[i] -= 4;
            }
        }
    }
}

let length = pixels.x * pixels.y - 5
let debug_patch = false;
let counter = 0;
let time = 0;
let tick_array = []
let tps = 0;
let ticks = 0;

function calculateAverageTime() {
    tps = 0;
    ticks = 0;
    tick_array.forEach(value => {
        tps += value;
        ticks++;
    })
    tps = tps / ticks;
    tick_array.length = 0
    console.log(`${ticks} (tps), ${tps.toFixed(2)}ms (~1 tick)`)
}

function isVector3OrNumber(data) {
    return Object.keys(data).includes('x');
}

let _pos = new Vector2(0, 0);

function render() {
    time = performance.now()
    counter = 0;
    position.set(0, 0)
    roll_values();

    //data[0] = new Vector3(50, 0, 0)

    for (let i = 0; i < (data.length > length ? data.length : length); i++) {
        let vector = new Vector3(); // out color
        _pos.set(offset.x + position.x, offset.y + position.y);

        if (debug_patch) {
            if (data.length > length) {
                vector.z = 255;
            } else {
                vector.y = 255;
            }

            if (data[i] == null) vector.x = 255;
            draw_rect(ctx, _pos, realPixelSize, vector.getColor());
            ctx.fillStyle = 'rgb(255, 0, 0)'
            _pos.add(2, 12)
            draw_text(ctx, _pos, `${i}`, '.7em', 'Arial', 'start', 'alphabetic', false)
            //draw_rect(ctx2, position, realPixelSize, vector.getColor());
        } else {
            if (data[i] == null) {
                vector.set(125, 0, 0);
            } else {
                if (isVector3OrNumber(data[i])) {
                    vector.set(data[i].x, data[i].y, data[i].z);
                } else {
                    vector.set(data[i], data[i], data[i]);
                }
            }

            draw_rect(
                ctx, 
                _pos, 
                realPixelSize, 
                data[i] != null ? vector.getColor() : 'rgb(255, 255, 0)'
            );
            //_pos.add(2, 12)
            //ctx.fillStyle = 'rgb(255, 255, 0)'
            //draw_text(
            //    ctx, _pos, `${i}`, '.7em', 'Arial', 'start', 'alphabetic', false
            //)
            //draw_rect(
            //    ctx2, 
            //   position, 
            //    realPixelSize, 
            //    data[i] != null ? vector.getColor() : 'rgb(255, 0, 0)');
        }

        counter++;
        position.y += realPixelSize.y;
        if (position.y >= realPixelSize.y * pixels.y) {
            position.y = 0;
            position.x += realPixelSize.x;
        }
    }

    tick_array.push(performance.now() - time)
}

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

/*
test render pixels square
    //for (let i = 0; i < gridSize.x * gridSize.y; i++) {
    for (let i = 0; i < (data.length > length ? data.length : length); i++) {
        let vector = new Vector3(); // out color
        _pos.set(offset.x + position.x, offset.y + position.y);

        if (debug_patch) {
            if (data.length > length) {
                vector.z = 255;
            } else {
                vector.y = 255;
            }

            if (data[i] == null) vector.x = 255;

            draw_rect(
                ctx, _pos, 
                realPixelSize, 
                vector.getColor());
        } else {
            if (data[i] == null) {
                vector.set(255, 0, 0);
            } else {
                if (data.isVector == null) {
                    vector.set(data[i], data[i], data[i]);
                } else {
                    vector.set(data[i]);
                }
            }

            draw_rect(
                ctx, 
                _pos, 
                realPixelSize, 
                data[i] != null ? vector.getColor() : 'rgb(255, 0, 0)');
        }

        counter++;
        position.y += realPixelSize.y;
        if (position.y >= realPixelSize.y * pixels.y) {
            position.y = 0;
            position.x += realPixelSize.x;
        }
    }
    */

/* // VRSL, 1st universe
for (let i = 0; i < 512; i++) {
    y += 16;
    if (y >= 208) {
        y = 0;
        x += 16;
    }
    draw_rect(ctx, new Vector2(x, y), new Vector2(16, 16), RandomString.randomGrayscale());
}
*/
/* // test
for (let i = 0; i < 512; i++) {
    x += 16;
    if (x > 1920) {
        x = 0;
        y += 16;
    }
    draw_rect(ctx, new Vector2(x, y), new Vector2(16, 16), RandomString.randomGrayscale());
}
*/

//draw_rect(ctx, new Vector2(5, 5), new Vector2(16, 16), 'rgb(255, 255, 255)');
console.log('draw', canvas, ctx)
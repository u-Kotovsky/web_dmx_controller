// new
function newCanvas(width = 1920, height = 1080) {
    let canvas = document.createElement('canvas')
    canvas.width = width;
    canvas.height = height;
    canvas.style.webkitAppRegion = "drag"
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
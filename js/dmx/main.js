// maybe do hierarchy/render view/inspector style editor
// so it can assign stuff manually or with inspector selection through transform manually entering values.
// base workflow
let canvas = newCanvas(1920, 1080);
let ctx = canvas.getContext('2d')

// Debug
let isGridPreview = false;
let canvas2, ctx2;
if (isGridPreview) {
    canvas2 = newCanvas(node1.pixelSettings.gridSize.x, node1.pixelSettings.gridSize.y);
    ctx2 = canvas2.getContext('2d')
}

let nodes = []

let node1 = new Gridnode()
let depthNode = new Gridnode()

let colorNode = new Gridnode()

//let uni0 = createVRSLGridnode(0)
//let uni1 = createVRSLGridnode(1)
//let uni2 = createVRSLGridnode(2)
//nodes.push(uni0, uni1, uni2)

function createVRSLGridnode(universe) {
    let node = new Gridnode()
    node.maxChannels = 512;
    node.pixelSettings.realSize.set(16, 16)
    node.pixelSettings.count.set(40, 13)
    node.offset = new Vector2(node.pixelSettings.realSize.x * node.pixelSettings.count.x * universe, 0)
    node.apply_settings()
    node.workers.push(new AllColorWorker(new Vector3(255, 255, 255)))
    return node;
}

node1.workers.push(new AllColorWorker())
node1.apply_settings()

// 1st texture = color
// 2nd texture = depth

// 568 x 568
//

const get_count = (pixelSizeX) => 568 / pixelSizeX;
const get_pixel_size = (countX) => 568 / countX

let count = 17
let pixel = get_pixel_size(count)

colorNode.workers.push(new AllColorWorker(new Vector3(255, 125, 0)))
colorNode.offset = new Vector2(0,canvas.height - colorNode.pixelSettings.gridSize.y)
colorNode.apply_settings()

colorNode.pixelSettings.realSize.set(pixel, pixel)
colorNode.pixelSettings.count.set(count, count)
colorNode.scrollReverse = true;
colorNode.pixelSettings.apply_settings()
colorNode.offset = new Vector2(0, canvas.height - colorNode.pixelSettings.gridSize.y)
colorNode.apply_settings()

console.log(colorNode.pixelSettings.count.x * colorNode.pixelSettings.realSize.x)

//console.log(colorNode.pixelSettings.gridSize.x*colorNode.pixelSettings.realSize.x)

depthNode.workers.push(new ParWorker(new Vector3(255, 0, 0)))
depthNode.pixelSettings.realSize.set(pixel, pixel)
depthNode.pixelSettings.count.set(count, count)
depthNode.scrollReverse = true;
depthNode.offset = new Vector2(colorNode.pixelSettings.count.x*colorNode.pixelSettings.realSize.x, 
    canvas.height - colorNode.pixelSettings.gridSize.y)
depthNode.pixelSettings.apply_settings()
depthNode.apply_settings()
console.log(depthNode.offset)

nodes.push(node1, colorNode, depthNode)
console.log(colorNode.pixelSettings.gridSize.x)

console.log(`canvas scale ${canvas.width} ${canvas.height}` /*+ 
    `\nreal pixel size ${node1.pixelSettings.realSize.x} ${node1.pixelSettings.realSize.y}` + 
    `\npixels ${node1.pixelSettings.count.x} ${node1.pixelSettings.count.y} (total ${node1.pixelSettings.count.x * node1.pixelSettings.count.y})` + 
    `\ngrid size ${node1.pixelSettings.gridSize.x} ${node1.pixelSettings.gridSize.y}` + 
    `\noffset ${node1.offset.x} ${node1.offset.y}`*/)

/*let universes = []
for (let i = 0; i < 3; i++) {
    universes[i] = new Universe(i);
}*/

// Main render
class Renderer {
    debug_patch = false;
    counter = 0;
    time = 0;
    tps = 0;
    ticks = 0;
    tick_array = []

    nodes = []
    ctx = null

    _pos = new Vector2(0, 0)

    constructor(nodes, ctx) {
        nodes.forEach(node => {
            this.nodes.push(node)
        });
        this.ctx = ctx;
    }

    render() {
        this.time = performance.now()
        this.counter = 0;

        this.nodes.forEach(node => {
            node.render(ctx)
        })
        
        this.tick_array.push(performance.now() - this.time)
    }
}

let renderer = new Renderer(nodes, ctx)
let pause = false;

function request_render() {
    if (!pause) renderer.render();

    //setTimeout(() => {
        requestAnimationFrame( request_render )
    //}, 500)
}

request_render()

setInterval(() => {
    calculateAverageTime(renderer.tick_array)
}, 1000);

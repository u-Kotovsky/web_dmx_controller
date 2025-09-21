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
let node2 = new Gridnode()

let uni0 = createVRSLGridnode(0)
let uni1 = createVRSLGridnode(1)
let uni2 = createVRSLGridnode(2)

nodes.push(node1, node2, uni0, uni1, uni2)

function createVRSLGridnode(universe) {
    let node = new Gridnode()
    node.maxChannels = 512;
    node.pixelSettings.realSize.set(16, 16)
    node.pixelSettings.count.set(40, 13)
    node.offset = new Vector2(node.pixelSettings.realSize.x * node.pixelSettings.count.x * universe, 0)
    node.apply_settings()
    node.workers.push(new AllColorWorker())
    return node;
}

node1.workers.push(new TestWorker())
node2.workers.push(new FrameTestWorker())
node2.offset = new Vector2(0,canvas.height - node2.pixelSettings.gridSize.y)
node2.apply_settings()
node2.workers.push(new AllColorWorker())
/*
node2.pixelSettings.realSize.set(8, 8)
node2.pixelSettings.count.set(32, 32)
node2.scrollReverse = true;
node2.pixelSettings.apply_settings()
node2.offset = 
 new Vector2(
    0,
    canvas.height - node2.pixelSettings.gridSize.y
)
node2.apply_settings()
console.log(node2.pixelSettings.gridSize.x)*/


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
    if (!pause) {
        renderer.render();
    }

    //setTimeout(() => {
        requestAnimationFrame( request_render )
    //}, 500)
}

request_render()

setInterval(() => {
    calculateAverageTime(renderer.tick_array)
}, 1000);

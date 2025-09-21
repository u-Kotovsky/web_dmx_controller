
class Pixel {
    realSize = new Vector2(16, 16)
    count = new Vector2(8, 8)
    gridSize = new Vector2(0, 0)

    constructor(sizeX = 16, sizeY = 16, countX = 8, countY = 8) {
        this.realSize.set(sizeX, sizeY)
        this.count.set(countX, countY)
        this.apply_settings()
    }

    apply_settings() {
        this.gridSize.set(this.count.x * this.realSize.x, this.count.y * this.realSize.y)
    }
}

function fill(array, length, template_callback = (i) => 0) {
    for (let i = 0; i < length; i++)
        array[i] = template_callback(i);
}

class Gridnode {
    pixelSettings = new Pixel()
    lastPixelPosition = new Vector2(0, 0)

    // how to get corner?
    // prob additive X/Y
    // last pixel (right bottom corner) = canvas.width/height (1920, 1080)
    // soo subtract from that width of our custom shit
    // Grid position on screen
    offset = new Vector2(0, 0)
    maxChannels = -1;
    length = 0
    data = []
    workers = []
    debug_patch = false;

    _pos = new Vector2(0, 0)

    constructor() {
        this.offset = 
            new Vector2(canvas.width - this.pixelSettings.gridSize.x, 
                canvas.height - this.pixelSettings.gridSize.y); // bottom right corner
            //new Vector2(0, 0); // default
        
        this.apply_settings();
    }

    apply_settings() {
        let count = this.pixelSettings.count.x * this.pixelSettings.count.y

        if (this.maxChannels > 0 && count > this.maxChannels) {
            count = this.maxChannels
        }

        this.length = count
        fill(this.data, count, (i) => { 
            return new Vector3(255, 0, 0) 
        })

        this.pixelSettings.apply_settings()
    }

    render(ctx) {
        this.lastPixelPosition.set(0, 0)
        this.workers.forEach(worker => {
            worker.write(this);
        })

        //this.data[0] = new Vector3(50, 0, 0)
        for (let i = 0; i < (this.data.length > this.length ? this.data.length : this.length); i++) {
            if (this.maxChannels > 0 && i > this.maxChannels) {
                throw i, this.maxChannels
            }
            let vector = new Vector3(); // out color
            this._pos.set(this.offset.x + this.lastPixelPosition.x, this.offset.y + this.lastPixelPosition.y);

            if (this.debug_patch) {
                if (this.data.length > this.length) {
                    throw `${this.data.length} ${this.length}`
                    vector.z = 125;
                } else {
                    vector.y = 125;
                }

                if (this.data[i] == null) {
                    throw this.data[i]
                    vector.x = 255;
                }
                ctx.fillStyle = 'rgb(255, 0, 0)'
                this._pos.add(2, 12)
                draw_text(ctx, this._pos, `${i}`, '.9em', 'Calibri', 'start', 'alphabetic', false)
            } else {
                if (this.data[i] == null) {
                    throw this.data[i]
                    vector.set(125, 0, 0);
                } else {
                    if (isVector3(this.data[i]))
                        vector.set(this.data[i].x, this.data[i].y, this.data[i].z);
                    else 
                        vector.set(this.data[i], this.data[i], this.data[i]);
                }
                //this._pos.add(2, 12)
                //ctx.fillStyle = 'rgb(255, 255, 0)'
                //draw_text(ctx, this._pos, `${i}`, '.7em', 'Arial', 'start', 'alphabetic', false)
                //draw_rect(ctx2, renderer.lastPixelPosition, pixel.realSize, 
                //    this.data[i] != null ? vector.getColor() : 'rgb(255, 0, 0)');
            }
            
            draw_rect(ctx, this._pos, this.pixelSettings.realSize, 
                this.debug_patch 
                ? this.data[i] != null ? vector.getColor() : 'rgb(255, 125, 0)'
                : vector.getColor());
            if (isGridPreview) {
                draw_rect(ctx2, this.lastPixelPosition, this.pixelSettings.realSize, this.debug_patch 
                    ? this.data[i] != null ? vector.getColor() : 'rgb(255, 0, 0)'
                    : vector.getColor());
            }

            this.counter++;
            this.lastPixelPosition.y += this.pixelSettings.realSize.y;
            if (this.lastPixelPosition.y >= this.pixelSettings.realSize.y * this.pixelSettings.count.y) {
                this.lastPixelPosition.y = 0;
                this.lastPixelPosition.x += this.pixelSettings.realSize.x;
            }
        }
    }
}
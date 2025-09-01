class Entity {
    UniqueId = RandomString.UUIDGeneratorBrowser();
    Components = new Map();

    constructor() {}

    AddComponent(component) {
        if (typeof component == 'string') {
            this.Components.set(component, new globalThis.Components[component]())

            return this;
        }

        this.Components.set(component.name, new component());

        return this;
    }

    RemoveComponent(key) {
        this.Components.delete(key);
        
        return this;
    }

    HasComponent(key) {
        if (['function', 'object'].includes(typeof key)) {
            return this.Components.has(key.name);
        }

        if (typeof key == 'string') {
            return this.Components.has(key);
        }
    }

    GetComponent(key) {
        if (['function', 'object'].includes(typeof key)) {
            return this.Components.get(key.name);
        }

        if (typeof key == 'string') {
            return this.Components.get(key);
        }
    }

    /**
     * @param {JSON} json 
     * @returns {Entity}
     */
    static FromNetwork(json) {
        let entity = new Entity();
        let components = json.Components;

        entity.UniqueId = json.UniqueId;
        
        for (let name in components) {
            entity.AddComponent(name);

            for (let key in components[name]) {
                let component = components[name];
                let property = component[key];

                if (typeof property == 'object') {
                    
                    for (let pkey in component) {
                        if (typeof component[pkey] == 'object') {
                            for (let skey in component[pkey]) {
                                entity.GetComponent(name)[key][skey] = property[skey];
                            }
                        } else {
                            entity.GetComponent(name)[key][pkey] = component[pkey];
                        }
                    }
                } else {
                    entity.GetComponent(name)[key] = property;
                }
            }
        }

        return entity;
    }
}

class Engine extends Network {
    entitys = new Map();
    display = null;
    canvas = null;
    ctx = null;
    ticks = 0;
    lastTick = 0;
    entityCount = 0;
    displaySize = new Vector2(0, 0);
    ClientId = null;

    //stats = new Stats()

    constructor (canvas) {
        super();
        //globalThis.Engine = this;
        this.display = canvas;
        this.canvas = canvas.querySelector('canvas');
        this.ctx = canvas.getContext('2d');
        this.displaySize.set(this.display.width, this.display.height);
        
        this._vwh = new Vector2(this.display.width, this.display.height)

        globalThis.Engine = this;

        //Engine.stats.addPanel(  )
        //globalThis.Engine.stats.showPanel( 1 )
        //document.body.appendChild(globalThis.Engine.stats.dom)
        console.log('Engine init', Engine.stats);
        //this.ConnectToServer('ws://127.0.0.1:5050/');
        this.Tick();
    }

    _v0 = new Vector2(0, 0)
    _vwh = null;//new Vector2(globalThis.Engine.displaySize.x, globalThis.Engine.displaySize.y)
    _c = 'rgb(25, 25, 25)'

    Tick() {
        //globalThis.Engine.stats.begin();
        //if (!globalThis.Engine) {
        //    throw new Error('Engine was ' + globalThis.Engine);
        //}

        // Clear canvas

        globalThis.Engine.DrawRect(
            globalThis.Engine._v0, 
            globalThis.Engine._vwh,
            globalThis.Engine._c
        )

        /*globalThis.Engine.DrawRect(
            new Vector2(0, 0), 
            new Vector2(globalThis.Engine.displaySize.x, globalThis.Engine.displaySize.y),
            'rgb(25, 25, 25)'
        )*/

        // Update all entitys with their components
        globalThis.Engine.entitys.forEach(entity => {
            entity.Components.forEach(component => {
                component.Update(globalThis.Engine, entity);
                component.LateUpdate(globalThis.Engine, entity);
            })
        })

        // counting
        //globalThis.Engine.ticks++;
        //globalThis.Engine.entityCount = globalThis.Engine.entitys.size;
        //globalThis.Engine.stats.end();

        requestAnimationFrame(globalThis.Engine.Tick);
    }

    /**
     * @param {Entity} entity 
     */
    AddEntity(entity) {
        this.entitys.set(entity.UniqueId, entity)

        entity.Components.forEach(component => {
            component.Awake(globalThis.Engine, entity);
            component.Start(globalThis.Engine, entity);
        })
    }

    /**
     * @param {Entity} entity 
     */
    DeleteEntity(entity) {
        this.entitys.delete(entity.UniqueId);
    }

    GetEntity(id) {
        return this.entitys.get(id);
    }

    ToggleBorders() {
        this.display.style.borderStyle = this.display.style.borderStyle == '' ? 'solid' : '';
        this.display.style.borderColor = this.display.style.borderColor == '' ? 'rgb(200, 25, 25)' : '';
    }

    pi2 = Math.PI*2
    
    /**
     * Drawing circle in canvas
     * @param {Vector2} position 
     * @param {Number} scale 
     * @param {String} color 
     */
    DrawCircle(position, scale, color) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(position.x, position.y, scale, 0, this.pi2);
        this.ctx.fill();
    }

    /**
     * Drawing rectangle in canvas
     * @param {Vector2} position 
     * @param {Vector2} scale 
     * @param {String} color 
     */
    DrawRect(position, scale, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(position.x, position.y, scale.x, scale.y)
    }

    /**
     * Drawing image in canvas
     * @param {Vector2} position 
     * @param {*} image 
     */
    DrawImage(position, image) {
        this.ctx.drawImage(image, position.x, position.y);
    }

    /**
     * Drawing text in canvas
     * @param {Vector2} position 
     * @param {String} text 
     * @param {Number} size 
     * @param {String} font 
     * @param {String} align 
     * @param {String} baseline 
     * @param {String} stroke 
     */
    DrawText(position, text, size, font, align, baseline, stroke) {
        this.ctx.font = size + ' ' + font;
        this.ctx.textAlign = align;
        this.ctx.textBaseline = baseline;

        if (stroke) {
            this.ctx.strokeText(text, position.x, position.y);
            return;
        }

        this.ctx.fillText(text, position.x, position.y);
    }
}
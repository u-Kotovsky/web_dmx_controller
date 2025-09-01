class Behaviour {
    UniqueId = RandomString.UUIDGeneratorBrowser();
    Enabled = true;

    constructor() {}

    /**
     * @param {Engine} Engine
     * @param {Entity} Entity 
     */
    Awake(Engine, Entity) {}

    /**
     * @param {Engine} Engine
     * @param {Entity} Entity 
     */
    Start(Engine, Entity) {
        //console.log('Entity(' + Entity.UniqueId + ') ' + Object.getPrototypeOf(this).constructor.name + '::Start()')
    }

    /**
     * @param {Engine} Engine
     * @param {Entity} Entity 
     */
    Update(Engine, Entity) {}

    /**
     * @param {Engine} Engine
     * @param {Entity} Entity 
     */
    LateUpdate(Engine, Entity) {}

    OnKeyDown(ev) {}
    OnKeyUp(ev) {}
    OnKeyPress(ev) {}
}

class Transform extends Behaviour {
    position = new Vector2(0, 0);
    rotation = new Quaternion();

    /**
     * @param {JSON} json 
     * @returns {Transform}
     */
    static FromJSON(json) {
        let component = new Transform();

        component.position = new Vector2(json.position.x, json.position.y);
        component.rotation = new Vector2(json.rotation.x, json.rotation.y, json.rotation.z, json.rotation.w);

        return component;
    }
}

class Sprite extends Behaviour {
    sprite = null;

    /**
     * @param {JSON} json 
     * @returns {Sprite}
     */
    static FromJSON(json) {
        let component = new Sprite();

        component.sprite = json.sprite;

        return component;
    }
}

class Shape extends Behaviour {
    radius = 1;
    color = '#000000'

    /**
     * @param {Engine} Engine
     * @param {Entity} Entity 
     */
    Update(Engine, Entity) {
        Engine.DrawCircle(Entity.GetComponent(Transform).position, this.radius, this.color);
    }

    /**
     * @param {JSON} json 
     * @returns {Shape}
     */
    static FromJSON(json) {
        let component = new Shape();

        component.radius = json.radius;
        component.color = json.color;

        return component;
    }
}

class Text extends Behaviour {
    value = 'New Text';
    stroke = false;
    size = 14;
    sizeType = 'px';
    font = 'serif';
    align = TextAlign.center;
    baseline = TextBaseline.alphabetic;
    direction = TextDirection.inherit;
    offset = new Vector2(0, 0);

    Update(Engine, Entity) {
        let transform = Entity.GetComponent(Transform);
        let position = new Vector2(transform.position.x, transform.position.y);

        position.x += this.offset.x
        position.y += this.offset.y;

        Engine.DrawText(position, this.value, this.size + this.sizeType, this.font, this.align, this.baseline, this.stroke);
    }

    /**
     * @param {JSON} json 
     * @returns {Text}
     */
    static FromJSON(json) {
        let component = new Text();

        component.value = json.value;
        component.stroke = json.stroke;
        component.size = json.size;
        component.sizeType = json.sizeType;
        component.font = json.font;
        component.align = json.align;
        component.baseline = json.baseline;
        component.direction = json.direction;
        component.offset = new Vector2(json.offset.x, json.offset.y);

        return component;
    }
}

class PlayerController extends Behaviour {
    movement = new Vector2();
    movementPrevious = new Vector2();
    speed = 1;
    move = false;

    static controls = {
        W: [ 'w', 'ц' ],
        A: [ 'a', 'ф' ],
        S: [ 's', 'ы' ],
        D: [ 'd', 'в' ],
    }

    Start(Engine, Entity) {
        addEventListener('keydown', (ev) => {
            if (Entity.UniqueId != globalThis.Engine.ClientId) {
                return;
            }
            this.movementPrevious.set(this.movement.x, this.movement.y);

            let key = ev.key.toLowerCase();

            if (PlayerController.controls.W.includes(key)) {
                this.movement.set(this.movement.x, 1);
            }

            if (PlayerController.controls.S.includes(key)) {
                this.movement.set(this.movement.x, -1);
            }

            if (PlayerController.controls.A.includes(key)) {
                this.movement.set(-1, this.movement.y);
            }

            if (PlayerController.controls.D.includes(key)) {
                this.movement.set(1, this.movement.y);
            }
        })
        addEventListener('keyup', (ev) => {
            if (Entity.UniqueId != globalThis.Engine.ClientId) {
                return;
            }
            this.movementPrevious.set(this.movement.x, this.movement.y);

            let key = ev.key.toLowerCase();

            if (key.match('w') || key.match('s')) {
                this.movement.set(this.movement.x, 0);
            }

            if (key.match('a') || key.match('d')) {
                this.movement.set(0, this.movement.y);
            }
        })

        //setInterval(() => {
            //globalThis.Engine.ChangeComponent(Entity.GetComponent(Transform));
            //globalThis.Engine.ChangeComponent(this);
        //}, 1000)
    }

    Update(Engine, Entity) {
        if (Entity.UniqueId == globalThis.Engine.ClientId) {
            //this.movementPrevious.set(this.movement.x, this.movement.y);
        }
        let transform = Entity.GetComponent(Transform);
        let shape = Entity.GetComponent(Shape);

        let direction = new Vector2(
            transform.position.x + this.speed * this.movement.x,
            transform.position.y + this.speed * -this.movement.y
        );

        /*
        // check borders for x
        if (direction.x - shape.radius < 0) {
            direction.set(1, direction.y);
        }

        if (transform.position.x + shape.radius > Engine.displaySize.x) {
            direction.set(Engine.displaySize.x - 2, direction.y);
        }

        // check borders for y
        if (transform.position.y - shape.radius < 0) {
            direction.set(direction.x, 0);
        }

        if (transform.position.y + shape.radius > Engine.displaySize.y) {
            direction.set(direction.x, Engine.displaySize.y);
        }*/

        Entity.GetComponent(Transform).position = direction;

        this.move = false;
        if (this.movementPrevious.x != this.movement.x || this.movementPrevious.y != this.movement.y) {
            //globalThis.Engine.ChangeComponent(this);
            this.move = true;
        }

        this.movementPrevious.set(0, 0)
        
    }

    /**
     * @param {JSON} json 
     * @returns {PlayerController}
     */
    static FromJSON(json) {
        let component = new PlayerController();

        component.speed = json.speed;
        component.movement = new Vector2(json.movement.x, json.movement.y);

        return component;
    }
}

class OldLogoRicochet extends Behaviour {
    direction = new Vector2(1, 1);
    position = new Vector2();
    speed = 1;

    Update(Engine, Entity) {
        let transform = Entity.GetComponent(Transform);
        let shape = Entity.GetComponent(Shape);

        // check borders for x
        if (transform.position.x - shape.radius < 0) {
            this.direction.set(1, this.direction.y);
        }

        if (transform.position.x + shape.radius > Engine.displaySize.x) {
            this.direction.set(-1, this.direction.y);
        }

        // check borders for y
        if (transform.position.y - shape.radius < 0) {
            this.direction.set(this.direction.x, 1);
        }

        if (transform.position.y + shape.radius > Engine.displaySize.y) {
            this.direction.set(this.direction.x, -1);
        }

        Entity.GetComponent(Transform).position = new Vector2(
            transform.position.x + (this.speed * this.direction.x),
            transform.position.y + (this.speed * this.direction.y)
        );
    }
    
    /**
     * @param {JSON} json 
     * @returns {OldLogoRicochet}
     */
     static FromJSON(json) {
        let component = new OldLogoRicochet();

        component.direction = new Vector2(json.direction.x, json.direction.y);
        component.position = new Vector2(json.position.x, json.position.y);
        component.speed = json.speed;

        return component;
    }
}

class Rigidbody extends Behaviour {
    velocity = new Vector2();
    gravity = true;
    bounciness = 1;
    drag = 0.1;

    Update(Engine, Entity) {
        let transform = Entity.GetComponent(Transform);

        // Gravity check
        if (this.gravity) {
            this.velocity.set(this.velocity.x, this.velocity.y + 9.81/16);
        }

        // Collision check
        Engine.entitys.forEach(entity => {
            if (Entity.UniqueId != entity.UniqueId) {
                let transform1 = Entity.GetComponent(Transform);
                let transform2 = entity.GetComponent(Transform);
                let bounciness2 = entity.HasComponent(Rigidbody) ? entity.GetComponent(Rigidbody).spring : 1;
        
                if (transform1.position.distance(transform2.position) <= Entity.GetComponent(Shape).radius + entity.GetComponent(Shape).radius) {
                    //collide point
                    let hitPoint = new Vector2(
                        transform1.position.x - transform2.position.x, 
                        transform1.position.y - transform2.position.y
                    );

                    // bounciness
                    let bounciness = this.bounciness + bounciness2;

                    let x = bounciness * 0.0001;
                    let y = bounciness * 0.0001

                    this.velocity.set(this.velocity.x * x, this.velocity.y * y);
                }
            }
        });

        transform.position.x += this.velocity.x;
        transform.position.y += this.velocity.y;

        this.velocity.x = this.velocity.x / 1.5;
        this.velocity.y = this.velocity.y / 1.5;


        if (transform.position.x < 0 || transform.position.x > Engine.displaySize.x) {
            //console.log('Out of bounds at X: ' + transform.position.x);
            transform.position.x = Engine.displaySize.x/2;
            // reset x velocity
            this.velocity.set(0, this.velocity.y);
            //this.gravity = false;
            //Engine.DeleteEntity(Entity);
        }

        if (transform.position.y < 0 || transform.position.y > Engine.displaySize.y) {
            //console.log('Out of bounds at Y: ' + transform.position.y);
            transform.position.y = Engine.displaySize.y/3;
            // reset y velocity
            this.velocity.set(this.velocity.x, 0);
            //this.gravity = false;
            //Engine.DeleteEntity(Entity);
        }

        
        Entity.GetComponent(Transform).position = transform.position;
    }
    
    /**
     * @param {JSON} json 
     * @returns {Rigidbody}
     */
     static FromJSON(json) {
        let component = new Rigidbody();

        component.velocity = new Vector2(json.velocity.x, json.velocity.y);
        component.gravity = json.gravity;
        component.bounciness = json.bounciness;
        component.drag = json.drag;

        return component;
    }
}

class LogoRicochet extends Behaviour {
    direction = new Vector2(1, 1);
    position = new Vector2();
    speed = 1;

    shades = [];
    lastShade = new Vector2(0, 0)

    _transform = null;
    _shape = null;
    _i = null;
    _color = RandomString.randomRGBA();
    _vector2 = new Vector2()

    _radius = 30

    _sdx = 1;
    _sdy = 1;


    CollisionCheck(Engine, transform){//, shape) {
        // check borders for x
        if (transform.position.x - this._radius < 0) {
            this.direction.set(1, this.direction.y);
            this._sdx = 1 * this.speed;
        }

        if (transform.position.x + this._radius > Engine.displaySize.x) {
            this.direction.set(-1, this.direction.y);
            this._sdx = -1 * this.speed;
        }

        // check borders for y
        if (transform.position.y - this._radius < 0) {
            this.direction.set(this.direction.x, 1);
            this._sdy = 1 * this.speed;
        }

        if (transform.position.y + this._radius > Engine.displaySize.y) {
            this.direction.set(this.direction.x, -1);
            this._sdy = -1 * this.speed;
        }
    }

    Start() {
        this.UpdateSpeedDirection();
        //this.shades.push(this._vector2)
    }

    UpdateSpeedDirection() {
        this._sdx = this.direction.x * this.speed;
        this._sdy = this.direction.y * this.speed;
    }

    Update(Engine, Entity) {
        this._transform = Entity.GetComponent(Transform);
        //this._shape = Entity.GetComponent(Shape);

        this.CollisionCheck(Engine, this._transform)//, this._shape)

        if (this.shades.length < 1)
            this.shades.push(this._transform.position.copy())

        

        if (this._transform.position.distance(this.shades[0]) > 1)
            this.shades.push(this._transform.position)

        for (this._i = 0; this._i < this.shades.length; this._i++) {
            Engine.DrawCircle(this.shades[this._i], 4 * .05 * this._i, this._color);
        }

        if (this.shades.length > 30) 
            this.shades.shift()


        /*this._i = 0;
        while (this._i < this.shades.length) {
            Engine.DrawCircle(this.shades[this._i], (this._i + 1)*2, this._color);
            this._i++;
        }*/

        //for (this._i = 0; this._i < this.shade.length; this._i++) {
        //    Engine.DrawCircle(this.shade[this._i], this._shape.radius * .05 * this._i, this._color);
        //}

        this._vector2.set(
            this._transform.position.x + this._sdx,
            this._transform.position.y + this._sdy
        );

        Entity.GetComponent(Transform).position = this._vector2
    }
    
    /**
     * @param {JSON} json 
     * @returns {OldLogoRicochet}
     */
     static FromJSON(json) {
        let component = new OldLogoRicochet();

        component.direction = new Vector2(json.direction.x, json.direction.y);
        component.position = new Vector2(json.position.x, json.position.y);
        component.speed = json.speed;

        return component;
    }
}

globalThis.Components = {
    Behaviour,
    Transform,
    Sprite,
    Shape,
    Text,
    PlayerController,
    OldLogoRicochet,
    Rigidbody,
    LogoRicochet
}
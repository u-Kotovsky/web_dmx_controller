class Vector {
    isVector = true;
}


class Vector2 extends Vector {
    x = 0;
    y = 0;

    constructor(x = 0, y = 0) {
        super();
        this.x = x;
        this.y = y;
    }

    set(x = this.x, y = this.y) {
        this.x = x;
        this.y = y;
    }

    multiply(vector2) {
        this.x *= vector2.x;
        this.y *= vector2.y;
    }
    
    multiply(x = 1, y = 1) {
        this.x *= x;
        this.y *= y;
    }
    
    add(vector2) {
        this.x += vector2.x;
        this.y += vector2.y;
    }

    add(x = 0, y = 0) {
        this.x += x;
        this.y += y;
    }
    
    subtract(vector2) {
        this.x -= vector2.x;
        this.y -= vector2.y;
    }

    subtract(x = 0, y = 0) {
        this.x -= x;
        this.y -= y;
    }

    distance(second) {
        if (second == null || second.x == null || second.y == null) return 0;
        let x1 = this.x - second.x;
        let y1 = this.y - second.y;

        return Math.hypot(x1, y1);
    }

    copy() {
        return { x: this.x, y: this.y, }
    }
}

class Vector3 extends Vector {
    x = 0;
    y = 0;
    z = 0;

    constructor(x = 0, y = 0, z = 0) {
        super();
        this.x = x;
        this.y = y;
        this.z = z;
    }

    set(x = this.x, y = this.y, z = this.z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    // buggy?
    distance(second) {
        let x1 = -x + second.x;
        let y1 = -y + second.y;
        let z1 = -z + second.z;

        return Math.sqrt((x1 * x1) + (y1 * y1) + (z1 * z1));
    }
    
    subtract(vector3) {
        this.x -= vector3.x;
        this.y -= vector3.y;
        this.z -= vector3.z;
    }

    subtract(x = 0, y = 0, z = 0) {
        this.x -= x;
        this.y -= y;
        this.z -= z;
    }

    add(x = 0, y = 0, z = 0) {
        this.x += x;
        this.y += y;
        this.z += z;
    }

    getColor() {
        return `rgb(${this.x}, ${this.y}, ${this.z})`
    }
}

class Quaternion {
    x = 0;
    y = 0;
    z = 0;
    w = 0;

    constructor(x = 0, y = 0, z = 0, w = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    set(x = this.x, y = this.y, z = this.z, w = this.w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
}
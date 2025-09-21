function isVector3(data) {
    return Object.keys(data).includes('x');
}
function calculateAverageTime(tick_array) {
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

function isVector3NaN(vector3) {
    return isNaN(vector3.x) || isNaN(vector3.y) || isNaN(vector3.z)
}
function isValidVector3(vector3) {
    return vector3 != null && !isVector3NaN(vector3);
}
function isValidNumber(num) {
    return num != null && !isNaN(num)
}

function apply_data_to_block(block, data) {
    // Apply data -> block
    // data can be Number or Vector3
    // block can be Number or Vector3
    if (isVector3(block)) {
        if (isVector3(data)) {
            block.set(data.x, data.y, data.z)
        } else {
            block.x = data
            block.y = data
            block.z = data
        }
    } else {
        if (isVector3(data)) {
            block = data.x
        } else {
            block = data
        }
    }
}

function apply_mirror(data) {
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
                if (value > 0) data[index] = value;
            }
        }
    }
}
function isVector3(data) {
    return Object.keys(data).includes('x');
}
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

function isVector3NaN(vector3) {
    return isNaN(vector3.x) || isNaN(vector3.y) || isNaN(vector3.z)
}
function isValidVector3(vector3) {
    return vector3 != null && !isVector3NaN(vector3);
}
function isValidNumber(num) {
    return num != null && !isNaN(num)
}
const svg = document.getElementById('svg-element');
const warp = new Warp(svg);

warp.interpolate(4);
warp.transform(([x, y]) => [x, y, y]);
let offset = 0;
let initial = 8;
let k = 5;

function animate() {
    warp.transform(([x, y, oy]) => [x + 0.25*Math.sin(y / (initial * k) + offset), oy + initial * Math.sin(x / (initial * k) + offset), oy])
    offset += 0.05;
    requestAnimationFrame(animate)
}

animate();
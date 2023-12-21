import { canvas, ctx } from "./lib/render.js";
import GameObject from "./shared/GameObject.js";
import Room from "./shared/Room.js";

const world = [];

function getWorld(x, y) {
    return world[y * 10 + x];
}

function setWorld(x, y, value) {
    world[y * 10 + x] = value;
}

for (let i = 0; i < 100; i ++) {
    world[i] = new Room();
    world[i].width = 100;
    world[i].height = 100;
}

const player = new GameObject();
let playerRoom = getWorld(4, 4);

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function main() {
}
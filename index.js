import { canvas, ctx, drawText } from "./lib/render.js";
import GameObject from "./shared/GameObject.js";
import Room from "./shared/Room.js";

/**
 * @type {Room[]}
 */
const world = [];

/**
 * @param {number} x 
 * @param {number} y 
 * @returns {Room}
 */
function getWorld(x, y) {
    return world[y * 10 + x];
}

function setWorld(x, y, value) {
    world[y * 10 + x] = value;
}

for (let i = 0; i < 100; i ++) {
    world[i] = new Room();
    world[i].width = 300;
    world[i].height = 300;
}

const player = new GameObject();
player.roomX = 4;
player.roomY = 4;

function draw() {
    requestAnimationFrame(draw);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(1, 1);

    for (let x = player.roomX - 1; x <= player.roomX + 1; x ++) {
        for (let y = player.roomY - 1; y <= player.roomY + 1; y ++) {
            const room = getWorld(x, y);
            if (room) {
                const xx = (x - player.roomX) * 300;
                const yy = (y - player.roomY) * 300;

                ctx.save();
                ctx.translate(xx, yy);
                room.draw();
                drawText(`${x}, ${y}`, 0, 0, 50, "#FFFFFF");
                ctx.restore();
            }
        }
    }

    ctx.restore();
}

function main() {
    draw();
}

main();

window.addEventListener("keydown", event => {
    switch (event.key) {
        case "ArrowUp":
            player.roomY --;
            break;
        case "ArrowDown":
            player.roomY ++;
            break;
        case "ArrowLeft":
            player.roomX --;
            break;
        case "ArrowRight":
            player.roomX ++;
            break;
    }

    player.roomX = Math.max(0, Math.min(9, player.roomX));
    player.roomY = Math.max(0, Math.min(9, player.roomY));
});
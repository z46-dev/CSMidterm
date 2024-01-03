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

function getDisplayNumber(number) {
    if (number < 0) {
        return 10;
    }

    if (number > 9) {
        return 1;
    }

    return number + 1;
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
            const X = getDisplayNumber(x);
            const Y = getDisplayNumber(y);
            const room = getWorld(X - 1, Y - 1);
            if (room) {
                const xx = (x - player.roomX) * 300;
                const yy = (y - player.roomY) * 300;

                ctx.save();
                ctx.translate(xx, yy);
                room.draw();
                ctx.textAlign = "left";
                ctx.textBaseline = "top";
                drawText(`(${X}, ${Y})`, -145, -145, 15, "#FFFFFF");
                ctx.restore();
            }
        }
    }

    ctx.beginPath();
    for (let i = 0; i < 3; i ++) {
        const k = (i - 1) * 300;
        ctx.moveTo(k, -450);
        ctx.lineTo(k, 450);
        ctx.moveTo(-450, k);
        ctx.lineTo(450, k);
    }
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#FF0000";
    ctx.stroke();

    ctx.restore();
}

function main() {
    draw();
}

main();

window.addEventListener("keydown", event => {
    switch (event.key) {
        case "ArrowUp":
        case "w":
            player.roomY --;
            break;
        case "ArrowDown":
        case "s":
            player.roomY ++;
            break;
        case "ArrowLeft":
        case "a":
            player.roomX --;
            break;
        case "ArrowRight":
        case "d":
            player.roomX ++;
            break;
    }

    if (player.roomX < 0) {
        player.roomX = 9;
    } else if (player.roomX > 9) {
        player.roomX = 0;
    }

    if (player.roomY < 0) {
        player.roomY = 9;
    } else if (player.roomY > 9) {
        player.roomY = 0;
    }
});
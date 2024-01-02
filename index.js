import { canvas, ctx, drawText, uiScale } from "./lib/render.js";
import { World, GameObject } from "./shared/Objects.js";

World.init();

function getDisplayNumber(number) {
    if (number < 0) {
        return World.width;
    }

    if (number > World.width - 1) {
        return 1;
    }

    return number + 1;
}

const player = new GameObject();
player.draw = player.drawPlayer;
player.addToRoom(World.getRoom(0, 0));

const dragon = new GameObject();
dragon.draw = dragon.drawDragon;
dragon.addToRoom(World.getRoom(8, 13));

function draw() {
    requestAnimationFrame(draw);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    const scale = uiScale();
    ctx.scale(scale, scale);

    const roomsInView = 17;
    const roomsOnSide = (roomsInView - 1) / 2;
    const cellSize = 750 / roomsInView;

    for (let x = player.roomX - roomsOnSide; x <= player.roomX + roomsOnSide; x++) {
        for (let y = player.roomY - roomsOnSide; y <= player.roomY + roomsOnSide; y++) {
            const X = getDisplayNumber(x);
            const Y = getDisplayNumber(y);
            const room = World.getRoom(X - 1, Y - 1);

            if (room) {
                const xx = (x - player.roomX) * cellSize;
                const yy = (y - player.roomY) * cellSize;

                ctx.save();
                ctx.translate(xx, yy);
                ctx.scale(cellSize / room.width, cellSize / room.height);
                room.draw();
                // ctx.textAlign = "left";
                // ctx.textBaseline = "top";
                // drawText(`(${X}, ${Y})`, -cellSize * .1, -cellSize * .1, 20 * (1 / (cellSize / room.width)), "#FFFFFF");
                ctx.restore();
            }
        }
    }

    // ctx.beginPath();
    // for (let i = 0; i <= roomsInView; i++) {
    //     const k = (i - roomsOnSide) * cellSize - cellSize / 2;
    //     const g = cellSize * (roomsInView / 2);
    //     ctx.moveTo(k, -g);
    //     ctx.lineTo(k, g);
    //     ctx.moveTo(-g, k);
    //     ctx.lineTo(g, k);
    // }
    // ctx.lineWidth = 2;
    // ctx.strokeStyle = "#FF0000";
    // ctx.stroke();

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
            player.roomY--;
            break;
        case "ArrowDown":
        case "s":
            player.roomY++;
            break;
        case "ArrowLeft":
        case "a":
            player.roomX--;
            break;
        case "ArrowRight":
        case "d":
            player.roomX++;
            break;
    }

    if (player.roomX < 0) {
        player.roomX = World.width - 1;
    } else if (player.roomX > World.width - 1) {
        player.roomX = 0;
    }

    if (player.roomY < 0) {
        player.roomY = World.height - 1;
    } else if (player.roomY > World.height - 1) {
        player.roomY = 0;
    }

    player.addToRoom(World.getRoom(player.roomX, player.roomY));
});
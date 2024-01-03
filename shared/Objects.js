import { ctx, mixColors } from "../lib/render.js";

export class World {
    static width = 64;
    static height = 64;

    static colors = ["#AAAADD", "#DDAAAA", "#AADDAA", "#DDDDDD"];

    static dist(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
    }

    /**
     * @type {Room[]}
     */
    static rooms = [];

    static init() {
        const colorSpaces = [];

        for (let i = 0; i < World.colors.length; i++) {
            let x, y;

            do {
                x = Math.floor(Math.random() * World.width);
                y = Math.floor(Math.random() * World.height);
            } while (colorSpaces.some(space => World.dist(x, y, space.x, space.y) < World.width / 5));

            colorSpaces.push({
                x: x,
                y: y,
                color: World.colors[i]
            });
        }

        for (let i = 0; i < World.width * World.height; i++) {
            const room = new Room();
            room.width = 300;
            room.height = 300;
            room.x = i % World.width;
            room.y = Math.floor(i / World.width);

            const sorted = colorSpaces.sort((a, b) => World.dist(room.x, room.y, a.x, a.y) - World.dist(room.x, room.y, b.x, b.y));
            const d0 = World.dist(room.x, room.y, sorted[0].x, sorted[0].y);
            const d1 = World.dist(room.x, room.y, sorted[1].x, sorted[1].y);
            room.color = mixColors(sorted[0].color, sorted[1].color, d0 / (d0 + d1));

            World.rooms.push(room);
        }
    }

    /**
     * @param {number} x 
     * @param {number} y 
     * @returns {Room}
     */
    static getRoom(x, y) {
        return World.rooms[y * World.width + x];
    }

    /**
     * @param {number} x 
     * @param {number} y 
     * @param {Room} room 
     */
    static setRoom(x, y, room) {
        World.rooms[y * World.width + x] = room;
        room.x = x;
        room.y = y;
    }
}

export class Room {
    width = 0;
    height = 0;
    x = 0;
    y = 0;
    color = "#000000";

    /**
     * @type {Map<string, GameObject>}
     */
    objects = new Map();

    update() {
        this.objects.forEach(object => object.update());
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        this.objects.forEach(object => object.draw(ctx));
    }
}

export class GameObject {
    static idAccumulator = 0;

    /**
     * @param {CanvasRenderingContext2D} ctx 
     */
    drawPlayer(ctx) {
        ctx.fillStyle = "#00FF00";
        ctx.strokeStyle = mixColors(ctx.fillStyle, "#000000", .2);
        ctx.lineWidth = this.width / 5;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     */
    drawDragon(ctx) {
        ctx.fillStyle = "#FF0000";
        ctx.strokeStyle = mixColors(ctx.fillStyle, "#000000", .2);
        ctx.lineWidth = this.width / 5;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }

    id = GameObject.idAccumulator ++;
    x = 0;
    y = 0;
    width = 0;
    height = 0;
    color = "#000000";

    roomX = 0;
    roomY = 0;

    /**
     * @type {Room}
     */
    room = null;

    update() {}

    draw() {}

    addToRoom(room) {
        if (this.room) {
            this.room.objects.delete(this.id);
        }

        this.room = room;
        room.objects.set(this.id, this);

        this.roomX = room.x;
        this.roomY = room.y;
    }
}
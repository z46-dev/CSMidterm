import quickNoise from "../lib/noise.js";
import { ctx, mixColors } from "../lib/render.js";

export class World {
    static width = 128;
    static height = 128;

    static palette = {
        black: "#000000",
        water: "#1eaefb",
        sand: "#fff5c1",
        grass: "#76ef7c",
        forest: "#16b58d",
        snow: "#ffffff",
        ice: "#b3e1ff",
        mountain: "#b3b3b3",
        redSand: "#ff7f7f"
    };

    static standardColors = [
        [-1, -.9, mixColors(World.palette.water, World.palette.black, .5)],
        [-.9, -.75, mixColors(World.palette.water, World.palette.black, .25)],
        [-.75, -.5, World.palette.water],
        [-.5, -.25, mixColors(World.palette.sand, World.palette.black, .25)],
        [-.25, 0, World.palette.sand],
        [0, .5, mixColors(World.palette.grass, World.palette.black, .25)],
        [.5, .75, World.palette.grass],
        [.75, 1, mixColors(World.palette.forest, World.palette.black, .25)],
        [1, 1, World.palette.forest]
    ];

    /**
     * @type {Room[]}
     */
    static rooms = [];

    static init() {
        const noise = quickNoise.create((new Array(256)).fill(0).map((_, i) => i).sort(() => Math.random() - .5));
        const seed = Math.random();

        for (let i = 0; i < World.width * World.height; i++) {
            const room = new Room();
            room.width = 300;
            room.height = 300;
            room.x = i % World.width;
            room.y = Math.floor(i / World.width);

            const myNoise = noise(room.x / 10, room.y / 10, seed);

            for (const [min, max, c] of World.standardColors) {
                if (myNoise >= min && myNoise <= max) {
                    room.color = c;
                    break;
                }
            }

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
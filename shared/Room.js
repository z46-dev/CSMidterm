import { ctx } from "../lib/render.js";
import GameObject from "./GameObject.js";

export default class Room {
    width = 0;
    height = 0;
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
        this.objects.forEach(object => object.draw());
    }
}
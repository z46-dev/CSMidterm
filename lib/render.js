export const canvas = document.querySelector("canvas");
export const ctx = canvas.getContext("2d", {
    alpha: false,
    desynchronized: true,
    colorSpace: "display-p3"
});

export function resize() {
    canvas.width = innerWidth * window.devicePixelRatio;
    canvas.height = innerHeight * window.devicePixelRatio;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
}

window.addEventListener("resize", resize);
resize();

const colorCache = new Map();

function lerp(a, b, amount) {
    return a + (b - a) * amount;
}

export function mixColors(primary, secondary, amount) {
    const key = `${primary}${secondary}${amount}`;

    if (colorCache.has(key)) {
        return colorCache.get(key);
    }

    const pr = parseInt(primary.slice(1), 16);
    const sr = parseInt(secondary.slice(1), 16);

    const hex = `#${(
        1 << 24 | Math.floor(lerp((pr >> 16) & 255, (sr >> 16) & 255, amount)) << 16 |
        Math.floor(lerp((pr >> 8) & 255, (sr >> 8) & 255, amount)) << 8 |
        Math.floor(lerp(pr & 255, sr & 255, amount))
    ).toString(16).slice(1)}`;

    colorCache.set(key, hex);

    return hex;
}

export function drawText(text, x, y, size, fill = "#FFFFFF") {
    ctx.fillStyle = fill;
    ctx.strokeStyle = mixColors(fill, "#000000", .2);

    ctx.font = `${size}px sans-serif`;
    ctx.lineWidth = size / 5;

    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
}
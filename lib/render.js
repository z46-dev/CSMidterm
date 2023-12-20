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
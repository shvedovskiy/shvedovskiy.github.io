const now = document.getElementById('now');
now.innerText = new Date().getFullYear();

const CANVAS_WIDTH = 150;
const CANVAS_HEIGHT = 100;

const canvas = document.querySelector('.userpic__noise');
const ctx = canvas.getContext('2d');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

function makeNoise() {
    const imageData = ctx.createImageData(ctx.canvas.width, ctx.canvas.height);
    const buffer32 = new Uint32Array(imageData.data.buffer);
    const imageBufferLength = buffer32.length;
    let run = 0;
    let color = 0;
    const m = Math.random() * 6 + 4;
    const band = Math.random() * CANVAS_WIDTH * CANVAS_HEIGHT;
    let p = 0;

    for (let i = 0; i < imageBufferLength;) {
        if (run < 0) {
            run = m * Math.random();
            p = Math.random() ** 0.4;
            if (i > band && i < band + 10 * CANVAS_WIDTH) {
                p = Math.random();
            }
            color = (255 * p) << 24;
        }
        run--;
        buffer32[i++] = color;
    }
    ctx.putImageData(imageData, 0, 0);
}

let frameCounter = 0;
(function loopNoise() {
  frameCounter++;
  if (frameCounter % 3) {
    requestAnimationFrame(loopNoise);
  } else {
    makeNoise();
    requestAnimationFrame(loopNoise);
  }
})();

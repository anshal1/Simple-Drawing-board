const canvas = document.querySelector("#drawing-board");
const clear = document.querySelector("#clear");
const toolbox = document.querySelector(".toolbox");
const image = document.querySelector("#image");
const imagebutton = document.querySelector(".image-button");
const file_input = document.querySelector(".file");
const Save = document.querySelector(".save");
const shapeSelect = document.querySelector("#shape-select");
const ctx = canvas.getContext("2d");
const canvasOffsetX = 200;
const canvasOffsetY = 0;
const cWidth = window.innerWidth - canvasOffsetX;
const cHeight = window.innerHeight - canvasOffsetY;
canvas.width = cWidth;
canvas.height = cHeight;
let isPainting = false;
let lineWidth = 5;
let startX;
let startY;
function draw(e) {
  if (!isPainting) return;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  ctx.lineTo(e.clientX - canvasOffsetX, e.clientY);
  ctx.stroke();
}
function DrawImage(file, cb) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    image.src = e.target.result;
  };
  reader.readAsDataURL(file);
  image.onload = () => {
    return cb(image);
  };
}
imagebutton.addEventListener("click", () => {
  file_input.click();
});
toolbox.addEventListener("change", (e) => {
  if (e.target.name === "color") {
    ctx.strokeStyle = e.target.value;
  }
  if (e.target.name === "line-width") {
    lineWidth = e.target.value;
  }
  if (e.target.name === "image") {
    DrawImage(e.target.files[0], (element) => {
      ctx.drawImage(element, 0, 0, canvas.width, canvas.height);
    });
  }
});
clear.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
canvas.addEventListener("mousedown", (e) => {
  startX = e.clientX;
  startY = e.clientY;
  isPainting = true;
});
canvas.addEventListener("mouseup", (e) => {
  isPainting = false;
  ctx.stroke();
  ctx.beginPath();
});
canvas.addEventListener("mousemove", (e) => {
  draw(e);
  ctx.fillRect = "red";
});
Save.addEventListener("click", async () => {
  const data = await canvas.toDataURL("image/png", 1);
  console.log(data);
  const anchor = document.createElement("a");
  anchor.download = `${new Date()}.png`;
  anchor.href = data;
  anchor.click();
});

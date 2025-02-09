const canvas = document.querySelector("#drawing-board");
const clear = document.querySelector("#clear");
const toolbox = document.querySelector(".toolbox");
const imagebutton = document.querySelector(".image-button");
const file_input = document.querySelector(".file");
const Save = document.querySelector(".save");
const shapeSelect = document.querySelector("#shape-select");
const board = document.querySelector(".board");
const ctx = canvas.getContext("2d");

const toolboxDimesions = toolbox.getBoundingClientRect();
function setDimesions() {
  const boardDimesions = board.getBoundingClientRect();

  const cWidth = boardDimesions.width;
  const cHeight = boardDimesions.height;
  canvas.width = cWidth;
  canvas.height = cHeight;
}
setDimesions();
let isPainting = false;
let lineWidth = 5;
let startX;
let startY;
function draw(e) {
  if (!isPainting) return;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  ctx.lineTo(e.clientX - toolboxDimesions.width, e.clientY);
  ctx.stroke();
}
function DrawImage(file, cb) {
  if (!file) return;
  const reader = new FileReader();
  const img = new Image();
  reader.onload = (e) => {
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
  img.onload = () => {
    return cb(img);
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

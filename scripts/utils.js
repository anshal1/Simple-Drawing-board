const canvas = document.querySelector("#drawing-board");
const previewCanvas = document.querySelector("#previewCanvas");
const toolbox = document.querySelector(".toolbox");
const toolboxDimesions = toolbox.getBoundingClientRect();

const previewctx = previewCanvas.getContext("2d");
const ctx = canvas.getContext("2d");

let isErasing = false;
let isPainting = false;
let lineWidth = 5;
let startX;
let startY;
let isEraserSelected = false;
let fillToolSelected = false;
const EraserWidth = 50;
const EraserHeigth = 50;

function clearPreviewCanvas() {
  previewctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
}

function getID() {
  return `${currentShape}-${Date.now()}`;
}
function eraseCanvas(e) {
  clearPreviewCanvas();
  previewctx.fillStyle = "black";
  previewctx.fillRect(
    e.clientX - toolboxDimesions.width,
    e.clientY,
    EraserWidth,
    EraserHeigth
  );
  if (isErasing) {
    ctx.fillStyle = "black";
    ctx.clearRect(
      e.clientX - toolboxDimesions.width,
      e.clientY,
      EraserWidth,
      EraserHeigth
    );
  }
}

function checkCollision(e, shape) {
  const x = e.clientX - toolboxDimesions.width;
  const y = e.clientY;
  const shapeX = shape.x;
  const shapeY = shape.y;
  const shapeWidth = shape.width;
  const shapeHeight = shape.height;
  if (
    x >= shapeX &&
    x <= shapeX + shapeWidth &&
    y >= shapeY &&
    y <= shapeY + shapeHeight
  )
    return true;
  return false;
}

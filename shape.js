const shapes = document.querySelectorAll(".shapes-buttons");
const toolbox = document.querySelector(".toolbox");
const color = document.querySelector("#color");
const toolboxDimesions = toolbox.getBoundingClientRect();

let currentShape = null;

const shapesMap = new Map();

shapes.forEach((shape) => {
  shape.addEventListener("click", () => {
    const shapename = shape.getAttribute("data-shape");
    currentShape = shapename;
  });
});

function drawSquare(startX, startY, e, draw = false) {
  if (!isPainting) return;
  const width = e.clientX - startX;
  const height = e.clientY - startY;
  if (draw) {
    const id = `${currentShape}${Date.now()}`;
    shapesMap.set(id, {
      x: startX - toolboxDimesions.width,
      y: startY,
      width,
      height,
    });
    ctx.fillRect(startX - toolboxDimesions.width, startY, width, height);
  }
}

function addColorAfterDraw(e) {
  const x = e.clientX - toolboxDimesions.width;
  const y = e.clientY;
  for (const shape of shapesMap.values()) {
    const shapeX = shape.x;
    const shapeY = shape.y;
    const shapeWidth = shape.width;
    const shapeHeight = shape.height;
    if (
      x >= shapeX &&
      x <= shapeX + shapeWidth &&
      y >= shapeY &&
      y <= shapeY + shapeHeight
    ) {
      ctx.clearRect(shapeX, shapeY, shapeWidth, shapeHeight);
      ctx.fillStyle = color.value;
      ctx.fillRect(shapeX, shapeY, shapeWidth, shapeHeight);
    }
  }
}

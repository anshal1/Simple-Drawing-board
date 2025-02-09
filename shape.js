const shapes = document.querySelectorAll(".shapes-buttons");
const color = document.querySelector("#color");
const lineHeight = document.querySelector("input[name='line-width']");

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
  const x = startX - toolboxDimesions.width;
  if (draw) {
    clearPreviewCanvas();
    const id = getID();
    // saving the shape so that we can change its color in future if user wants
    shapesMap.set(id, {
      x,
      y: startY,
      width,
      height,
    });
    ctx.fillRect(x, startY, width, height);
  } else {
    clearPreviewCanvas();
    const offset = 5;
    // showing preview
    previewctx.fillStyle = "black";
    previewctx.fillRect(x, startY, width, height);
    previewctx.fillStyle = "white";
    previewctx.fillRect(
      x + offset,
      startY + offset,
      width - offset * 2,
      height - offset * 2
    );
  }
}

function drawLine(startX, startY, e, draw = false) {
  if (!isPainting) return;
  const x = startX - toolboxDimesions.width;
  const y = startY;
  const width = e.clientX - toolboxDimesions.width;
  ctx.lineWidth = lineHeight.value;
  ctx.lineCap = "round";
  if (!draw) {
    // Preview mode
    previewctx.save(); // Save the current canvas state
    previewctx.beginPath();
    clearPreviewCanvas();
    previewctx.moveTo(x, y);
    previewctx.lineTo(width, e.clientY);
    previewctx.stroke();
    previewctx.restore(); // Restore the original state to remove preview
  } else {
    // Final drawing
    clearPreviewCanvas();
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(width, e.clientY);
    ctx.stroke();
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

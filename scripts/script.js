const clear = document.querySelector("#clear");
const imagebutton = document.querySelector(".image-button");
const file_input = document.querySelector(".file");
const Save = document.querySelector(".save");
const shapeSelect = document.querySelector("#shape-select");
const board = document.querySelector(".board");

function setDimesions() {
  const boardDimesions = board.getBoundingClientRect();

  const cWidth = boardDimesions.width;
  const cHeight = boardDimesions.height;
  canvas.width = cWidth;
  previewCanvas.width = cWidth;
  canvas.height = cHeight;
  previewCanvas.height = cHeight;
}
setDimesions();

// function to draw the pencil
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
  switch (e.target.name) {
    case "color":
      ctx.strokeStyle = e.target.value;
      ctx.fillStyle = e.target.value;
      currentShape = null;
      break;
    case "line-width":
      lineWidth = e.target.value;
      break;
    case "image":
      isEraserSelected = false;
      DrawImage(e.target.files[0], (element) => {
        ctx.drawImage(element, 0, 0, canvas.width, canvas.height);
      });
      break;
  }
});

toolbox.addEventListener("click", (e) => {
  const name = e.target.name;
  switch (name) {
    case "pencil-tool":
      currentShape = null;
      isEraserSelected = false;
      fillToolSelected = false;
      break;
    case "eraser":
      isEraserSelected = !isEraserSelected;
      fillToolSelected = false;
      break;
    case "fill":
      fillToolSelected = !fillToolSelected;
      break;
  }
});

clear.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

canvas.addEventListener("mousedown", (e) => {
  startX = e.clientX;
  startY = e.clientY;
  // to prevent the pencil to start from the center of the circle if selecting pencil tool after drawing a circle
  if (!currentShape) ctx.beginPath();
  if (isEraserSelected) {
    isErasing = true;
  } else {
    isPainting = true;
  }
});

function shapesSwithCase(e, draw = false) {
  switch (currentShape) {
    case "square":
      drawSquare(startX, startY, e, draw);
      break;
    case "line":
      drawLine(startX, startY, e, draw);
      break;
    case "circle":
      drawCircle(startX, startY, e, draw);
      break;
    default:
      break;
  }
}

canvas.addEventListener("mouseup", (e) => {
  if (isEraserSelected) {
    isErasing = false;
    return;
  }
  if (fillToolSelected) {
    addColorAfterDraw(e);
  }
  if (e.clientX === startX || e.clientY === startY) {
    isPainting = false;
    return;
  }
  if (currentShape) {
    shapesSwithCase(e, true);
    // doing this to prevent the snapping of the line tool to the end of circle when selecting pencil or line too after drawing the circle
    if (currentShape === "line" || currentShape === "circle") {
      ctx.stroke();
      ctx.beginPath();
    }
  } else {
    ctx.stroke();
    ctx.beginPath();
  }
  isPainting = false;
});

canvas.addEventListener("mousemove", (e) => {
  // using isEraserSelected instead of isErasing to show th eraser moving with the cursor
  if (isEraserSelected) return eraseCanvas(e);
  if (currentShape) {
    shapesSwithCase(e, false);
  } else {
    draw(e);
  }
});

Save.addEventListener("click", async () => {
  const data = await canvas.toDataURL("image/png", 1);
  const anchor = document.createElement("a");
  anchor.download = `${new Date()}.png`;
  anchor.href = data;
  anchor.click();
});

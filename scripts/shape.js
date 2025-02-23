const shapes = document.querySelectorAll(".shapes-buttons");
const color = document.querySelector("#color");
const lineHeight = document.querySelector("input[name='line-width']");

let currentShape = null;

const shapesMap = new Map();

shapes.forEach((shape) => {
  shape.addEventListener("click", () => {
    const shapename = shape.getAttribute("data-shape");
    currentShape = shapename;
    isEraserSelected = false;
    fillToolSelected = false;
    isSelected = false;
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
      color: color.value,
      selected: false,
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

function drawCircle(startX, startY, e, draw = false) {
  if (!isPainting) return;
  const x = startX - toolboxDimesions.width;
  const y = startY;
  const radius = Math.abs(e.clientX - startX);
  if (!draw) {
    // Preview mode
    previewCircle(x, y, radius);
  } else {
    const id = getID();
    shapesMap.set(id, {
      x: x - radius,
      y: y - radius,
      width: radius * 2,
      height: radius * 2,
      color: color.value,
      selected: false,
    });
    clearPreviewCanvas();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}

function addColorAfterDraw(e) {
  for (const key of shapesMap.entries()) {
    const shape = key[1];
    const shapeX = shape.x;
    const shapeY = shape.y;
    const shapeWidth = shape.width;
    const shapeHeight = shape.height;
    if (checkCollision(e, shape)) {
      const shapeName = key[0].split("-")[0];
      ctx.fillStyle = color.value;
      switch (shapeName) {
        case "square":
          shapesMap.set(key[0], { ...shape, color: color.value });
          ctx.clearRect(shapeX, shapeY, shapeWidth, shapeHeight);
          ctx.fillRect(shapeX, shapeY, shapeWidth, shapeHeight);
          break;
        case "circle":
          shapesMap.set(key[0], { ...shape, color: color.value });
          const radius = shape.width / 2;
          ctx.beginPath();
          ctx.arc(shape.x + radius, shape.y + radius, radius, 0, 2 * Math.PI);
          ctx.fill();
          break;
      }
    }
  }
}

function handleSelectUpdate() {
  for (const key of shapesMap.entries()) {
    const shape = key[1];
    if (!shape.selected) {
      isSelected = false;
    } else {
      isSelected = true;
    }
  }
}

canvas.addEventListener("dblclick", (e) => {
  for (const key of shapesMap.entries()) {
    const shape = key[1];
    const shapeX = shape.x;
    const shapeY = shape.y;
    const shapeWidth = shape.width;
    const shapeHeight = shape.height;
    if (checkCollision(e, shape)) {
      const shapeName = key[0].split("-")[0];
      isPainting = false;
      isEraserSelected = false;
      currentShape = null;
      switch (shapeName) {
        case "square":
          shapesMap.set(key[0], { ...shape, selected: !shape.selected });
          const selected = !shape.selected;
          ctx.clearRect(shapeX, shapeY, shapeWidth, shapeHeight);
          ctx.fillStyle = "red";
          if (selected) {
            ctx.fillRect(
              shapeX - offset,
              shapeY - offset,
              shapeWidth + offset * 2,
              shapeHeight + offset * 2
            );
          } else {
            ctx.clearRect(
              shapeX - offset,
              shapeY - offset,
              shapeWidth + offset * 2,
              shapeHeight + offset * 2
            );
          }
          ctx.fillStyle = shape.color;
          ctx.fillRect(shapeX, shapeY, shapeWidth, shapeHeight);
          break;
        case "circle":
          shapesMap.set(key[0], { ...shape, selected: !shape.selected });
          const circleSeleted = !shape.selected;
          const radius = shape.width / 2;
          ctx.beginPath();

          if (circleSeleted) {
            ctx.fillStyle = "red";
            ctx.arc(
              shape.x + radius,
              shape.y + radius,
              radius + offset,
              0,
              2 * Math.PI
            );
            ctx.fill();
          } else {
            ctx.arc(
              shape.x + radius,
              shape.y + radius,
              radius + offset,
              0,
              2 * Math.PI
            );
            ctx.fill();
          }
          ctx.beginPath();
          ctx.fillStyle = shape.color;
          ctx.arc(shape.x + radius, shape.y + radius, radius, 0, 2 * Math.PI);
          ctx.fill();
          break;
      }
    }
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (!isSelected) return;
  for (const key of shapesMap.entries()) {
    const shape = key[1];
    if (!shape.selected) continue;
    const shapeName = key[0].split("-")[0];
    previewctx.fillStyle = "green";
    clearPreviewCanvas();
    clearOffSelectBorder(shape.x, shape.y, shape.width, shape.height, ctx);
    switch (shapeName) {
      case "square":
        clearRect(shape.x, shape.y, shape.width, shape.height);
        previewctx.fillRect(
          e.clientX - toolboxDimesions.width - shape.width / 2,
          e.clientY,
          shape.width,
          shape.height
        );
        break;
      case "circle":
        clearRect(shape.x, shape.y, shape.width, shape.height);
        previewCircle(
          e.clientX - toolboxDimesions.width - shape.width / 2,
          e.clientY,
          shape.width / 2
        );
        break;
    }
  }
});

canvas.addEventListener("mouseup", (e) => {
  if (!isSelected) return;
  isSelected = false;
  for (const key of shapesMap.entries()) {
    const shape = key[1];
    if (!shape.selected) continue;
    const shapeName = key[0].split("-")[0];
    previewctx.fillStyle = shape.color;
    const x = e.clientX - toolboxDimesions.width - shape.width / 2;
    switch (shapeName) {
      case "square":
        ctx.fillRect(x, e.clientY, shape.width, shape.height);
        shapesMap.set(key[0], {
          ...shape,
          x,
          y: e.clientY,
          selected: false,
        });
        break;
      case "circle":
        ctx.arc(x, e.clientY, shape.width / 2, 0, 2 * Math.PI);
        ctx.fill();
        shapesMap.set(key[0], {
          ...shape,
          x,
          y: e.clientY,
          selected: false,
        });
        break;
    }
    clearPreviewCanvas();
  }
});

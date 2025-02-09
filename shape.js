const shapes = document.querySelectorAll(".shapes-buttons");
const toolbox = document.querySelector(".toolbox");
const toolboxDimesions = toolbox.getBoundingClientRect();

let currentShape = null;

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
    ctx.fillRect(startX - toolboxDimesions.width, startY, width, height);
  }
}

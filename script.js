const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const Fw = 1080;
const Fh = 1350;

canvas.width = Fw;
canvas.height = Fh;

let img = new Image();
let poster = new Image();

poster.src = "assets/poster.png";

let scale = 1;
let minScale = 1;
let maxScale = 3;

let x = 0;
let y = 0;

let isDragging = false;
let startX, startY;

document.getElementById("imageInput").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  img.src = URL.createObjectURL(file);
});

img.onload = () => {
  setMode("fill");
};

function setMode(mode) {
  const Iw = img.width;
  const Ih = img.height;

  let sWidth = Fw / Iw;
  let sHeight = Fh / Ih;

  if (mode === "fill") scale = Math.max(sWidth, sHeight);
  if (mode === "auto") scale = Math.min(sWidth, sHeight);
  if (mode === "width") scale = sWidth;
  if (mode === "height") scale = sHeight;

  minScale = scale;
  maxScale = scale * 3;

  centerImage();
  draw();
}

function centerImage() {
  const Sw = img.width * scale;
  const Sh = img.height * scale;

  x = (Fw - Sw) / 2;
  y = (Fh - Sh) / 2;
}

function clamp() {
  const Sw = img.width * scale;
  const Sh = img.height * scale;

  if (Sw > Fw) {
    x = Math.min(0, Math.max(Fw - Sw, x));
  } else {
    x = (Fw - Sw) / 2;
  }

  if (Sh > Fh) {
    y = Math.min(0, Math.max(Fh - Sh, y));
  } else {
    y = (Fh - Sh) / 2;
  }
}

function draw() {
  ctx.clearRect(0, 0, Fw, Fh);

  // white background
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, Fw, Fh);

  // user image
  ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

  // poster overlay
  ctx.drawImage(poster, 0, 0, Fw, Fh);

  // text
  ctx.fillStyle = "black";
  ctx.textAlign = "center";

  ctx.font = "bold 50px Arial";
  ctx.fillText(document.getElementById("name").value, Fw/2, 1200);

  ctx.font = "40px Arial";
  ctx.fillText(document.getElementById("class").value, Fw/2, 1260);
}

function resetImage() {
  setMode("auto");
}

function downloadImage() {
  const link = document.createElement("a");
  link.download = "poster.png";
  link.href = canvas.toDataURL();
  link.click();
}

canvas.addEventListener("mousedown", e => {
  isDragging = true;
  startX = e.offsetX - x;
  startY = e.offsetY - y;
});

canvas.addEventListener("mousemove", e => {
  if (!isDragging) return;
  x = e.offsetX - startX;
  y = e.offsetY - startY;
  clamp();
  draw();
});

canvas.addEventListener("mouseup", () => isDragging = false);
canvas.addEventListener("mouseleave", () => isDragging = false);

// zoom with wheel (desktop)
canvas.addEventListener("wheel", e => {
  e.preventDefault();

  let zoom = e.deltaY < 0 ? 1.1 : 0.9;
  scale *= zoom;

  scale = Math.max(minScale, Math.min(maxScale, scale));

  clamp();
  draw();
});
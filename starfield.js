const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");
let stars = [];

function initStars() {
  stars = [];
  for (let i = 0; i < 300; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      z: Math.random() * 3 + 1
    });
  }
}

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initStars(); // Regenerate stars on resize
}

resize();
window.addEventListener("resize", resize);
window.addEventListener("orientationchange", resize);

function loop() {
  ctx.fillStyle = "#050810";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  stars.forEach(s => {
    s.y += s.z * 0.6;
    if (s.y > canvas.height) {
      s.y = 0;
      s.x = Math.random() * canvas.width; // Randomize x when wrapping
    }
    ctx.fillStyle = "rgba(0,227,255," + (0.2 * s.z) + ")";
    ctx.fillRect(s.x, s.y, s.z, s.z);
  });
  requestAnimationFrame(loop);
}

loop();

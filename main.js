Sure! You're asking to **remove all arrow functions (`=>`)** from your code and convert them to traditional function expressions. Here's the updated version with `function` syntax used instead of arrow functions:

---

### ✅ Updated Code (No Arrow Functions):

```javascript
for (let id in controls) {
  const key = controls[id];
  const btn = document.getElementById(id);
  if (!btn) continue;

  btn.addEventListener("touchstart", function(e) {
    e.preventDefault();
    keys[key] = true;
    if (!started) started = true;
  }, { passive: false });

  btn.addEventListener("touchend", function(e) {
    e.preventDefault();
    keys[key] = false;
  });

  btn.addEventListener("mousedown", function() {
    keys[key] = true;
    if (!started) started = true;
  });

  btn.addEventListener("mouseup", function() {
    keys[key] = false;
  });

  btn.addEventListener("mouseleave", function() {
    keys[key] = false;
  });
}

setupMobileControls();

function enableGameStart() {
  document.addEventListener('keydown', function() {
    if (!started) {
      started = true;
    }
  });
}

enableGameStart();

function resizeCanvas() {
  const canvas = document.getElementById("gameCanvas");
  const ratio = 4 / 3;
  const maxWidth = 800;
  const margin = 20;

  const width = Math.min(window.innerWidth - margin, maxWidth);
  const height = width / ratio;

  canvas.style.width = width + "px";
  canvas.style.height = height + "px";

  canvas.width = width;
  canvas.height = height;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas(); // Run once at start

function shrinkPlane() {
  plane.scale *= 0.9;
}

function rotatePlane() {
  plane.angle += Math.PI / 12; // 15°
}

function resizePlane() {
  plane.scale = 1; // reset
}
```

---

Let me know if you want all of this inside a `DOMContentLoaded` block, or if you need to remove `let` as well for older browser compatibility.

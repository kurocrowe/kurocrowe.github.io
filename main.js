document.addEventListener('DOMContentLoaded', function() {
  // Hamburger menu toggle
  var hamburger = document.getElementById('hamburger');
  hamburger.addEventListener('click', function() {
    document.body.classList.toggle('nav-open');
  });
  document.querySelector('.nav-logo').addEventListener('click', function() {
    document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
  });
  // Sections in order, excluding hero
  var sections = [
    document.getElementById('howSection'),
    document.getElementById('typesSection'),
    document.getElementById('puzzleSection'),
    document.getElementById('planeGameSection')
  ];

  // Initially hide all sections except hero
  sections.forEach(function(section) {
    section.style.display = 'none';
  });

  // Show section with blur + fade + smooth scroll
  function showSectionWithEffect(section) {
    if (!section) return;
    section.style.display = 'block';
    section.style.filter = 'blur(5px)';
    section.style.opacity = '0';
    section.style.transition = 'opacity 0.7s ease, filter 0.7s ease';

    setTimeout(function() {
      section.scrollIntoView({behavior: 'smooth'});
      section.style.filter = 'blur(0)';
      section.style.opacity = '1';
    }, 50);
  }

  // Hide all sections
  function hideAllSections() {
    sections.forEach(function(s) {
      s.style.display = 'none';
    });
  }

  // Scroll down button logic (show next section)
  var scrollButtons = document.querySelectorAll('.scroll-down');
  scrollButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var parentSection = btn.closest('section');
      var nextSection = null;

      if (!parentSection) {
        // Hero scroll down button clicked (no parent section)
        nextSection = sections[0];
      } else {
        var idx = sections.indexOf(parentSection);
        if (idx !== -1 && idx < sections.length - 1) {
          nextSection = sections[idx + 1];
        }
      }

      if (nextSection) {
        hideAllSections();
        showSectionWithEffect(nextSection);
      }
    });
  });

  // Navigation links in hamburger menu
  var navLinks = document.querySelectorAll('.nav-links a, #homeLink');
  navLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      var href = this.getAttribute('href');
      if (!href || href === '#') {
        // Show hero only (hide all sections)
        hideAllSections();
        window.scrollTo({top: 0, behavior: 'smooth'});
      } else {
        var targetId = href.substring(1);
        var targetSection = document.getElementById(targetId);
        if (targetSection) {
          hideAllSections();
          showSectionWithEffect(targetSection);
        }
      }
      // Close hamburger after click
      document.body.classList.remove('nav-open');
    });
  });

  // Toggle plane images in Types of Planes section
  window.toggleImage = function(id) {
    var img = document.getElementById(id);
    if (!img) return;
    img.style.display = (img.style.display === 'block') ? 'none' : 'block';
  };

  // Quiz form submission
  var quizForm = document.getElementById('quizForm');
  if (quizForm) {
    quizForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var q1 = document.querySelector('input[name="q1"]:checked');
      var q2 = document.querySelector('input[name="q2"]:checked');
      var score = 0;
      if (q1 && q1.value === 'g700') score++;
      if (q2 && q2.value === 'eurofighter') score++;
      var result = document.getElementById('quizResult');
      if (result) {
        result.textContent = 'You got ' + score + ' / 2 correct!';
      }
    });
  }

// PUZZLE GAME SETUP

const board = document.getElementById('board');
  const turnsDisplay = document.getElementById('turns');
  let turns = 0;

  // The initial scrambled order of images (strings with filenames)
  // Make sure '3.jpg' is the empty tile
  let imgOrder = ["4.jpg", "2.jpg", "8.jpg", "5.jpg", "1.jpg", "6.jpg", "7.jpg", "9.jpg", "3.jpg"];

  // Store tile elements here
  let tiles = [];

  // Create tiles and append to board
  function createPuzzle() {
    board.innerHTML = '';
    tiles = [];
    turns = 0;
    turnsDisplay.textContent = turns;

    imgOrder.forEach((imgName, index) => {
      const img = document.createElement('img');
      img.src = imgName;
      img.id = `tile-${index}`;
      img.draggable = false;
      board.appendChild(img);
      tiles.push(img);

      // Click event to try to swap with empty tile
      img.addEventListener('click', () => {
        moveTile(index);
      });
    });
  }

  // Helper: find index of empty tile
  function emptyIndex() {
    return tiles.findIndex(t => t.src.includes('3.jpg'));
  }

  // Check if two tiles are adjacent on the grid
  function isAdjacent(i1, i2) {
    const row1 = Math.floor(i1 / 3);
    const col1 = i1 % 3;
    const row2 = Math.floor(i2 / 3);
    const col2 = i2 % 3;

    return (
      (row1 === row2 && Math.abs(col1 - col2) === 1) ||
      (col1 === col2 && Math.abs(row1 - row2) === 1)
    );
  }

  // Swap tiles in imgOrder and update board
  function swapTiles(i1, i2) {
    const temp = imgOrder[i1];
    imgOrder[i1] = imgOrder[i2];
    imgOrder[i2] = temp;
  }

  // Try to move clicked tile if adjacent to empty
  function moveTile(clickedIndex) {
    const emptyIdx = emptyIndex();
    if (isAdjacent(clickedIndex, emptyIdx)) {
      swapTiles(clickedIndex, emptyIdx);
      updateBoard();
      turns++;
      turnsDisplay.textContent = turns;
    }
  }

  // Update the images on board to reflect imgOrder array
  function updateBoard() {
    tiles.forEach((tile, idx) => {
      tile.src = imgOrder[idx];
    });
  }

  createPuzzle();

//   // PLANE GAME SETUP
//  const plane = document.getElementById('plane');
//   const scoreBox = document.getElementById('scoreBox');
//   const resetBtn = document.getElementById('resetGame');
//   let score = 0;
//   let rotationInterval = null;
//   let angle = 0;
//   let originalScale = 1;

//   // Move plane randomly
//   function movePlaneRandomly() {
//     const gameArea = document.getElementById('gameArea');
//     const maxX = gameArea.offsetWidth - plane.offsetWidth;
//     const maxY = gameArea.offsetHeight - plane.offsetHeight;
//     const randomX = Math.floor(Math.random() * maxX);
//     const randomY = Math.floor(Math.random() * maxY);
//     plane.style.left = randomX + 'px';
//     plane.style.top = randomY + 'px';
//   }

//   setInterval(movePlaneRandomly, 1000);

//   // Click to score
//   plane.addEventListener('click', function () {
//     score++;
//     scoreBox.textContent = score;
//     new Audio('popsound.mp3').play();
//   });

//   // Reset button
//   resetBtn.addEventListener('click', function () {
//     score = 0;
//     scoreBox.textContent = score;
//   });

//   // Key controls
//   document.addEventListener('keydown', function (e) {
//     if (e.key === 't' || e.key === 'T') {
//       // Shrink
//       originalScale = originalScale * 0.8;
//       plane.style.transform = `scale(${originalScale}) rotate(${angle}deg)`;
//     } else if (e.key === 'u' || e.key === 'U') {
//       // Restore size
//       originalScale = 1;
//       plane.style.transform = `scale(1) rotate(${angle}deg)`;
//     } else if (e.key === 'a' || e.key === 'A') {
//       // Start rotating
//       if (!rotationInterval) {
//         rotationInterval = setInterval(function () {
//           angle += 5;
//           plane.style.transform = `scale(${originalScale}) rotate(${angle}deg)`;
//         }, 50);
//       }
//     } else if (e.key === 'b' || e.key === 'B') {
//       // Stop rotating
//       clearInterval(rotationInterval);
//       rotationInterval = null;
//     }
//   });

  const toggle = document.getElementById("qr-toggle");
  const dropdown = document.getElementById("qr-dropdown");

  toggle.addEventListener("click", () => {
    dropdown.classList.toggle("hidden");

    // Hide automatically after 6 seconds
    if (!dropdown.classList.contains("hidden")) {
      setTimeout(() => {
        dropdown.classList.add("hidden");
      }, 6000);
    }
  });

const btnFS = document.querySelector("#btnFS");
const btnWS = document.querySelector("#btnWS");
const widthOutput = document.querySelector("#width");
const heightOutput = document.querySelector("#height");

btnFS.addEventListener("click", enterFullscreen);
btnWS.addEventListener("click", exitFullscreen);

function enterFullscreen() {
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { // Firefox
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { // Chrome, Safari, Opera
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { // IE/Edge
    elem.msRequestFullscreen();
  }
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { // Firefox
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { // IE/Edge
    document.msExitFullscreen();
  }
}

function reportWindowSize() {
  widthOutput.textContent = window.innerWidth;
  heightOutput.textContent = window.innerHeight;
}

// Initial report
reportWindowSize();

// Update on window resize
window.addEventListener("resize", reportWindowSize);

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const planeImg = new Image();
planeImg.src = "plane.png";

const popSound = new Audio("popsound.mp3");

let gravityOn = true;
let windStrength = 0.05;

let score = 0;
let lastMilestone = 0;

let plane = {
  x: 100,
  y: 250,
  vx: 0,
  vy: 0,
  width: 80,
  height: 40,
  thrust: 0,
  lift: 0,
  drag: 0,
  weight: 0.5
};

let keys = {};

// Clouds
let clouds = [];
for (let i = 0; i < 5; i++) {
  clouds.push({
    x: Math.random() * canvas.width,
    y: Math.random() * 200,
    speed: 0.3 + Math.random() * 0.2,
    size: 60 + Math.random() * 40
  });
}

window.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  keys[key] = true;

  if (key === "g") {
    gravityOn = !gravityOn;
  }
});

window.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});

function updatePhysics() {
  plane.thrust = keys["d"] ? 0.2 : 0;
 plane.lift = keys["w"] ? 0.6 : 0;  // increase lift
plane.weight = 0.3;   
  const brake = keys["a"] ? 0.1 : 0;
  const dive = keys["s"] ? 0.2 : 0;

  plane.drag = 0.05 * plane.vx + brake;

  // Wind
  plane.vx += windStrength;

  // Forces
  plane.vx += plane.thrust - plane.drag;
  if (gravityOn) {
    plane.vy += plane.weight - plane.lift + dive;
  } else {
    plane.vy += -plane.lift + dive;
  }

  plane.x += plane.vx;
  plane.y += plane.vy;

  // Ground / top
  if (plane.y + plane.height > canvas.height) {
    plane.y = canvas.height - plane.height;
    plane.vy = 0;
  }
  if (plane.y < 0) {
    plane.y = 0;
    plane.vy = 0;
  }

  // Wrap horizontal
  if (plane.x > canvas.width) plane.x = -plane.width;
  if (plane.x < -plane.width) plane.x = canvas.width;

  // Score: 1 point per frame of forward movement
  score += plane.vx * 0.1;
  if (score - lastMilestone >= 100) {
    popSound.play();
    lastMilestone += 100;
  }
}

function updateClouds() {
  for (let cloud of clouds) {
    cloud.x -= cloud.speed;
    if (cloud.x + cloud.size < 0) {
      cloud.x = canvas.width + Math.random() * 200;
      cloud.y = Math.random() * 200;
    }
  }
}

function drawClouds() {
  ctx.fillStyle = "white";
  for (let cloud of clouds) {
    ctx.beginPath();
    ctx.ellipse(cloud.x, cloud.y, cloud.size, cloud.size * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawHUD() {
  ctx.fillStyle = "black";
  ctx.font = "16px sans-serif";
  ctx.fillText(`Score: ${Math.floor(score)}`, 10, 60);
  ctx.fillText(`Wind → ${windStrength.toFixed(2)}`, 10, 80);
  ctx.fillText(`Gravity: ${gravityOn ? "On" : "Off"} (G to toggle)`, 10, 100);
}

function drawForces() {
  ctx.font = "14px sans-serif";

  // Thrust
  ctx.strokeStyle = "red";
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.moveTo(plane.x, plane.y + plane.height / 2);
  ctx.lineTo(plane.x - 40, plane.y + plane.height / 2);
  ctx.stroke();
  ctx.fillText("Thrust", plane.x - 60, plane.y + plane.height / 2 - 5);

  // Drag
  ctx.strokeStyle = "blue";
  ctx.fillStyle = "blue";
  ctx.beginPath();
  ctx.moveTo(plane.x + plane.width, plane.y + plane.height / 2);
  ctx.lineTo(plane.x + plane.width + 40, plane.y + plane.height / 2);
  ctx.stroke();
  ctx.fillText("Drag", plane.x + plane.width + 10, plane.y + plane.height / 2 - 5);

  // Lift
  ctx.strokeStyle = "green";
  ctx.fillStyle = "green";
  ctx.beginPath();
  ctx.moveTo(plane.x + plane.width / 2, plane.y + plane.height / 2);
  ctx.lineTo(plane.x + plane.width / 2, plane.y - 40);
  ctx.stroke();
  ctx.fillText("Lift", plane.x + plane.width / 2 + 5, plane.y - 25);

  // Weight
  if (gravityOn) {
    ctx.strokeStyle = "orange";
    ctx.fillStyle = "orange";
    ctx.beginPath();
    ctx.moveTo(plane.x + plane.width / 2, plane.y + plane.height / 2);
    ctx.lineTo(plane.x + plane.width / 2, plane.y + plane.height / 2 + 40);
    ctx.stroke();
    ctx.fillText("Weight", plane.x + plane.width / 2 + 5, plane.y + plane.height / 2 + 50);
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawClouds();
  ctx.drawImage(planeImg, plane.x, plane.y, plane.width, plane.height);
  drawForces();
  drawHUD();
}

function loop() {
  updatePhysics();
  updateClouds();
  draw();
  requestAnimationFrame(loop);
}

planeImg.onload = () => {
  loop();
};
const resetBtn = document.getElementById("resetBtn");

function resetGame() {
  plane.x = 100;
  plane.y = 250;
  plane.vx = 0;
  plane.vy = 0;
  score = 0;
  lastMilestone = 0;
}

resetBtn.addEventListener("click", resetGame);

});



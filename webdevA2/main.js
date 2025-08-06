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

  // PLANE GAME SETUP
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const planeImg = new Image();
planeImg.src = "plane.png";

const popSound = document.getElementById("popSound");

let gravityStrength = 0.1; // lighter gravity
let gravityEnabled = true;
let wind = 0.05;

const plane = {
 x: 150,
  y: 200, // NOT near bottom; this keeps it suspended
  vx: 0,
  vy: 0,
  angle: 0,
  scale: 1,
  width: 60,
  height: 40
};

let keys = {};

let score = 0;
let coins = [];
let clouds = [];
let gameOver = false;
let started = false;

// Visual transform states
let planeAngle = 0;
let planeScale = 1;

function drawArrow(x, y, dx, dy, color, label) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + dx, y + dy);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();

  const angle = Math.atan2(dy, dx);
  ctx.beginPath();
  ctx.moveTo(x + dx, y + dy);
  ctx.lineTo(x + dx - 10 * Math.cos(angle - 0.3), y + dy - 10 * Math.sin(angle - 0.3));
  ctx.lineTo(x + dx - 10 * Math.cos(angle + 0.3), y + dy - 10 * Math.sin(angle + 0.3));
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();

  ctx.fillStyle = color;
  ctx.font = "12px Arial";
  ctx.fillText(label, x + dx + 5, y + dy + 5);
}

function spawnCloud() {
  clouds.push({
    x: canvas.width,
    y: Math.random() * 300,
    speed: 0.3 + Math.random() * 0.5
  });
}

function spawnCoin() {
  coins.push({
    x: canvas.width,
    y: 100 + Math.random() * 300,
    radius: 10,
    collected: false
  });
}

function resetGame() {
  plane.x = 100;
  plane.y = 250;
  plane.vx = 0;
  plane.vy = 0;
  score = 0;
  coins = [];
  clouds = [];
  gameOver = false;
  started = false;
  planeAngle = 0;
  planeScale = 1;
}

document.getElementById("resetBtn").addEventListener("click", resetGame);

document.addEventListener("keydown", function(e) {
  keys[e.key.toLowerCase()] = true;
  if (!started) started = true;

  if (e.key.toLowerCase() === "g") gravityEnabled = !gravityEnabled;

  if (e.key === "1") {
    planeScale = 0.8;
  } else if (e.key === "2") {
    planeAngle = 0.3;
  } else if (e.key === "3") {
    planeScale = 0.8;
    planeAngle = -0.3;
  } else if (e.key === "4") {
    planeScale = 1;
    planeAngle = 0;
  }
});

document.addEventListener("keyup", function(e) {
  keys[e.key.toLowerCase()] = false;
});

function updatePhysics() {
  if (!started || gameOver) return;

  if (keys["d"]) plane.vx += 0.2;
  if (keys["a"]) plane.vx -= 0.1;
  if (keys["w"]) plane.vy -= 0.2;
  if (keys["s"]) plane.vy += 0.2;

  if (gravityEnabled) plane.vy += gravityStrength;

  plane.vx += wind;
  plane.vx *= 0.99;
  plane.vy *= 0.99;

  plane.x += plane.vx;
  plane.y += plane.vy;

  if (plane.y > canvas.height) {
    plane.y = canvas.height;
    gameOver = true;
  }
  if (plane.y < 0) plane.y = 0;
}

function drawPlane() {
  ctx.save();
  ctx.translate(plane.x + plane.width / 2, plane.y + plane.height / 2);
  ctx.rotate(planeAngle);
  ctx.scale(planeScale, planeScale);
  ctx.drawImage(planeImg, -plane.width / 2, -plane.height / 2, plane.width, plane.height);
  ctx.restore();

  const centerX = plane.x + plane.width / 2;
  const centerY = plane.y + plane.height / 2;

  drawArrow(centerX, centerY, 0, -40, "blue", "Lift");
  drawArrow(centerX, centerY, 0, 40, "red", "Weight");
  drawArrow(centerX, centerY, 40, 0, "green", "Thrust");
  drawArrow(centerX, centerY, -30, 0, "orange", "Drag");
}

function drawCoins() {
  for (var i = 0; i < coins.length; i++) {
    var coin = coins[i];
    if (!coin.collected) {
      ctx.beginPath();
      ctx.fillStyle = "gold";
      ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawClouds() {
  ctx.fillStyle = "white";
  for (var i = 0; i < clouds.length; i++) {
    var cloud = clouds[i];
    ctx.beginPath();
    ctx.ellipse(cloud.x, cloud.y, 50, 20, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function updateCoins() {
  const coinSpeed = 3; // fixed speed left
  for (var i = 0; i < coins.length; i++) {
    var coin = coins[i];
    coin.x -= coinSpeed;
    if (!coin.collected) {
      var dx = coin.x - (plane.x + plane.width / 2);
      var dy = coin.y - (plane.y + plane.height / 2);
      if (Math.sqrt(dx * dx + dy * dy) < coin.radius + 20) {
        coin.collected = true;
        score += 10;
        popSound.play().catch(function(err) {});
      }
    }
  }
}

function updateClouds() {
  const cloudSpeed = 1;
  for (var i = 0; i < clouds.length; i++) {
    clouds[i].x -= cloudSpeed;
  }
}

function drawUI() {
  ctx.fillStyle = "#222";
  ctx.font = "18px Arial";
  ctx.fillText("Score: " + score, 10, 20);
  if (!started) {
    ctx.fillText("Press any key to start", canvas.width / 2 - 100, canvas.height / 2);
  }
  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over!", canvas.width / 2 - 80, canvas.height / 2);
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updatePhysics();
  
  updateClouds();

  drawClouds();
  if (started){
  drawCoins();
  updateCoins();}
  drawPlane();
  drawUI();

  requestAnimationFrame(gameLoop);
}

setInterval(spawnCloud, 3000);
setInterval(spawnCoin, 2000);

resetGame();
gameLoop();
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
 
 function setupMobileControls() {
  const controls = {
    btnUp: "w",
    btnDown: "s",
    btnLeft: "a",
    btnRight: "d"
  };

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

// Button control for resizing and rotating plane
const btnShrink = document.getElementById("btnShrink");
const btnRotate = document.getElementById("btnRotate");
const btnResize = document.getElementById("btnResize");

if (btnShrink) {
  btnShrink.addEventListener("click", function () {
    planeScale *= 0.9;
  });
}

if (btnRotate) {
  btnRotate.addEventListener("click", function () {
    planeAngle += Math.PI / 12; // rotate 15°
  });
}

if (btnResize) {
  btnResize.addEventListener("click", function () {
    planeScale = 1;
    planeAngle = 0;
  });
}


});



document.addEventListener('DOMContentLoaded', function() {
  // Hamburger menu toggle
  var hamburger = document.getElementById('hamburger');
  hamburger.addEventListener('click', function() {
    document.body.classList.toggle('nav-open');
  });
  document.querySelector('.nav-logo').addEventListener('click', function() {
    document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
  });

  var sections = [
    document.getElementById('howSection'),
    document.getElementById('typesSection'),
    document.getElementById('puzzleSection'),
    document.getElementById('planeGameSection')
  ];

  sections.forEach(function(section) {
    section.style.display = 'none';
  });

  function showSectionWithEffect(section) {
    if (!section) return;
    section.style.display = 'block';
    section.style.filter = 'blur(5px)';
    section.style.opacity = '0';
    section.style.transition = 'opacity 0.7s ease, filter 0.7s ease';

    setTimeout(function() {
      section.scrollIntoView({ behavior: 'smooth' });
      section.style.filter = 'blur(0)';
      section.style.opacity = '1';
    }, 50);
  }

  function hideAllSections() {
    sections.forEach(function(s) {
      s.style.display = 'none';
    });
  }

  var scrollButtons = document.querySelectorAll('.scroll-down');
  scrollButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var parentSection = btn.closest('section');
      var nextSection = null;

      if (!parentSection) {
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

  var navLinks = document.querySelectorAll('.nav-links a, #homeLink');
  navLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      var href = this.getAttribute('href');
      if (!href || href === '#') {
        hideAllSections();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        var targetId = href.substring(1);
        var targetSection = document.getElementById(targetId);
        if (targetSection) {
          hideAllSections();
          showSectionWithEffect(targetSection);
        }
      }
      document.body.classList.remove('nav-open');
    });
  });

  window.toggleImage = function(id) {
    var img = document.getElementById(id);
    if (!img) return;
    img.style.display = (img.style.display === 'block') ? 'none' : 'block';
  };

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

  const toggle = document.getElementById("qr-toggle");
  const dropdown = document.getElementById("qr-dropdown");

  toggle.addEventListener("click", function() {
    dropdown.classList.toggle("hidden");
    if (!dropdown.classList.contains("hidden")) {
      setTimeout(function() {
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
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  }

  function exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }

  function reportWindowSize() {
    widthOutput.textContent = window.innerWidth;
    heightOutput.textContent = window.innerHeight;
  }

  reportWindowSize();
  window.addEventListener("resize", reportWindowSize);

  function setupMobileControls() {
    const controls = {
      btnUp: "w",
      btnDown: "s",
      btnLeft: "a",
      btnRight: "d"
    };

    for (var id in controls) {
      var key = controls[id];
      var btn = document.getElementById(id);
      if (!btn) continue;

      btn.addEventListener("touchstart", function(e) {
        e.preventDefault();
        keys[this.dataset.key] = true;
        if (!started) started = true;
      }.bind({ dataset: { key: key } }), { passive: false });

      btn.addEventListener("touchend", function(e) {
        e.preventDefault();
        keys[this.dataset.key] = false;
      }.bind({ dataset: { key: key } }));

      btn.addEventListener("mousedown", function() {
        keys[this.dataset.key] = true;
        if (!started) started = true;
      }.bind({ dataset: { key: key } }));

      btn.addEventListener("mouseup", function() {
        keys[this.dataset.key] = false;
      }.bind({ dataset: { key: key } }));

      btn.addEventListener("mouseleave", function() {
        keys[this.dataset.key] = false;
      }.bind({ dataset: { key: key } }));
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
    var canvas = document.getElementById("gameCanvas");
    var ratio = 4 / 3;
    var maxWidth = 800;
    var margin = 20;

    var width = Math.min(window.innerWidth - margin, maxWidth);
    var height = width / ratio;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    canvas.width = width;
    canvas.height = height;
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  function shrinkPlane() {
    plane.scale *= 0.9;
  }

  function rotatePlane() {
    plane.angle += Math.PI / 12;
  }

  function resizePlane() {
    plane.scale = 1;
  }

});

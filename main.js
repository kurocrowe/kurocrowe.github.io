// Apple-style subtle interactions

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Simple fade-in on scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.card, .cta, .hero-content').forEach(el => {
  observer.observe(el);
});


const scriptURL = "http://localhost:3000/reserve";

document.getElementById("reservationForm")
  .addEventListener("submit", function(e) {
    e.preventDefault();

    const formData = new FormData(this);

    fetch(scriptURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        message: formData.get("message")
      })
    })
    .then(res => res.json())
    .then(() => {
      alert("Reservation sent successfully!");
      this.reset();
    })
    .catch(err => {
      alert("Error submitting form.");
      console.error(err);
    });
});



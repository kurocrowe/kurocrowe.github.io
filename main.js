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


const scriptURL = "https://script.google.com/macros/s/AKfycbxVSKaKVca7J3CuiCpQk1322IRTUbzLVX8538zvHvWj_PvrlgPLUnXxAkEGq3M1k9cn/exec";

document.getElementById("reservationForm")
  .addEventListener("submit", function(e) {
    e.preventDefault();

    const formData = new FormData(this);

   fetch(scriptURL, {
  method: "POST",
  body: new URLSearchParams({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message")
  })
})
.then(res => res.text())
.then(() => {
  alert("Reservation sent successfully!");
  this.reset();
})
.catch(err => {
  alert("Error submitting form.");
  console.error(err);
});
});




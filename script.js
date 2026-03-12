const hamburger = document.getElementById("hamburger");
const nav = document.getElementById("nav");
const overlay = document.getElementById("overlay");

hamburger.addEventListener("click", () => {

hamburger.classList.toggle("active");
nav.classList.toggle("open");
overlay.classList.toggle("active");

});

overlay.addEventListener("click", () => {

hamburger.classList.remove("active");
nav.classList.remove("open");
overlay.classList.remove("active");

});

/* RESERVATION FORM */

const form = document.getElementById("reservationForm");

form.addEventListener("submit", async function(e){

e.preventDefault();

const formData = new FormData(form);

const data = {
name: formData.get("name"),
email: formData.get("email"),
message: formData.get("message")
};

try{

const response = await fetch("https://kurocrowe-github-io.onrender.com/reserve",{

method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(data)

});

const result = await response.json();

if(result.success){

alert("Reservation sent successfully!");
form.reset();

}else{

alert("Server error");

}

}catch(err){

alert("Server connection failed");

}

});

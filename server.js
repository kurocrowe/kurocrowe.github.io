const hamburger = document.getElementById("hamburger");
const nav = document.getElementById("nav");
const blur = document.getElementById("blur");

hamburger.addEventListener("click", () => {

hamburger.classList.toggle("active");
nav.classList.toggle("open");
blur.classList.toggle("active");

});

/* CLOSE MENU IF CLICK OUTSIDE */

blur.addEventListener("click", () => {

hamburger.classList.remove("active");
nav.classList.remove("open");
blur.classList.remove("active");

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

alert("Connection failed");

}

});

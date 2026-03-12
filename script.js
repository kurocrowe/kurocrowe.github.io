

const hamburger = document.getElementById("hamburger");
const nav = document.getElementById("nav");

hamburger.onclick = () => {

nav.classList.toggle("open");

};

/* =========================
   RESERVATION FORM SUBMIT
========================= */

const scriptURL = "https://kurocrowe-github-io.onrender.com/reserve";
const form = document.getElementById("reservationForm");

if(form){

form.addEventListener("submit", async function(e){

e.preventDefault();

const formData = new FormData(form);

const data = {
name: formData.get("name"),
email: formData.get("email"),
message: formData.get("message")
};

try{

const response = await fetch(scriptURL,{
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

alert("Server error: " + result.error);

}

}catch(err){

console.error("Fetch error:",err);
alert("Could not connect to reservation server.");

}

});

}
document.addEventListener("click", function(e){

const menu = document.getElementById("nav");
const hamburger = document.querySelector(".hamburger");

/* if menu is open and click is outside */

if(menu.classList.contains("open") &&
!menu.contains(e.target) &&
!hamburger.contains(e.target)){

menu.classList.remove("open");

}

});

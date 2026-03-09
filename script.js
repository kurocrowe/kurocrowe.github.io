const pages = document.querySelectorAll('.page');
const indicator = document.getElementById('indicator');

let current = 0;
let isAnimating = false;

/* INITIALIZE */

updatePages();

/* UPDATE PAGE POSITIONS */

function updatePages(){

if(isAnimating) return;

isAnimating = true;

pages.forEach((page,index)=>{

page.classList.remove('active','prev');

if(index === current){
page.classList.add('active');
}

else if(index < current){
page.classList.add('prev');
}

});

if(indicator){
indicator.innerText = `Page ${current+1} of ${pages.length}`;
}

setTimeout(()=>{
isAnimating = false;
},500);

}

/* NEXT PAGE */

function nextPage(){

current++;

if(current >= pages.length){
current = 0;
}

updatePages();

}

/* PREVIOUS PAGE */

function prevPage(){

current--;

if(current < 0){
current = pages.length - 1;
}

updatePages();

}

/* GO TO PAGE (for hamburger menu) */

function goToPage(index){

if(index < 0 || index >= pages.length) return;

current = index;

updatePages();

}

/* KEYBOARD NAVIGATION */

document.addEventListener('keydown',(e)=>{

if(e.key === "ArrowRight") nextPage();
if(e.key === "ArrowLeft") prevPage();

});

/* MOBILE SWIPE SUPPORT */

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

document.addEventListener("touchstart",(e)=>{

touchStartX = e.changedTouches[0].screenX;
touchStartY = e.changedTouches[0].screenY;

});

document.addEventListener("touchend",(e)=>{

touchEndX = e.changedTouches[0].screenX;
touchEndY = e.changedTouches[0].screenY;

handleSwipe();

});

function handleSwipe(){

const swipeX = touchEndX - touchStartX;
const swipeY = touchEndY - touchStartY;

const swipeThreshold = 60;

/* ignore vertical swipe */

if(Math.abs(swipeY) > Math.abs(swipeX)) return;

/* swipe left */

if(swipeX < -swipeThreshold){
nextPage();
}

/* swipe right */

if(swipeX > swipeThreshold){
prevPage();
}

}

/* HAMBURGER MENU */

function toggleMenu(){

const menu = document.getElementById("menu");

if(menu){
menu.classList.toggle("open");
}

}

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

const pages = document.querySelectorAll('.page');
const indicator = document.getElementById('indicator');

let current = 0;
let isAnimating = false;

/* INITIALIZE FIRST PAGE */

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

if(current < pages.length - 1){
current++;
updatePages();
}

}

/* PREVIOUS PAGE */

function prevPage(){

if(current > 0){
current--;
updatePages();
}

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

/* prevent vertical scroll triggering swipe */

if(Math.abs(swipeY) > Math.abs(swipeX)) return;

/* swipe left → next page */

if(swipeX < -swipeThreshold){
nextPage();
}

/* swipe right → previous page */

if(swipeX > swipeThreshold){
prevPage();
}

}


/* RESERVATION FORM SUBMIT */

const scriptURL = "https://kurocrowe-github-io.onrender.com/reserve";
const form = document.getElementById("reservationForm");

if(form){

form.addEventListener("submit", function(e){

e.preventDefault();

const formData = new FormData(this);

fetch(scriptURL,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
name:formData.get("name"),
email:formData.get("email"),
message:formData.get("message")
})
})
.then(res => res.json())
.then(() => {

alert("Reservation sent successfully!");
form.reset();

})
.catch(err => {

alert("Error submitting form.");
console.error(err);

});

});

}
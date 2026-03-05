const pages = document.querySelectorAll('.page');
const indicator = document.getElementById('indicator');

let current = 0;
let isAnimating = false;

/* Update page positions */

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

indicator.innerText = `Page ${current+1} of ${pages.length}`;

setTimeout(()=>{
isAnimating = false;
},450);

}

/* Next page */

function nextPage(){

if(current < pages.length - 1){
current++;
updatePages();
}

}

/* Previous page */

function prevPage(){

if(current > 0){
current--;
updatePages();
}

}

/* Keyboard navigation */

document.addEventListener('keydown',(e)=>{

if(e.key === "ArrowRight") nextPage();

if(e.key === "ArrowLeft") prevPage();

});


/* MOBILE SWIPE SUPPORT */

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;

document.addEventListener("touchstart",(e)=>{

touchStartX = e.changedTouches[0].screenX;
touchStartY = e.changedTouches[0].screenY;

});

document.addEventListener("touchend",(e)=>{

touchEndX = e.changedTouches[0].screenX;

handleSwipe();

});

function handleSwipe(){

const swipeDistance = touchEndX - touchStartX;

const swipeThreshold = 60;

/* swipe left */

if(swipeDistance < -swipeThreshold){
nextPage();
}

/* swipe right */

if(swipeDistance > swipeThreshold){
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
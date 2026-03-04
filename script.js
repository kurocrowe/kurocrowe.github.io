const pages = document.querySelectorAll('.page');
const indicator = document.getElementById('indicator');

let current = 0;

function updatePages(){

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

}

function nextPage(){

if(current < pages.length - 1){
current++;
updatePages();
}

}

function prevPage(){

if(current > 0){
current--;
updatePages();
}

}

document.addEventListener('keydown',(e)=>{

if(e.key === "ArrowRight") nextPage();
if(e.key === "ArrowLeft") prevPage();

});


const scriptURL = " https://kurocrowe-github-io.onrender.com/reserve";

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

const btn = document.querySelector('.btn');
btn.addEventListener('click', function(event){
    document.getElementById("click-counter").innerHTML = "Hello JavaScript!";
    console.log('Button Clicked');
});



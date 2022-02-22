const btn = document.querySelector('.btn');
btn.addEventListener('click', function(event){
    document.getElementById("click-counter").innerHTML = "Hello JavaScript!";
    console.log('Button Clicked');
});

const listButton = document.getElementById('createList');
var list = document.getElementById('demo');
listButton.addEventListener('click', function(event){
    
    for (let i = 0; i < 20; i++) {
        var entry = document.createElement('li');
        entry.appendChild(document.createTextNode("hello"));
        list.appendChild(entry);
      }
    console.log('Button Clicked');
});



const { ipcRenderer} = require("electron");

const electron = require('electron');
const path = require('path');
var pressed = 0;



let logButton = document.getElementById("logButton");
logButton.addEventListener("click", () => {
    let txtBox = document.getElementById("logText");
    let txtval = txtBox.value + "\n";
    ipcRenderer.send("saveText", txtval);
})

const listButton = document.getElementById('createList');
var list = document.getElementById('demo');
listButton.addEventListener('click', function(event){
    console.log

    if(pressed == 0)
    {
        let listOfContainers = ipcRenderer.sendSync("getListOfContainers")
        console.log(listOfContainers)
        for (let i = 0; i < listOfContainers.length; i++) {
            var entry = document.createElement('li');
            entry.name = "checkList"
            var checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.value = listOfContainers[i];
            checkbox.name = "myCheckBoxes";
            checkbox.textContent = listOfContainers[i];
            checkbox.innerHTML = listOfContainers;
            entry.appendChild(document.createTextNode(listOfContainers[i].substring(18)));
            entry.appendChild(checkbox);
            //console.log(listOfContainers[i]);
            list.appendChild(entry);
        }
        pressed = 1;
        //ipcRenderer.send("testc++");
        console.log('Button Clicked');
    }
    else
    {
        console.log('Button Clicked');
    }
    
});



const submitListButton = document.getElementById('submitList');
//var list = document.getElementById('demo');
submitListButton.addEventListener('click', function(event){
    var checkboxes = document.getElementsByName("myCheckBoxes");
    var checkboxesChecked = [];
    // loop over them all
    for (var i=0; i<checkboxes.length; i++) {
       // And stick the checked ones onto an array...
       if (checkboxes[i].checked) {
          checkboxesChecked.push(checkboxes[i].value);
       }
    }
    // Return the array if it is non-empty, or null
    console.log(checkboxesChecked);
    var el = document.getElementById('demo');
    el.remove();

    pressed = 0;
    ipcRenderer.sendSync("sendListOfContainers", checkboxesChecked);
    window.location.replace("./load.html");
    

    //return checkboxesChecked.length > 0 ? checkboxesChecked : null;

});

    
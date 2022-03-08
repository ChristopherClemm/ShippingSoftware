const { ipcRenderer} = require("electron");

const electron = require('electron');
const path = require('path');
let containersToAdd = [];
let submitContainerButton = document.getElementById("submitContainerButton");
submitContainerButton.addEventListener("click", () => {
    //NEED TO ADD MORE ERROR CHECKING
        let txtBox = document.getElementById("weightText");
        let txtBox1 = document.getElementById("DescriptionText");
        console.log(txtBox.value.length);
        let weightText = txtBox.value;
        if(weightText.length < 5)
        {
            let tempText = "";
            for( let i = weightText.length; i < 5; i++)
            {
                tempText += "0"
            }
            weightText = tempText + weightText
        }
        console.log(weightText);
        
        let txtval = "{" + weightText + "}, "+ txtBox1.value + "\n";
        containersToAdd.push(txtval);
        console.log(txtval);
        ipcRenderer.send("updateContainersToLoad", txtval);
    })


const submitOnloadList = document.getElementById('submitOnloadList');
//var list = document.getElementById('demo');
submitOnloadList.addEventListener('click', function(event){
    console.log(containersToAdd);
    location.href='./steps_unload_load.html';

    //ipcRenderer.sendSync("sendListOfContainers", containersToAdd);
    //window.location.replace("./load.html");
    

    //return checkboxesChecked.length > 0 ? checkboxesChecked : null;

});

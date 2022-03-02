const { ipcRenderer} = require("electron");

const electron = require('electron');
const path = require('path');
let containersToAdd = [];
let submitContainerButton = document.getElementById("submitContainerButton");
submitContainerButton.addEventListener("click", () => {
        let txtBox = document.getElementById("weightText");
        let txtBox1 = document.getElementById("DescriptionText");
        //console.log(txt.length);
        /*
        if(txtBox.value.length < 5)
        {
            let tempText = txtBox.value;

            while(txtBox.value.length <5)
            {
                txtBox = "0" + txtBox;
            }
        }
        */
        let txtval = "{" + txtBox.value + "}, "+ txtBox1.value + "\n";
        containersToAdd.push(txtval);
        console.log(txtval);
        ipcRenderer.sendSync("updateContainersToLoad", txtval);
        //ipcRenderer.send("updateContainersToLoad", txtval);
    })


const submitOnloadList = document.getElementById('submitOnloadList');
//var list = document.getElementById('demo');
submitOnloadList.addEventListener('click', function(event){
    console.log(containersToAdd);
    //ipcRenderer.sendSync("sendListOfContainers", containersToAdd);
    //window.location.replace("./load.html");
    

    //return checkboxesChecked.length > 0 ? checkboxesChecked : null;

});

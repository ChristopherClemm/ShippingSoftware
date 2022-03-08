const { ipcRenderer} = require("electron");

const electron = require('electron');
const path = require('path');


window.addEventListener('DOMContentLoaded', () => {
   
    let logButton = document.getElementById("logButton");
    logButton.addEventListener("click", () => {
        let txtBox = document.getElementById("logText");
        let txtval = txtBox.value + "\n";
        ipcRenderer.send("saveText", txtval);
    })
    
   

    let uploadManifest = document.getElementById("uploadManifest");
    uploadManifest.addEventListener('click', () => {
            ipcRenderer.send("uploadManifest");
        })

        

    const loginButton = document.getElementById('login');
    loginButton.addEventListener("click", function(event){
        let txtBox = document.getElementById("loginText");
    
        let txtval = txtBox.value + " logged into the system"+ "\n";
        ipcRenderer.send("saveText", txtval);
        //console.log("trying to redraw");
        //redraw([-1,-1,-1,-1, " "]);
        txtBox.value = "";
    });
    ipcRenderer.on('shipUpload', function () {
        let currShipName = ipcRenderer.sendSync("getShipName");
        document.getElementById('currShipName').innerHTML = currShipName + " is uploaded into the system";
        //document.getElementById('currShipName').innerHTML = "Press Next To Begin";
    
    });
    


  });

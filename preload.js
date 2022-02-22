const { ipcRenderer} = require("electron");

const electron = require('electron');
const path = require('path');


window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }
    let logButton = document.getElementById("logButton");
    logButton.addEventListener("click", () => {
        let txtBox = document.getElementById("logText");
        let txtval = txtBox.value + "\n";
        ipcRenderer.send("saveText", txtval);
    })
    
    let manifestFilePathButton = document.getElementById("shipFilePathButton");
    manifestFilePathButton.addEventListener("click", () => {

        document.getElementById("shipFilePath").innerHTML = "Hello JavaScript!"
        let txtBox = document.getElementById("logText");
        let txtval = txtBox.value + "\n";
        ipcRenderer.send("saveText", txtval);
    })

    let uploadManifest = document.getElementById("uploadManifest");
    uploadManifest.addEventListener('click', () => {
            ipcRenderer.send("uploadManifest");
        });

    let testcpp = document.getElementById("testcpphh");
    testcpp.addEventListener('click', () => {
            console.log("clicleddddd");
            ipcRenderer.send("testc++");
        });


  })

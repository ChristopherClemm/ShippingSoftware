const { ipcRenderer} = require("electron");

const electron = require('electron');
const path = require('path');
let test = 0;
let divID = "";

function redraw(instruction)
{
    
    let gridUpdates = ipcRenderer.sendSync("sendGrid");
    console.log(gridUpdates);
    var lastClicked;
    var grid = clickableGrid(10,12,function(el,row,col,i){
    console.log("You clicked on element:",el);
    console.log("You clicked on row:",row);
    console.log("You clicked on col:",col);
    console.log("You clicked on item #:",i);

    el.className='clicked';
    if (lastClicked) lastClicked.className='';
    lastClicked = el;
    });

    if (divID != "" )
    {
        let tempDelete = document.getElementById('gridID');
        tempDelete.remove();
        document.getElementById('instructText').innerHTML = instruction[4];
        document.getElementById('Est Time').innerHTML = "ESTIMATED TIME: " + instruction[5];
    }
    const newGrid = document.body.appendChild(grid);

    newGrid.id = "gridID"
    divID = "gridID";
     
    function clickableGrid( rows, cols, callback ){
        var i=0;
        var grid = document.createElement('table');
        let actualPos = 0;
        let top = 10;
        let topit = 0;
        grid.className = 'grid';
        for (var r=0;r<rows;++r){
            var tr = grid.appendChild(document.createElement('tr'));
            for (var c=0;c<cols;++c){
                var cell = tr.appendChild(document.createElement('td'));
                cell.innerHTML = "     ";
                if(i < 24)
                {
                    cell.className = 'PINK';
                }
                
                    let diff = i;
                    let text = gridUpdates[((top*12) - (12 - (diff%12)))];
                    
                    if(text == "NAN")
                    {
                        cell.className = 'NAN';
                    }
                    else if(gridUpdates[((top*12) - (12 - (diff%12)))].substring(5,11) != "UNUSED")
                    {
                        //console.log(gridUpdates[((top*12) - (12 - (diff%12)))].substring(5,10));
                        cell.className = 'CONTAINER';
                    }

                    cell.innerHTML = text.substring(0,5);
                
                if(instruction[2] == 0 && instruction[3] == 0)
                {

                }
                if( i == ((120 - (instruction[0] * 12))  + (instruction[1] -1)))
                {
                    cell.className = 'FROM';
                }
                if( i == ((120 - (instruction[2] * 12)  + (instruction[3]-1))) && (!(instruction[2] == 0 && instruction[3] == 0)) && (!(instruction[2] == 70 && instruction[3] == 70)))
                {
                    cell.className = 'TO';
                }
                
                
                //cell.innerHTML = i;//text.substring(0,5);
                i++;
                
                cell.addEventListener('click',(function(el,r,c,i){
                    return function(){
                        callback(el,r,c,i);
                    }
                })(cell,r,c,i),false);
            }
            top--;
        }
        return grid;
}

}

let empty = true;
const LoadNextButton = document.getElementById('CPPLoadShipNext');
//var list = document.getElementById('demo');
LoadNextButton.addEventListener('click', function(event){
    console.log('Balance Next Button Clicked');
    
    let instruction = ipcRenderer.sendSync("getNextMove");
    redraw(instruction);
    if (instruction[4] != '')
    {
        ipcRenderer.send("saveText",instruction[4]);
    }
    else{
        document.getElementById('instructText').innerHTML = "Done balancing, ready to download updated manifest";
        document.getElementById("Est Time").innerHTML = "";
    }
    console.log("INSTRUCT = " , instruction[4].substring(0,4));
    if(!empty || instruction[4].substring(0,4) == "PICK")
    {
        empty = true;
        ipcRenderer.sendSync("updateManifest", instruction);
        if(instruction[4].substring(0,4) == "PICK")
        {
            empty = false;
        }
        
    }
    else{
        empty = false;
    }
    //ipcRenderer.sendSync("updateManifest", instruction);
    console.log(instruction);
    test = test +1;
});

const logButtonL = document.getElementById('LoadlogButton');
logButtonL.addEventListener("click", function(event){
    let txtBox = document.getElementById("LoadlogText");

    let txtval = txtBox.value + "\n";
    ipcRenderer.send("saveText", txtval);
    console.log("trying to redraw");
    //redraw([-1,-1,-1,-1, " "]);
    txtBox.value = "";
});

document.addEventListener('DOMContentLoaded', function() {
    redraw([-1,-1,-1,-1, " "]);
    let currShipName = ipcRenderer.sendSync("getShipName");
    document.getElementById('currShipName').innerHTML = "Working on " + currShipName;
    //document.getElementById('currShipName').innerHTML = "Working on " + currShipName;
    let res = ipcRenderer.send("load_c++");
    //alert("Ready!");
}, false);

ipcRenderer.on('completedLoad', function () {
    document.getElementById('WaitForBalance').innerHTML = "Press Next To Begin";

});

const DownloadGridButton = document.getElementById('Download');
DownloadGridButton.addEventListener('click', function(event){
    ipcRenderer.send("download");
});

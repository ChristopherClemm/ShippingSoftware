const { app, BrowserWindow, ipcMain, Notification } = require('electron')
const path = require('path')
const url = require('url')
var fs = require('fs');
const { event } = require('jquery');
const electron = require('electron');
const hello2 = require('./build/Release/hello');
const { type } = require('os');

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}

function readInput() {
  //new Notification({ title: 'Hello', body: 'testing' }).show();
  console.log(typeof global.filepath)
   data = fs.readFileSync(global.filepath,
      {encoding:'utf8', flag:'r'});
  console.log(data);
   data2 = fs.readFileSync("extendShip.txt",
    {encoding:'utf8', flag:'r'});
console.log(data2);
    data = data + "\n" + data2;
  fs.writeFile("currShip.txt",data, (err) =>{
    if(!err) {console.log("File Written");                    
            }
    else {
        console.log(data);
        console.log("err");
    }
})
}

function updateLogFile(txtVal)
{
  var d = new Date();
  let min = d.getMinutes();
  let sec = d.getSeconds();
  //d.toISOString().split('T')[0];
  console.log(d.getMonth());
  if(d.getMinutes() < 10)
  {
     min = "0"+min; 
  }
  if(d.getSeconds < 10)
  {
    console.log("less than");
    sec = "0"+sec;
  }
  let timeString = d.getMonth() + "/"+d.getDay() + "/" + d.getFullYear() + " " + d.getHours() +":" +min+":" +sec;
  console.log(d);
  finalString = timeString + " : " + txtVal;
  fs.appendFile("logfile.txt",finalString, (err) =>{
      if(!err) {console.log("File Written");                    
              }
      else {
          console.log(txtVal);
          console.log("err");
      }
  })
}
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on("saveText", (event,txtVal) => {
  

  updateLogFile(txtVal);
  /*var d = new Date();
  console.log(d.getMonth())
  let timeString = d.getMonth() + "/"+d.getDay() + "/" + d.getFullYear() + " " + d.getHours() +":" +d.getMinutes()+":" +d.getSeconds();
  console.log(d);
  finalString = timeString + " : " + txtVal;
    fs.appendFile("logfile1.txt",finalString, (err) =>{
        if(!err) {console.log("File Written");                    
                }
        else {
            console.log(txtVal);
            console.log("err");
        }
    })
    */
})

ipcMain.on("updateManifest", (event,instruction) => {
    console.log("WE ARE UPDATING THE MANIFEST");
    const updateShip = fs.readFileSync("currShip.txt",
    {encoding:'utf8', flag:'r'});
    //console.log(data);
    let lines = updateShip.split("\n");
    console.log(instruction);
    if(instruction[2] == 70 && instruction[3] == 70)
      {
        const container = fs.readFileSync("onloadTest.txt",
        {encoding:'utf8', flag:'r'});
        let myContainer = container.split("\n");
        let addCont = "[09,01], " + myContainer[0];
        lines[(((instruction[0]-1)*12) + (instruction[1]-1))] = addCont;
        console.log("add cont = " , addCont);
        //lines.push(addCont);
        let finalText = lines.join("\n");
        fs.writeFileSync("currShip.txt",finalText, (err) =>{
          if(!err) {console.log("File Written");                    
                  }
          else {
              //console.log(data);
              console.log("err");
          }
        })

      }
      else if(instruction[2] == 0 && instruction[3] == 0)
      {
        let emptyCont = lines[(((instruction[0]-1)*12) + (instruction[1]-1))].substring(0,9) + "{00000}, UNUSED"

        lines[(((instruction[0]-1)*12) + (instruction[1]-1))] = emptyCont;
        lines[((8*12))] = "[09,01], {00000}, UNUSED";
        console.log("empty cont = " , emptyCont);
        let finalText = lines.join("\n");
        fs.writeFileSync("currShip.txt",finalText, (err) =>{
          if(!err) {console.log("File Written");                    
                  }
          else {
              //console.log(data);
              console.log("err");
          }
        })

      }
      else
      {

      
        let firstContLocationString = lines.at((((instruction[0]-1)*12) + (instruction[1]-1))).substring(0,9);
        let firstContContentsString = lines.at((((instruction[0]-1)*12) + (instruction[1]-1))).substring(9);

        let secondContLocationString =  lines.at((((instruction[2]-1)*12) + (instruction[3]-1))).substring(0,9);
        let secondContContentsString = lines.at((((instruction[2]-1)*12) + (instruction[3]-1))).substring(9)
          console.log("firstLoc String = ", firstContLocationString);
          console.log("first cont string = " , firstContContentsString);
          lines[(((instruction[0]-1)*12) + (instruction[1]-1))] = firstContLocationString + secondContContentsString; 
          lines[(((instruction[2]-1)*12) + (instruction[3]-1))] = secondContLocationString + firstContContentsString;
          let finalText = lines.join("\n");
          fs.writeFileSync("currShip.txt",finalText, (err) =>{
            if(!err) {console.log("File Written");                    
                    }
            else {
                //console.log(data);
                console.log("err");
            }
          })
      }
    /*if(instruction[0] > 8 || instruction[2] > 8 || instruction[1] > 12 || instruction[3] > 12)
    {
      console.log("skipped");
    }
    else{
      
      
        let temp = lines.at((((instruction[0]-1)*12) + (instruction[1]-1)));
        console.log(temp)
        lines[(((instruction[0]-1)*12) + (instruction[1]-1))] = lines.at((((instruction[2]-1)*12) + (instruction[3]-1)));
        lines[(((instruction[2]-1)*12) + (instruction[3]-1))] = temp;
        let finalText = lines.join("\n");
        fs.writeFileSync("currShip.txt",finalText, (err) =>{
          if(!err) {console.log("File Written");                    
                  }
          else {
              //console.log(data);
              console.log("err");
          }
        })
      
      
    }*/
    
    event.returnValue = 0;

  
})

ipcMain.on("updateContainersToLoad", (event,arr) => {
  //stringFinal = arr.join("\n");
  stringFinal = arr;
  console.log(arr);

  fs.appendFileSync("onloadTest.txt",stringFinal, (err) =>{
    if(!err) {console.log("File Written\n\n\n");                    
            }
    else {
        console.log(arr);
        console.log("err");
    }
  })
  
   console.log("Tried to run getListofConatiners");


})



let estmatedTime = -1;
ipcMain.on("getNextMove", (event) => {
    const data = fs.readFileSync("instructions.txt",
    {encoding:'utf8', flag:'r'});

    const data2 = fs.readFileSync("instructionsText.txt",
    {encoding:'utf8', flag:'r'});
    //console.log(data);
    let lines = data.split("\n");
    let lastData = data2.split("\n");

    //let xCoorStringCurr = lines[0].substring(1,3);
    //console.log(xCoorString);
    let xCoorCurr = parseInt(lines[0].substring(1,3));
    //console.log(xCoorCurr);
    //let yCoorStringCurr = lines[0].substring(4,6);
    //console.log(yCoorStringCurr);
    let yCoorCurr = parseInt(lines[0].substring(4,6));
    //console.log(yCoorCurr);

    //let xCoorStringNew = lines[0].substring(9,11);
    let xCorrNew = parseInt(lines[0].substring(9,11));
    let yCoorNew = parseInt(lines[0].substring(12,14));
    let instructionString = lastData[0];
    
    lines.shift();
    let text = lines.join("\n");

    lastData.shift();
    let text2 = lastData.join("\n");

    fs.writeFileSync("instructions.txt",text, (err) =>{
      if(!err) {console.log("File Written");                    
              }
      else {
          //console.log(data);
          console.log("err");
      }
    })
    fs.writeFileSync("instructionsText.txt",text2, (err) =>{
      if(!err) {console.log("File Written");                    
              }
      else {
          //console.log(data);
          console.log("err");
      }
    })
    const estData = fs.readFileSync("esttime.txt",
    {encoding:'utf8', flag:'r'});
    let linesEst = estData.split("\n");
    if(estmatedTime == -1)
    {
      time = linesEst[0];
      estmatedTime = parseInt(linesEst[0]);
    }
    else{
      time = estmatedTime - parseInt(linesEst[0]);
      estmatedTime -= parseInt(linesEst[0]);
    }
    linesEst.shift();
    let text4 = linesEst.join("\n");

    fs.writeFileSync("esttime.txt",text4, (err) =>{
      if(!err) {console.log("File Written");                    
              }
      else {
          //console.log(data);
          console.log("err");
      }
    })
    if(text4 == "")
    {
      estmatedTime = -1;
    }



    //console.log(yCoorNew);
    let arr = [xCoorCurr,yCoorCurr, xCorrNew, yCoorNew, instructionString,time];
    event.returnValue = arr;
    




})


ipcMain.on("sendListOfContainers", (event,arr) => {

  stringFinal = arr.join("\n");

  fs.writeFileSync("unloadTest.txt",stringFinal, (err) =>{
    if(!err) {console.log("File Written\n\n\n");                    
            }
    else {
        console.log(arr);
        console.log("err");
    }
  })
  
   //console.log("Tried to run getListofConatiners");
   event.returnValue = 0;



});

ipcMain.on("getListOfContainers", (event) => {
  const data = fs.readFileSync("currShip.txt",
    {encoding:'utf8', flag:'r'});
    //console.log(data[0]);
   let lines = data.split("\n");
   //console.log(lines[0].substring(18,23));
   let finalLine = [];
   for(i = 0; i < lines.length; i++)
   {
    
     if(lines[i].substring(18,21) == "NAN")
     {
      //console.log(lines[i].substring(18,24));
      //finalLine.push("NAN");
     }
     else if (lines[i].substring(18,24) == "UNUSED") {
      //console.log(lines[i].substring(18,24));
      //finalLine.push(lines[i].substring(10,15) + "UNUSED");

     }
     else{
        finalLine.push(lines[i]);
     }
     
   }
   //console.log(finalLine[0]);
   event.returnValue =  finalLine;
   //console.log("Tried to run getListofConatiners");



})

ipcMain.on("sendGrid", (event) => {
  const data = fs.readFileSync("currShip.txt",
    {encoding:'utf8', flag:'r'});
    //console.log(data[0]);
   let lines = data.split("\n");
   //console.log(lines[0].substring(18,23));
   let finalLine = [];
   for(i = 0; i < lines.length; i++)
   {
    
     if(lines[i].substring(18,21) == "NAN")
     {
      //console.log(lines[i].substring(18,24));
      finalLine.push("NAN");
     }
     else if (lines[i].substring(18,24) == "UNUSED") {
      //console.log(lines[i].substring(18,24));
      finalLine.push(lines[i].substring(10,15) + "UNUSED");

     }
     else{
        finalLine.push(lines[i].substring(10,15) + "     ");
     }
     
   }
   console.log(finalLine);
   event.returnValue =  finalLine;
   console.log("THIS WAS ABLE TO BE RUN AFTER");



})

ipcMain.on("load_c++", (event) => {
  console.log("BUTTON PRESSED");
  let mode = "2";
  fs.writeFileSync("mode.txt",mode, (err) =>{
    if(!err) {console.log("File Written\n\n\n");                    
            }
    else {
        console.log("err");
    }
  })

  const data = fs.readFileSync("mode.txt",
    {encoding:'utf8', flag:'r'});
  console.log(data);

  console.time('c++');
  hello2.hello();
  console.timeEnd('c++');
  console.log("after Balancing c++");
  let writeEmpty = "";
  /*fs.writeFileSync("onloadTest.txt",writeEmpty, (err) =>{
    if(!err) {console.log("File Written\n\n\n");                    
            }
    else {
        console.log(data);
        console.log("err");
    }
  })
  */
  event.sender.send("completedLoad");
  event.returnValue =  0;   

})

ipcMain.on("balance_c++", (event) => {
  
  let mode = "1";
  fs.writeFileSync("mode.txt",mode, (err) =>{
    if(!err) {console.log("File Written\n\n\n");                    
            }
    else {
        console.log(data);
        console.log("err");
    }
  })

  const data = fs.readFileSync("mode.txt",
    {encoding:'utf8', flag:'r'});
  console.log(data);

  console.time('c++');
  hello2.hello();
  console.timeEnd('c++');
  console.log("after Balancing c++");
  event.sender.send("completedBalance");
  //window.webContents.send('completedBalance', {'SAVED': 'File Saved'});
  event.returnValue =  0;               
})


ipcMain.on("testc++", (event) => {
  
              function calc() {

                  // Two variables.
                  let i, x = 3.141526, y = 2.718;
                  for (i = 0; i < 100000000; i++) {
                      x += 1;
                
                  }
                  let total = x;
                  return total;
              }
                
              console.time('c++');
              hello2.hello();
              console.timeEnd('c++');
              console.log("after c++")
              console.time('js');
              calc();
              
                
              console.timeEnd('js');                       
  })
var stringPath = "";
ipcMain.on("uploadManifest", (event) => {
    //console.log("hello im trig");
    const dialog = electron.dialog;


  
    // Defining a Global file path Variable to store 
    // user-selected file
    global.filepath = undefined;
    
    
    // If the platform is 'win32' or 'Linux'
        if (process.platform !== 'darwin') {
            // Resolves to a Promise<Object>
            dialog.showOpenDialog({
                title: 'Select the File to be uploaded',
                defaultPath: path.join(__dirname, '../assets/'),
                buttonLabel: 'Upload',
                // Restricting the user to only Text Files.
                filters: [
                    {
                        name: 'Text Files',
                        extensions: ['txt', 'docx']
                    }, ],
                // Specifying the File Selector Property
                properties: ['openFile']
            }).then(file => {
                // Stating whether dialog operation was
                // cancelled or not.
                console.log(file.canceled);
                if (!file.canceled) {
                // Updating the GLOBAL filepath variable 
                // to user-selected file.
                global.filepath = file.filePaths[0].toString();
                stringPath = file.filePaths[0].toString();
                console.log(stringPath);
                console.log(global.filepath);
                readInput();
                manifestUplaodString = "Uploaded the manifest from file " + global.filepath + "\n";
                updateLogFile(manifestUplaodString);
                event.sender.send("shipUpload");
                fs.writeFileSync("shipName.txt",stringPath, (err) =>{
                  if(!err) {console.log("File Written\n\n\n");                    
                          }
                  else {
                      console.log(data);
                      console.log("err");
                  }
                })
                }  
            }).catch(err => {
                console.log(err)
            });
        }


})

ipcMain.on("download", (event) => {
  //let stringPath =global.filepath;
  const data = fs.readFileSync("shipName.txt",
    {encoding:'utf8', flag:'r'});
    //console.log(data[0]);
  let lines = data.split("\\");
  console.log(lines);
  console.log(typeof(stringPath));
  //let myArray = stringPath.split("\\");
  let currShipName = lines[lines.length - 1].split(".")[0];
  //console.log(lines[lines.length - 1].split(".")[0]);
  let outBoundString = currShipName + "OUTBOUND.txt";
  const dataShip = fs.readFileSync("currShip.txt",
    {encoding:'utf8', flag:'r'});
  let getRealShip = dataShip.split("\n");
  getRealShip = getRealShip.slice(0,96);
  console.log(getRealShip);
  let finalShipMani = getRealShip.join("\n");
  fs.writeFileSync(outBoundString,finalShipMani, (err) =>{
    if(!err) {console.log("File Written\n\n\n");                    
            }
    else {
        //console.log(data);
        console.log("err");
    }
  })
  let downloadString = "Download outbound file to : " + outBoundString;
  updateLogFile(downloadString);
  

})

ipcMain.on("getShipName", (event) => {
  //let stringPath =global.filepath;
  const data = fs.readFileSync("shipName.txt",
    {encoding:'utf8', flag:'r'});
    //console.log(data[0]);
  let lines = data.split("\\");
  console.log(lines);
  console.log(typeof(stringPath));
  event.returnValue = lines[lines.length - 1].split(".")[0];
  
  

})

const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')
var fs = require('fs');
const { event } = require('jquery');
const electron = require('electron');
const hello2 = require('./build/Release/hello');

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}

function readInput() {
  console.log(typeof global.filepath)
  const data = fs.readFileSync(global.filepath,
      {encoding:'utf8', flag:'r'});
  console.log(data);
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
    fs.appendFile("logfile1.txt",txtVal, (err) =>{
        if(!err) {console.log("File Written");                    
                }
        else {
            console.log(txtVal);
            console.log("err");
        }
    })
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
                
              console.time('js');
              calc();
                
              console.timeEnd('js');                       
  })

ipcMain.on("uploadManifest", (event) => {
    console.log("hello im trig");
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
                console.log(global.filepath);
                readInput();
                }  
            }).catch(err => {
                console.log(err)
            });
        }


})


'use-strict';

const {app , BrowserWindow, Menu} = require("electron");
// require('electron-reload')(__dirname);

let win;
function CreateWin(){
    win = new BrowserWindow({
    width: 850,
    height: 700,
    webPreferences:{
      nodeIntegration: true
    }
  });
  win.loadFile('src/markup.html');
  // win.webContents.openDevTools();
}

app.on('ready',() => {
  CreateWin();
});

//no menu
// let menu = Menu.buildFromTemplate([]);
// Menu.setApplicationMenu(menu);
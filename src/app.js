'use strict'

const electron = require('electron')
const app = electron.app
const globalShortcut = electron.globalShortcut
const menubar = require('menubar')
const config = require('./../package.json')
const path = require('path')


let autoLaunch = true
let iconSetting = 'auto'

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('will-quit', function () {
  // Unregister all shortcuts.
  globalShortcut.unregisterAll()
})

const mb = menubar({
  index: path.join('file://', __dirname, '/main/index.html'),
  icon: path.join(__dirname, '/../assets/IconTemplate.png'),
  width: 280,
  height: 480,
  // resizable: true,
  showDockIcon: false,
  preloadWindow: true
})


mb.on('ready', function ready () {
  autoUpdater()

  mb.window.openDevTools();
  mb.showWindow()
})

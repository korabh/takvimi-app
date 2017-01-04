'use strict'

const electron = require('electron')
const app = electron.app
const globalShortcut = electron.globalShortcut
const menubar = require('menubar')
const superagent = require('superagent')
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
  resizable: false,
  showDockIcon: false,
  preloadWindow: true
})

mb.on('ready', function ready () {
  autoUpdater()

  // mb.window.openDevTools();
  mb.showWindow()
})

const autoUpdater = function () {
  superagent
    .get('https://raw.githubusercontent.com/korabh/timings-app/master/package.json?token=ABfAplJMVgI3XZxihZ5L_2P5QjxxTjWJks5YdaNOwA%3D%3D')
    .end(function (err, res) {
      if (err || !res.ok) {
        console.log(err)
      } else {
        try {
          const newVersion = JSON.parse(res.text).version
          const oldVersion = config.version
          if (semver.gt(newVersion, oldVersion)) {
            const confirm = dialog.showMessageBox({
              type: 'info',
              message: 'A new version ' + newVersion + ' of Timings is available.',
              detail: 'Do you want to download it now?',
              buttons: ['Yes', 'No']
            })
            if (confirm === 0) {
              shell.openExternal('https://github.com/korabh/timings-app/releases')
            }
          }
        } catch (err) {
          console.log(err)
        }
      }
    })
}

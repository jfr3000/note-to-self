'use strict'

const path = require('path')
const fs = require('fs')
const { app, BrowserWindow, ipcMain, Tray } = require('electron')
const Positioner = require('electron-positioner')
const setupNotifications = require('./notification-timer')

const iconWithoutNotification = process.cwd() + '/without-notification.png'

app.on('ready', function ready () {
  const appWindow = createWindow()
  const trayIcon = new Tray(iconWithoutNotification)

  setUpListeners(appWindow, trayIcon)
  const setTimerForNextNotification = setupNotifications(trayIcon)
  setTimerForNextNotification()

  function setUpListeners() {
    trayIcon.on('click', () => {
      toggleWindowVisibility(appWindow)
    })

    ipcMain.on('ensureOnTop', () => {
      appWindow.setAlwaysOnTop(true)
    })

    ipcMain.on('ensureBlurrable', () => {
      appWindow.setAlwaysOnTop(false)
    })

    ipcMain.on('submit', (event, data) => {
      const filePath = path.join(process.env.HOME, data.time.toString())
      try {
        fs.writeFileSync(filePath, data.text)
        // TODO confirmation in UI
      } catch (err) {
        // TODO error in UI
        event.sender.send('error', err)
      }
      toggleWindowVisibility(appWindow)
      trayIcon.setImage(iconWithoutNotification)
      setTimerForNextNotification('tomorrow')
    })
  }
})

function createWindow () {
  const window = new BrowserWindow({
    width: 700,
    height: 400,
    show: false,
    frame: false,
    resizable: false
  })
  const positioner = new Positioner(window)
  positioner.move('topRight')
  window.loadURL('file://' +__dirname + '/index.html')

  return window
}

function toggleWindowVisibility (window) {
  window.isVisible() ? window.hide() : window.show()
}

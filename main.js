'use strict'

const path = require('path')
const fs = require('fs')
const { app, BrowserWindow, ipcMain, Tray } = require('electron')
const Positioner = require('electron-positioner')
const { setUpNotification, cancelPreviousNotification } = require('./notification-timer')
const { getSettings, writeSettings } = require('./config')

const iconWithoutNotification = process.cwd() + '/without-notification.png'

app.on('ready', function ready () {
  const appWindow = createWindow()
  appWindow.webContents.openDevTools()
  const trayIcon = new Tray(iconWithoutNotification)

  setUpListeners(appWindow, trayIcon)

  const notificationTime = getSettings().notificationTime
  let setTimerForNextNotification

  if (notificationTime) {
    setTimerForNextNotification = setUpNotification(notificationTime, trayIcon)
    setTimerForNextNotification()
  }

  function setUpListeners() {
    trayIcon.on('click', () => {
      toggleWindowVisibility(appWindow)
      trayIcon.setImage(iconWithoutNotification)
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
      } catch (err) {
        event.sender.send('error', err)
      }
      toggleWindowVisibility(appWindow)
      trayIcon.setImage(iconWithoutNotification)
      setTimerForNextNotification('tomorrow')
    })

    ipcMain.on('notificationTimeChange', (event, newTime) => {
      try {
        writeSettings({ notificationTime: newTime })
      } catch (err) {
        console.log(err)
        event.sender.send('error')
      }
      cancelPreviousNotification()
      if (newTime) {
        setTimerForNextNotification = setUpNotification(newTime, trayIcon)
        setTimerForNextNotification()
      }
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

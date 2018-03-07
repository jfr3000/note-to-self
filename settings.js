'use strict'

const ipcRenderer = require('electron').ipcRenderer
const notificationTime = require('./config').getSettings().notificationTime

const timeSettings = document.getElementById('time-settings')
const timeSelector = document.getElementById('time')
const yesButton = document.getElementById('yes')
const noButton = document.getElementById('no')

if (notificationTime && notificationTime.hour) {
  const value = notificationTime.hour + ':' + notificationTime.minute
  timeSelector.value = value
  yesButton.checked = true
  timeSettings.style.display = 'block'
}

yesButton.onclick = () => timeSettings.style.display= 'block'

noButton.onclick = () => {
  ipcRenderer.send('notificationTimeChange', null)
  timeSettings.style.display = 'none'
}

timeSelector.onchange = (e) => {
  const [hour, minute] = e.target.value.split(':')
  ipcRenderer.send('notificationTimeChange', { hour, minute })
}



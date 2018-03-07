'use strict'

const moment = require('moment')
const notify = require('./notify')

let existingTimer

function setUpNotification (time, trayIcon) {
  return function setUpTimer (isForNextDay) {
    const notificationTime = moment(time)
    const now = moment()

    if (isForNextDay || now.isAfter(notificationTime)) {
      notificationTime.add(1, 'days')
    }

    clearTimeout(existingTimer)
    existingTimer = setTimeout(() => {
      notify(trayIcon),
      setUpTimer(true)
    }, notificationTime.diff(now))
  }
}

function cancelPreviousNotification () {
  clearTimeout(existingTimer)
}

module.exports = { setUpNotification, cancelPreviousNotification }

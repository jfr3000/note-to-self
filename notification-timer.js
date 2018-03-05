'use strict'

const moment = require('moment')
const notify = require('./notify')

const timeFromSettings = require('./config').notificationTime

module.exports = function (trayIcon) {
  let existingTimer

  return function setUpTimer (isForTomorrow) {
    const notificationTime = moment(timeFromSettings)
    const now = moment()

    if (isForTomorrow || now.isAfter(notificationTime)) {
      notificationTime.add(1, 'days')
    }

    clearTimeout(existingTimer)
    existingTimer = setTimeout(() => {
      notify(trayIcon),
      setUpTimer(true)
    }, notificationTime.diff(now))
  }
}

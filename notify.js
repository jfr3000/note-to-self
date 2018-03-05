'use strict'

const { Notification } = require('electron')
const iconWithNotification = process.cwd() + '/notification.png'

module.exports = function notify(trayIcon) {
  const notification = new Notification({
    title: '280 daily',
    body: 'Time for your 280daily!'
  })
  notification.show()
  trayIcon.setImage(iconWithNotification)
}

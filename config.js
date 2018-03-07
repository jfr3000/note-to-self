'use strict'

const fs = require('fs')
const path = require('path')

const filename = path.join(process.env.HOME, '.notetoselfrc')

let settings = null

function getSettings() {
  if (!settings) settings = readSettings()
  return settings
}

function writeSettings (updated) {
  // TODO account for nesting
  const newSettings = Object.assign(getSettings(), updated)
  try {
    fs.writeFileSync(filename, JSON.stringify(newSettings))
  } catch (e) {
    console.log(e)
    throw new Error("Could not save settings")
  }
  settings = newSettings
}

function readSettings () {
  let settings
  try {
    settings = fs.readFileSync(filename, 'utf-8')
  } catch (err) {
    settings = JSON.stringify({ notificatioNTime: null })
  }
  return JSON.parse(settings)
}

module.exports = { getSettings, writeSettings }

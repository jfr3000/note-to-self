'use strict'

const ipcRenderer = require('electron').ipcRenderer

const textField = document.getElementById('text')
const characterCount = document.getElementById('characterCount')
const done = document.getElementById('done')

textField.addEventListener('keypress', updateCharacterCount)
textField.addEventListener('input', maybeToggleAlwaysOnTop)

done.addEventListener('click', function () {
  const text = textField.value
  const time = Date.now()
  ipcRenderer.send('submit', { text, time })
  reset()
})

ipcRenderer.on('error', (event, err) => {
  console.log(err)
})

function updateCharacterCount () {
  characterCount.innerHTML = 280 - textField.textLength
}

function maybeToggleAlwaysOnTop () {
  if (textField.textLength > 0) ipcRenderer.send('ensureOnTop')
  if (textField.textLength === 0) ipcRenderer.send('ensureBlurrable')
}

function reset () {
  textField.value =""
  characterCount.innerHTML = 280
}

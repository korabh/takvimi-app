const jQuery = require('jquery')

const config = require('./config.json')
const timings = require('./../components/timings')
const utils = require('./../utilities/utils')

window.onload = function () {
  init()

  timings.refreshTimings()
}

const init = function () {
  // store.setMbInfo
}

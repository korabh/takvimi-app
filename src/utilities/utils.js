const timings = require('./../components/timings')
const config = require('./../main/config.json')

const jQuery = require('jquery')

let wdata = {}

const getWdata = function () {
  return wdata
}

const setWdata = function (data) {
  wdata = data
}

const showErrorMessage = function (message) {
  hideAll()
  jQuery('#main .content .note').html(message)
}

exports.showErrorMessage = showErrorMessage
exports.getWdata = getWdata
exports.setWdata = setWdata

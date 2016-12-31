const store = require('./store')
const config = require('./../main/config.json')
const timings = require('./../components/timings')

const showErrorMessage = function (message) {
  hideAll()
  jQuery('#error').html(message)
}

const displayTitle = function (s) {
  return s.charAt(0).toUpperCase() + s.substring(1).toLowerCase()
}

exports.showErrorMessage = showErrorMessage
exports.displayTitle = displayTitle

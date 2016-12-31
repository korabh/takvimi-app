const store = require('./store')
const config = require('./../main/config.json')
const timings = require('./../components/timings')
const strftime = require('strftime')


const showErrorMessage = function (message) {
  hideAll()
  jQuery('#error').html(message)
}

const displayTitle = function (s) {
  return s.charAt(0).toUpperCase() + s.substring(1).toLowerCase()
}

const getTodayDate = function () {
  var date = new Date()
  return strftime('%Y/%m/%d')
}

exports.showErrorMessage = showErrorMessage
exports.displayTitle = displayTitle
exports.getTodayDate = getTodayDate

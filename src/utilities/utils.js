const store = require('./store')
const config = require('./../main/config.json')
const timings = require('./../components/timings')

const showErrorMessage = function (message) {
  hideAll()
  jQuery('#error').html(message)
}

exports.showErrorMessage = showErrorMessage

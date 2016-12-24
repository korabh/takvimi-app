const timings = require('./../components/timings')
const config = require('./../main/config.json')

const jQuery = require('jquery')

const showErrorMessage = function (message) {
  hideAll()
  jQuery('#main .content .time-note').html(message)
}

exports.showErrorMessage = showErrorMessage

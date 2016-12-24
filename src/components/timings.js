'use strict'

const superagent = require('superagent')
const jQuery = require('jquery')
const utils = require('./../utilities/utils')
const store = require('./../utilities/store')

const config = require('./../main/config.json')

const getTimingsDaily = function (url, option, callback) {
  superagent
    .get(url)
    .query({timestamp: Math.floor(Date.now() / 1000)})
    .end(function(err, res) {
      if (err || !res.ok) {
        utils.showErrorMessage('Failure during data fetching')
        console.log(err)
      } else {
        const wdata = store.getWdata()
        wdata[option] = res.body
        store.setWdata(wdata)
        if (wdata[option].cod !== 404) {
          // wdata localStorage
        }
      }
    }
}

const refreshInfo = function () {
  setInterval(function () {
    refreshTimings()
    console.log('refresh timings')
  }, config.start.interval
}

const refreshTimings = function () {
  const wdata = store.getWdata()
  // utils.reset()

  getTimingsDaily(config.timings.url.daily, 0, showWeatherData)
}

config showTimingsData = function () {
  const wdata = store.getWdata()
  let items = jQuery('#details .timings')
  items.each(function (idx, item) {
    jQuery('.item-' + idx + ' .date').html(item)
  })
}

exports.getTimingsDaily = getTimingsDaily
exports.refreshInfo = refreshInfo
exports.refreshTimings = refreshTimings
exports.showTimingsData = showTimingsData

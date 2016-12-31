'use strict'

const superagent = require('superagent')
const jQuery = require('jquery')
const _ = require('underscore')
const utils = require('./../utilities/utils')
const store = require('./../utilities/store')
const unslider = require('jquery-unslider')

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
          if (callback && typeof (callback) === 'function') {
            callback()
          } else {
            utils.showErrorMessage(wdata[option].message)
          }
        }
      }
    })
}

const refreshInfo = function () {
  setIeterval(function () {
    refreshTimings()
    console.log('refresh timings')
  }, config.start.interval)
}

const refreshTimings = function () {
  const wdata = store.getWdata()
  // utils.reset()
  getTimingsDaily(config.timings.url.daily, 0, showTimingsData)
}

const showTimingsData = function () {
  const wdata = store.getWdata()
  let _data = _.pairs(wdata[0].data)
  let items = jQuery('.timing-section .timing--tashi .timing__item')
  items.each(function (i, item) {
    jQuery('.item-' + i + ' .timing__title').html(_data[i][0])
    jQuery('.item-' + i + ' .timing__sentence').html("1 Rabi Al-Akhar, 1438 Hijri")
    jQuery('.item-' + i + ' .timing__price').html(_data[i][1])
    jQuery('.item-' + i + ' .timing__feature-list .timing__feature .upcoming-text').html("Upcoming Prayer")
    jQuery('.item-' + i + ' .timing__feature-list .timing__feature .upcoming-time').html("Dhuhr 11:43")
  })
 }

exports.getTimingsDaily = getTimingsDaily
exports.refreshInfo = refreshInfo
exports.refreshTimings = refreshTimings
exports.showTimingsData = showTimingsData

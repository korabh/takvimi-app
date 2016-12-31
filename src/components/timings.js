'use strict'

const superagent = require('superagent')
const jQuery = require('jquery')
const _ = require('underscore')
const countdown = require('jquery-countdown')
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
  // utils.reset()
  getTimingsDaily(config.timings.url.daily, 0, showTimingsData)
}

const showTimingsData = function () {
  const wdata = store.getWdata()
  let timingsData = _.pairs(wdata[0].data)
  // Temporary workaround.
  let items = jQuery('.timing-section .timing--tashi .timing__item')
  items.each(function (i, item) {
    jQuery('.item-' + i + ' .timing__title').html(utils.displayTitle(timingsData[i][0]))
    jQuery('.item-' + i + ' .timing__sentence').html(wdata[0].hijri_formatted)

    var finalDate = utils.getTodayDate() + ' ' + timingsData[i][1]
    jQuery('.item-' + i + ' .timing__time').attr("data-countdown", finalDate)
    jQuery('.item-' + i + ' .timing__feature-list .upcoming-text').html("Upcoming Prayer")
   
    var nextItem = timingsData[i+1]
    jQuery('.item-' + i + ' .timing__feature-list .upcoming-time').html(nextItem)

    jQuery('.timing-section .timing--tashi [data-countdown]').each(function() {
      var $this = jQuery(this), finalDate = jQuery(this).data('countdown');
      console.log(this);
      $this.countdown(finalDate, function(event) {
        var format = 'in %Hh %Mm';
        if (event.offset.totalHours <= 0) {
          format = 'in %Mm %Ss';
        }
        $this.html(event.strftime(format));
      })
    })
  })
}

const startCountdown = function () {
}

exports.getTimingsDaily = getTimingsDaily
exports.refreshInfo = refreshInfo
exports.refreshTimings = refreshTimings
exports.showTimingsData = showTimingsData
exports.startCountdown = startCountdown

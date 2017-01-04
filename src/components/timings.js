'use strict'

const superagent = require('superagent')
const jQuery = require('jquery')
const _ = require('underscore')
const countdown = require('jquery-countdown')
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
  showOwlCarousel()
}

const showTimingsData = function () {
  const wdata = store.getWdata()
  let data = _.pairs(wdata[0].data)
  let items = jQuery('.timing-section .timing--tashi .timing__item')
  items.each(function (idx, item) {
    jQuery('.item-' + idx + ' .timing__title').html(utils.displayTitle(data[idx][0]))
    jQuery('.item-' + idx + ' .timing__sentence').html(wdata[0].hijri_formatted)
    setDataCountdown(idx, data)
    if (idx != items.length-1) {
      jQuery('.item-' + idx + ' .timing__feature-list .upcoming-text').html("Upcoming Prayer")
    // Temporary workaround.
      jQuery('.item-' + idx + ' .timing__feature-list .upcoming-time').html(data[idx+1].join(' '))
    } else {
      jQuery('.item-' + idx + ' .timing__feature-list .upcoming-text').html(wdata[0].date)
    }
    startCountdown()
  })
}

const startCountdown = function () {
  let wrap = jQuery('.timing-section .timing--tashi [data-countdown]')
  wrap.each(function() {
    var $this = jQuery(this), finalDate = jQuery(this).data('countdown');
    $this.countdown(finalDate, function(event) {
      var format = 'in %Hh %Mm';
      if (event.offset.totalHours <= 0) {
        format = 'in %Mm %Ss';
      }
      $this.html(event.strftime(format));
    })
  })
}

const showOwlCarousel = function () {
  let owl = jQuery('.timing--tashi')
  // owl.carousel.js.
  owl.owlCarousel({
    items: 5,
    navigation: false,
    singleItem: true,
    afterAction : afterAction
  })

  jQuery('.owl-next').click(function(){
    owl.trigger('owl.next')
  })

  function afterAction(){
    console.log(this.owl.currentItem)
  }

}

const setDataCountdown = function (idx, data) {
  var date = utils.getTodayDate() + ' ' + data[idx][1]
  jQuery('.item-' + idx + ' .timing__time').attr('data-countdown', date)
}

exports.getTimingsDaily = getTimingsDaily
exports.refreshInfo = refreshInfo
exports.refreshTimings = refreshTimings
exports.showTimingsData = showTimingsData
exports.startCountdown = startCountdown
exports.showOwlCarousel = showOwlCarousel
exports.setDataCountdown = setDataCountdown

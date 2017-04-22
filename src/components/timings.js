'use strict'

const jQuery = require('jquery')
const $ = jQuery;
window.$ = jQuery;
const superagent = require('superagent')
const _ = require('underscore')
const countdown = require('jquery-countdown')
const utils = require('./../utilities/utils')
const store = require('./../utilities/store')
const notifier = require('node-notifier')
const strftime = require('strftime')

const config = require('./../main/config.json')

const getTimingsDaily = function (url, option, add_hours, callback) {
  add_hours = add_hours || 0;
  
  var date = new Date();
  date.setHours( date.getHours() + add_hours );
  window.dd = date;
  var dateString = strftime('%Y/%m/%d',date); 

  superagent
    .get(url)
    .query({timestamp: Math.floor(+date / 1000)})
    .end(function(err, res) {
      if (err || !res.ok) {
        utils.showErrorMessage('Failure during data fetching')
        console.log(err)
      } else {
        for(var i in res.body.data) {
          res.body.data[i] = dateString + " " + res.body.data[i];
        }
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
  getTimingsDaily(config.timings.url.daily, 0, 0, timingsLoaded)

  jQuery('.owl-next').click(function(){
    jQuery('.timing--tashi').trigger('owl.next')
  })

}

const timingsLoaded = function() {
  addTimingItems();
  showTimingsData();
  showOwlCarousel();
}

const addTimingItems = function() {
  for(var i=0; i<5; i++) {
    jQuery('.timing-section .timing--tashi').append( jQuery('.item-' + i) );
  }
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
      jQuery('.item-' + idx + ' .timing__feature-list .upcoming-time').html(data[idx+1].join(' '))
    } else {
      jQuery('.item-' + idx + ' .timing__feature-list .upcoming-text').html(wdata[0].date)
    }
  })
  startCountdown();
}

const startCountdown = function () {
  let wrap = jQuery('.timing-section .timing--tashi [data-countdown]')
  wrap.each(function(idx,el) {
    var $el = jQuery(el).parents('.timing__item');
    var $this = jQuery(this), finalDate = jQuery(this).data('countdown');
    $this.countdown(finalDate, function(event) {
      var format = 'in %Hh %Mm';
      if( event.offset.totalDays > 0 ) {
        format = 'in %Dd %Hh';
      }
      if (event.offset.totalHours <= 0) {
        format = 'in %Mm %Ss';
      }
      if( event.offset.totalMinutes <= 5 && !$el.data('notification-sent') && !event.elapsed ) {
        $el.data('notification-sent', true);
        let timeTitle = $el.find('.timing__title').text();
        
        notifier.notify({
          'title': 'Takvimi',
          'message': 'Koha e ' + timeTitle
        });
      }
      if (event.elapsed) {
        // Hide card.
        hideCard( $el );
      }
      $this.html(event.strftime(format));
    })
  })
}

const hideCard = function( el ) {
    setTimeout(function(){
      el.data('notification-sent', false);

      jQuery(el).find('[data-countdown]').countdown('remove');

      jQuery('.timing--tashi').data('owlCarousel').destroy();
      $('#hidden-times').append( el );
      
      if( $('.timing--tashi .timing__item').length == 0 ) {
        getTimingsDaily(config.timings.url.daily, 0, 24, timingsLoaded)
      }else{
        showOwlCarousel();
      }
    },50);
}

const showOwlCarousel = function () {
  let owl = jQuery('.timing--tashi');
  owl.data('owlInit',false);
  
  owl.owlCarousel({
    items: 5,
    navigation: false,
    singleItem: true,
    touchDrag: false,
    mouseDrag: false
  })
}

const setDataCountdown = function (idx, data) {
  jQuery('.item-' + idx + ' .timing__time').data('countdown', data[idx][1] ).attr('data-countdown', data[idx][1] );
}

exports.getTimingsDaily = getTimingsDaily
exports.refreshInfo = refreshInfo
exports.refreshTimings = refreshTimings
exports.showTimingsData = showTimingsData
exports.startCountdown = startCountdown
exports.showOwlCarousel = showOwlCarousel
exports.setDataCountdown = setDataCountdown
exports.hideCard = hideCard;

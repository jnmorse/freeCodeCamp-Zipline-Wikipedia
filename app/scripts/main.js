/* globals jQuery */
(function($) {
  'use strict';

  /**
   * Address where the wiki api is located
   * @var wikiApi
   */
  var wikiApi = 'https://en.wikipedia.org/w/api.php';

  /**
   * Previous time input was entered
   * @var previousTime
   */
  var previousTime;

  /**
   * Time To Wait Before Getting results
   * @var timeToWait
   */
  var timeToWait = 800;

  /**
   * Get the current timestamp
   * @return int timestamp
   */
  function getCurrentTimestamp() {
    var date = new Date();

    return date.getTime();
  }

  /**
   * Compare Timestamps
   * @return bool true if 1 second has passed since last character typed
   */
  function compareTime() {
    return getCurrentTimestamp() - previousTime >= timeToWait;
  }

  /**
   * Topic List to populate from api
   * @var topics
   */
  var topics = [];

  var getTopics = function(topic) {
    if (topic !== '' && compareTime() && topics.indexOf(topic) === -1) {
      topics.push(topic);

      var params = {
        action: 'query',
        format: 'json',
        prop: 'info|extracts',
        exsentences: 3,
        exintro: true,
        exsectionformat: 'plain',
        exlimit: 10,
        inprop: 'url',
        generator: 'search',
        gsrsearch: topic,
        gsrlimit: 10,
        gsrnamespace: 0,
        gsrprop: 'snippet'
      };

      $.ajax({
        url: wikiApi,
        data: params,
        type: 'POST',
        dataType: 'jsonp',
        headers: {
          'Api-User-Agent': 'WikiViewer/0.1.0'
        },
        success: function(data) {
          console.log(data);

          var pages = data.query.pages;
          var output = $('.wiki-content');

          output.html('');

          if (undefined !== pages) {
            for (var i in pages) {
              output.append('<div class="wiki-item"><header><h3><a href="' + pages[i].fullurl + '">' + pages[i].title + '</a></h3>' + pages[i].extract + '</header></div>');
            }
          }
        }
      });
    }
  };

  function randomTopic() {
    var params = {
      action: 'query',
      format: 'json',
      prop: 'info',
      inprop: 'url',
      generator: 'random',
      grnnamespace: 0,
      grnlimit: 1
    };

    $.ajax({
      url: wikiApi,
      data: params,
      type: 'POST',
      dataType: 'jsonp',
      success: function (data) {
        var pages = data.query.pages;
        window.location.href = pages[Object.keys(pages)[0]].fullurl;
      }
    });
  }

  $('#wiki-search').on('input', function() {
    previousTime = getCurrentTimestamp();
    setTimeout(getTopics, timeToWait, this.value);
  });

  $('#wiki-random').on('click', function () {
    randomTopic();
  });

  $('.wiki-search').on('submit', function() {
    return false;
  });

})(jQuery);

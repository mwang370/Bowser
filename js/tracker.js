var lastKnownScroll = 0;
var ticking = false;

$(document).on('click', null, function(event) {
  chrome.runtime.sendMessage({action: CLICK_MSG}, function(response) {
    console.log(response.ack);
  });
});

$(document).keypress(function(event){
  chrome.runtime.sendMessage({action: KEY_PRESS_MSG}, function(response) {
    console.log(response.ack);
  });
});

$(window).on('scroll', null, function(event) {
  lastKnownScroll = window.scrollY;
  if(!ticking) {
    window.requestAnimationFrame(function() {
      chrome.runtime.sendMessage({action: SCROLL_MSG, data: lastKnownScroll},
        function (response) {
          console.log(response.ack);
      });
      ticking = false;
    });
    ticking = true;
  }
});

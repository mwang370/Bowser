var lastKnownScroll = 0;
var ticking = false;

$(document).on('click', null, function(event) {
  console.log(event.target.outerHTML);
  chrome.runtime.sendMessage({
    action: CLICK_MSG,
    target: event.target.outerHTML,
    timestamp: Date.now()
  }, function(response) {
    console.log(response.ack);
  });
});

$(document).keypress(function(event){
  console.log(event.target);
  chrome.runtime.sendMessage({
    action: TYPE_MSG,
    target: event.target.outerHTML,
    timestamp: Date.now()
  }, function(response) {
    console.log(response.ack);
  });
});

$(window).on('scroll', null, function(event) {
  lastKnownScroll = window.scrollY;
  if(!ticking) {
    window.requestAnimationFrame(function() {
      chrome.runtime.sendMessage({
        action: SCROLL_MSG,
        yPos: lastKnownScroll,
        timestamp: Date.now()
      },
        function (response) {
          console.log(response.ack);
      });
      ticking = false;
    });
    ticking = true;
  }
});

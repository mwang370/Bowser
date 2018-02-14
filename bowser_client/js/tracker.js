var lastKnownScroll = 0;
var ticking = false;

$(document).on('click', null, function(event) {
  console.log(event.target);
  chrome.runtime.sendMessage({action: CLICK_MSG}, function(response) {
    console.log(response.ack);
  });
});

$(document).keypress(function(event){
  console.log(event.target);
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

window.addEventListener('popstate', function(event) {
    // The popstate event is fired each time when the current history entry changes.
    console.log("shit happened");

    var r = confirm("You pressed a Back button! Are you sure?!");

    if (r == true) {
        // Call Back button programmatically as per user confirmation.
        history.back();
        // Uncomment below line to redirect to the previous page instead.
        // window.location = document.referrer // Note: IE11 is not supporting this.
    } else {
        // Stay on the current page.
        history.pushState(null, null, window.location.pathname);
    }

    history.pushState(null, null, window.location.pathname);

}, false);

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

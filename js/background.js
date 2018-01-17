function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };
  chrome.tabs.query(queryInfo, (tabs) => {
    var tab = tabs[0];
    var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');
    callback(url);
  });
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  if (request.action === CLICK_MSG) {
    getCurrentTabUrl((url) => {
      console.log("received click message on url: " + url);
      incrementAttr(url, CLICK_ATTR);
      incrementAttr(TOTAL_URL, CLICK_ATTR);
      sendResponse({ack: CLICK_ACK});
    });
  } else if (request.action === KEY_PRESS_MSG) {
    getCurrentTabUrl((url) => {
      console.log("received key press message on url: " + url);
      incrementAttr(url, KEY_PRESS_ATTR);
      incrementAttr(TOTAL_URL, KEY_PRESS_ATTR)
      sendResponse({ack: KEY_PRESS_ACK});
    })
  }
  return true;
});

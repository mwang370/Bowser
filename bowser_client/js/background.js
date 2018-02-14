var outbox = new ReconnectingWebSocket("ws://blooming-garden-58768.herokuapp.com/submit")
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
      action = request.action;
      console.log("received click message on url: " + url);
      outbox.send(JSON.stringify({url: url, action:action}));
      incrementAttr(url, CLICK_ATTR);
      incrementAttr(TOTAL_URL, CLICK_ATTR);
      sendResponse({ack: CLICK_ACK});
    });
  } else if (request.action === KEY_PRESS_MSG) {
    getCurrentTabUrl((url) => {
      console.log("received key press message on url: " + url);
      incrementAttr(url, KEY_PRESS_ATTR);
      incrementAttr(TOTAL_URL, KEY_PRESS_ATTR);
      sendResponse({ack: KEY_PRESS_ACK});
    })
  } else if (request.action === SCROLL_MSG) {
    getCurrentTabUrl((url) => {
      console.log("received scroll message with data "
        + request.data + " on url: " + url);
      incrementAttr(url, SCROLL_ATTR);
      incrementAttr(TOTAL_URL, SCROLL_ATTR);
      sendResponse({ack: SCROLL_ACK});
    })
  }
  return true;
});

chrome.tabs.onCreated.addListener(function(tab) {
  console.log("new tab created with tab id: " + tab.id +"!");
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.url) {
    console.log("tab with id " + tabId + " has changed domain to " + changeInfo.url);
  }
});

chrome.webNavigation.onCommitted.addListener(function(details) {
  // handles transition types (can detect back button, forward button, and address bar)
  if (details.transitionQualifiers.includes("forward_back")) {
    console.log("back/forward button pressed");
  } else if (details.transitionQualifiers.includes("from_address_bar")){
    console.log("typed in address bar");
  }
});

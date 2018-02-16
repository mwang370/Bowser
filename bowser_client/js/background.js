var outbox = new ReconnectingWebSocket("ws://blooming-garden-58768.herokuapp.com/submit")

function getCurrentTab(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };
  chrome.tabs.query(queryInfo, (tabs) => {
    var tab = tabs[0];
    var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');
    callback(tab);
  });
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  var action = request.action;
  var timestamp = request.timestamp;
  var target = request.target;
  if (request.action === CLICK_MSG) {
    getCurrentTab((tab) => {
      var url = tab.url;
      var tabId = tab.id;
      console.log("received click message on url: " + url);
      outbox.send(JSON.stringify({
        url: url,
        action: action,
        timestamp: timestamp,
        tabId: tabId,
        target: target
      }));
      incrementAttr(url, CLICK_ATTR);
      incrementAttr(TOTAL_URL, CLICK_ATTR);
      sendResponse({ack: CLICK_ACK});
    });
  } else if (request.action === TYPING_MSG) {
    getCurrentTab((tab) => {
      var url = tab.url;
      var tabId = tab.id;
      console.log("received typing message on url: " + url);
      outbox.send(JSON.stringify({
        url: url,
        action: action,
        timestamp: timestamp,
        tabId: tabId,
        target: target
      }));
      incrementAttr(url, TYPING_ATTR);
      incrementAttr(TOTAL_URL, TYPING_ATTR);
      sendResponse({ack: TYPING_ACK});
    })
  } else if (request.action === SCROLL_MSG) {
    getCurrentTab((tab) => {
      var url = tab.url;
      console.log("received scroll message with data "
        + request.newY + " on url: " + url);
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

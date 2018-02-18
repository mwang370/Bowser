var outbox = new ReconnectingWebSocket("ws://blooming-garden-58768.herokuapp.com/submit")
var ip;

getLocalIPs(function(ips) { // <!-- ips is an array of local IP addresses.
    ip = ips.join('\n ');
});

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
        target: target,
        ip: ip
      }));
      incrementAttr(url, CLICK_ATTR);
      incrementAttr(TOTAL_URL, CLICK_ATTR);
      sendResponse({ack: CLICK_ACK});
    });
  } else if (request.action === TYPE_MSG) {
    getCurrentTab((tab) => {
      var url = tab.url;
      var tabId = tab.id;
      console.log("received type message on url: " + url);
      outbox.send(JSON.stringify({
        url: url,
        action: action,
        timestamp: timestamp,
        tabId: tabId,
        target: target,
        ip: ip
      }));
      incrementAttr(url, TYPE_ATTR);
      incrementAttr(TOTAL_URL, TYPE_ATTR);
      sendResponse({ack: TYPE_ACK});
    })
  } else if (request.action === SCROLL_MSG) {
    getCurrentTab((tab) => {
      var url = tab.url;
      var tabId = tab.id;
      var yPos = request.yPos
      console.log("received scroll message with data "
        + request.newY + " on url: " + url);
      outbox.send(JSON.stringify({
        action: action,
        timestamp: timestamp,
        url: url,
        tabId: tabId,
        yPos: yPos,
        ip: ip
      }))
      incrementAttr(url, SCROLL_ATTR);
      incrementAttr(TOTAL_URL, SCROLL_ATTR);
      sendResponse({ack: SCROLL_ACK});
    })
  }
  return true;
});

chrome.tabs.onCreated.addListener(function(tab) {
  console.log("new tab created with tab id: " + tab.id +"!");
  var action = NEW_TAB_MSG;
  var timestamp = Date.now();
  var tabId = tab.id;
  outbox.send(JSON.stringify({
    action: action,
    timestamp: timestamp,
    tabId: tabId,
    ip: ip
  }))
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.url) {
    console.log("tab with id " + tabId + " has changed domain to " + changeInfo.url);
    var action = URL_CHANGE_MSG;
    var timestamp = Date.now();
    var url = changeInfo.url;
    outbox.send(JSON.stringify({
      action: action,
      timestamp: timestamp,
      tabId: tabId,
      url: url,
      ip: ip
    }))
  }
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
  var action = TAB_CHANGE_MSG;
  var timestamp = Date.now();
  var tabId = activeInfo.tabId;
  outbox.send(JSON.stringify({
    action: action,
    timestamp: timestamp,
    tabId: tabId,
    ip: ip
  }))
});

chrome.webNavigation.onCommitted.addListener(function(details) {
  // handles transition types (can detect back button, forward button, and address bar)
  var timestamp = Date.now();
  getCurrentTab((tab) => {
    if (details.transitionQualifiers.includes("forward_back")) {
      console.log("back/forward button pressed");
      var action = BACK_BUTTON_MESSAGE;
      var tabId = tab.id;
      outbox.send(JSON.stringify({
        action: action,
        timestamp: timestamp,
        tabId: tabId,
        ip: ip
      }))
    } else if (details.transitionQualifiers.includes("from_address_bar")){
      var action = OMNIBOX_MESSAGE;
      var tabId = tab.id;
      outbox.send(JSON.stringify({
        action: action,
        timestamp: timestamp,
        tabId: tabId,
        ip: ip
      }))
      console.log("typed in address bar");
    }
  })
});

var outbox = new ReconnectingWebSocket("ws://blooming-garden-58768.herokuapp.com/submit")
var uid = "michael"

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

setInterval(function() {
  getCurrentTab((tab) => {
    var url = tab.url;
    var tabId = tab.id;
    var action = AWAKE_MSG;
    var timestamp = Date.now();
    outbox.send(JSON.stringify({
      url: url,
      action: action,
      timestamp: timestamp,
      tabId: tabId,
      uid: uid
    }));
  });
}, AWAKE_TIMER * 60 * 1000);

// chrome.storage.local.get('uid', function(result){
//   console.log(result);
//   console.log(result.uid);
//   if (typeof result.uid === 'undefined') {
//     var key = 'uid';
//     var obj = {};
//     obj[key] = uid;
//     chrome.storage.local.set(obj);
//   } else {
//     uid = result.uid;
//     console.log("uid already set: " + result.uid);
//   }
// });

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  var action = request.action;
  var timestamp = request.timestamp;
  var data = request.data;
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
        data: data,
        uid: uid
      }));
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
        data: data,
        uid: uid
      }));
      sendResponse({ack: TYPE_ACK});
    })
  } else if (request.action === SCROLL_MSG) {
    getCurrentTab((tab) => {
      var url = tab.url;
      var tabId = tab.id;
      var data = request.data
      console.log("received scroll message with data "
        + request.newY + " on url: " + url);
      outbox.send(JSON.stringify({
        action: action,
        timestamp: timestamp,
        url: url,
        tabId: tabId,
        data: data,
        uid: uid
      }))
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
    uid: uid
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
      uid: uid
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
    uid: uid
  }))
});

chrome.webNavigation.onCommitted.addListener(function(details) {
  // handles transition types (can detect back button, forward button, and address bar)
  var timestamp = Date.now();
  getCurrentTab((tab) => {
    if (details.transitionQualifiers.includes("forward_back")) {
      console.log("back/forward button pressed");
      var action = BACK_BUTTON_MSG;
      var tabId = tab.id;
      outbox.send(JSON.stringify({
        action: action,
        timestamp: timestamp,
        tabId: tabId,
        uid: uid
      }))
    } else if (details.transitionQualifiers.includes("from_address_bar")){
      var action = OMNIBOX_MSG;
      var tabId = tab.id;
      outbox.send(JSON.stringify({
        action: action,
        timestamp: timestamp,
        tabId: tabId,
        uid: uid
      }))
      console.log("typed in address bar");
    }
  })
});

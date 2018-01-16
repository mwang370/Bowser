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
  console.log("bowser console log");
  if (request.action === "click") {
    getCurrentTabUrl((url) => {
      console.log("received click message on url: " + url);
      sendResponse({trigger: "click received"});
      getSavedPageClicks(url, (numClicks) => {
        console.log(numClicks);
        if (numClicks) {
          numClicks++;
        } else {
          numClicks = 1;
        }
        savePageClicks(url, numClicks);
      });
      getSavedTotalClicks((numClicks) => {
        if (numClicks) {
          numClicks++;
        } else {
          numClicks = 1;
        }
        saveTotalClicks(numClicks);
      });
    });
  }
  return true;
});

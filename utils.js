function savePageClicks(url, numClicks) {
  var items = {};
  items[url] = numClicks;
  chrome.storage.sync.set(items);
}

function saveTotalClicks(numClicks) {
  savePageClicks("total", numClicks);
}

function getSavedPageClicks(url, callback) {
  chrome.storage.sync.get(url, (items) => {
    callback(chrome.runtime.lastError ? 0 : items[url]);
  });
}

function getSavedTotalClicks(callback) {
  getSavedPageClicks("total", callback);
}

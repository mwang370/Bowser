const TOTAL_URL = "total";

const CLICK_MSG = "click";
const CLICK_ACK = "click received";
const CLICK_ATTR = "# of clicks";

const KEY_PRESS_MSG = "key press";
const KEY_PRESS_ACK = "key press received";
const KEY_PRESS_ATTR = "# of key presses";

const SCROLL_MSG = "scroll";
const SCROLL_ACK = "scroll received";
const SCROLL_ATTR = "# of scrolls";

function uniquify(url, attrName) {
  return url + '*' + attrName;
}

function deuniquify(uid) {
  // TODO
}

function saveAttr(url, attrName, val) {
  uid = uniquify(url, attrName);
  var newEntry = {}
  newEntry[uid] = val;
  chrome.storage.sync.set(newEntry);
}

function getAttr(url, attrName, callback) {
  var uid = uniquify(url, attrName);
  chrome.storage.sync.get(uid, (entries) => {
    callback(chrome.runtime.lastError ? 0 : entries[uid]);
  });
}

function incrementAttr(url, attrName) {
  getAttr(url, attrName, (val) => {
    if (val) {
      val++;
    } else {
      val = 1;
    }
    saveAttr(url, attrName, val);
  });
}

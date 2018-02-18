const TOTAL_URL = "total";

const CLICK_MSG = "click";
const CLICK_ACK = "click received";
const CLICK_ATTR = "# of clicks";

const TYPE_MSG = "type";
const TYPE_ACK = "type received";
const TYPE_ATTR = "# of types";

const SCROLL_MSG = "scroll";
const SCROLL_ACK = "scroll received";
const SCROLL_ATTR = "# of scrolls";

const NEW_TAB_MSG = "newTab";
const URL_CHANGE_MSG = "urlChange";
const BACK_BUTTON_MESSAGE = "backButton";
const OMNIBOX_MESSAGE = "omnibox";
const TAB_CHANGE_MSG = "tabChange";

function getLocalIPs(callback) {
    var ips = [];

    var RTCPeerConnection = window.RTCPeerConnection ||
        window.webkitRTCPeerConnection || window.mozRTCPeerConnection;

    var pc = new RTCPeerConnection({
        // Don't specify any stun/turn servers, otherwise you will
        // also find your public IP addresses.
        iceServers: []
    });
    // Add a media line, this is needed to activate candidate gathering.
    pc.createDataChannel('');

    // onicecandidate is triggered whenever a candidate has been found.
    pc.onicecandidate = function(e) {
        if (!e.candidate) { // Candidate gathering completed.
            pc.close();
            callback(ips);
            return;
        }
        var ip = /^candidate:.+ (\S+) \d+ typ/.exec(e.candidate.candidate)[1];
        if (ips.indexOf(ip) == -1) // avoid duplicate entries (tcp/udp)
            ips.push(ip);
    };
    pc.createOffer(function(sdp) {
        pc.setLocalDescription(sdp);
    }, function onerror() {});
}

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

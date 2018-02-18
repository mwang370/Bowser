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

document.addEventListener('DOMContentLoaded', () => {
  $('#b_clear').on('click', null, function() {
    console.log('hi');
    chrome.storage.sync.clear();
  });

  getCurrentTabUrl((url) => {
    getAttr(url, CLICK_ATTR, (val) => {
      console.log(val);
      $('#p_nc_page').text(val);
    });
    getAttr(TOTAL_URL, CLICK_ATTR, (val) => {
      console.log(val);
      $('#p_nc_total').text(val);
    });

    getAttr(url, TYPE_ATTR, (val) => {
      console.log(val);
      $('#p_nk_page').text(val);
    });

    getAttr(TOTAL_URL, TYPE_ATTR, (val) => {
      console.log(val);
      $('#p_nk_total').text(val);
    });

    getAttr(url, SCROLL_ATTR, (val) => {
      console.log(val);
      $('#p_ns_page').text(val);
    });

    getAttr(TOTAL_URL, SCROLL_ATTR, (val) => {
      console.log(val);
      $('#p_ns_total').text(val);
    });
  });
});

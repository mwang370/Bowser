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
  getCurrentTabUrl((url) => {
    var pNumClicksPage = document.getElementById('p_num_clicks_page');
    var pNumClicksTotal = document.getElementById('p_num_clicks_total');
    getAttr(url, CLICK_ATTR, (val) => {
      console.log(val);
      $('#p_num_clicks_page').text(val);
    });
    getAttr(TOTAL_URL, CLICK_ATTR, (val) => {
      console.log(val);
      $('#p_num_clicks_total').text(val);
    });

    getAttr(url, KEY_PRESS_ATTR, (val) => {
      console.log(val);
      $('#p_num_key_presses_page').text(val);
    });

    getAttr(TOTAL_URL, KEY_PRESS_ATTR, (val) => {
      console.log(val);
      $('#p_num_key_presses_total').text(val);
    });

  });
});

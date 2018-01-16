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
    getSavedPageClicks(url, (numClicks) => {
      console.log(numClicks);
      $('#p_num_clicks_page').text(numClicks);
    });
    getSavedTotalClicks((numClicks) => {
      console.log(numClicks);
      $('#p_num_clicks_total').text(numClicks);
    });
  });
});

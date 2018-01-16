$('body').on('click', null, function(event) {
    chrome.runtime.sendMessage({action: "click"}, function(response) {
        console.log(response);
    });
});

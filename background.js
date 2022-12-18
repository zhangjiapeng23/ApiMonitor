
chrome.runtime.onInstalled.addListener(function (){
    chrome.storage.local.set({"apiMonitorStatus": 'false'});
    chrome.storage.local.set({"apiOvertime": 1000});
});





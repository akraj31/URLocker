
var parentTab;
var correctPasswordEntered = false;

/*
// Handle requests for passwords
chrome.runtime.onMessage.addListener(function(request) {

  if (!correctPasswordEntered && request.type === 'request_password') {  
    parentTab = request.url;
      chrome.tabs.update({
        url: chrome.extension.getURL('popup.html')
      });
  } else if(request.type === 'lock_websites') {
      //get message and lock
      correctPasswordEntered = false;
  }
});
*/

function handleCorrectPassword() {
  correctPasswordEntered = true;
  chrome.tabs.update({
    url: parentTab
  });
};


var promptOpen = false;
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if(promptOpen){
    return;
  }
  if (changeInfo && changeInfo.status === 'complete') {
      chrome.tabs.update({
        url: chrome.extension.getURL('popup.html')
      });
      promptOpen = true;
  }
});
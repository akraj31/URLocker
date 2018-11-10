
var parentTab = {}; // To store the url to redirect after successful authentication
var correctPasswordEntered = false; // It will take care that once correct password is entered, then all the websites are unlocked till they are locked again or browser is reopened

// message types to listen to
var messgeTypes = {
  lock_all_websites: "lock_all_websites",
  prompt_closed: "prompt_closed",
  add_website: "add_website",
  remove_website: "remove_website"
}

var dataObjName = "urlockData";

/**
 * Listen and handle for various messages
 */
chrome.runtime.onMessage.addListener(function(request) {

  if(request.type === messgeTypes.lock_all_websites) {
      correctPasswordEntered = false;
  } else if(request.type === messgeTypes.add_website) {
      addWebsite();
  } else if(request.type === messgeTypes.remove_website) {
      removeWebsite();
  }
});

/**
 * Add a website to lockd list
 * If the extension is being used for first time, data is being initialized
 */
function addWebsite(){

  chrome.storage.sync.get(["urlockData"] , function (result) {
    // initialize data if not set already before
    if (typeof result === 'undefined' || Object.keys(result) == 0) {

        var initialData = {
            urls: {
              "chrome://extensions/": 1
            },
            password:  "asdf"
        }
        chrome.storage.sync.set({ urlockData: initialData }, function () {});
    }

    // add the new URL
    chrome.storage.sync.get(['urlockData'], function (response) {
      chrome.tabs.query({currentWindow: true, active : true}, function(tabArray){
        response['urlockData']['urls'][parentTab[tabArray[0].id]] = 1;
        chrome.storage.sync.set({ urlockData: response[dataObjName] }, function () {});
        console.log("added: " + parentTab[tabArray[0].id]);
      });
    });
  });
}

/**
 * Remove a URL from the list of locked website
 */
function removeWebsite(){
  chrome.storage.sync.get(['urlockData'], function (response) {
    chrome.tabs.query({currentWindow: true, active : true}, function(tabArray){
      if(response['urlockData']['urls'].hasOwnProperty(parentTab[tabArray[0].id])){
        console.log("removing: " + parentTab[tabArray[0].id]);
        delete response['urlockData']['urls'][parentTab[tabArray[0].id]];
        chrome.storage.sync.set({ urlockData: response['urlockData'] }, function () {});
      }
    });
  });
}

/**
 * To open the entered URL after authentication
 */
function checkPassword(password, callback) {
  chrome.storage.sync.get(['urlockData'], function (response) {
    if(response['urlockData']['password'] == password){
      correctPasswordEntered = true;
      chrome.tabs.query({currentWindow: true, active : true}, function(tabArray){
        chrome.tabs.update({
          url: parentTab[tabArray[0].id]
        });
      });
      //chrome.tabs.goBack();
    } else {
      callback({status: false});
    }
  });
};

/**
 * check if the url is extension password prompt
 * @param {*} url 
 */
function isPasswordPrompt(url){
  if(url.split(':')[0] == "chrome-extension") {
    var pageNameSplit = url.split('/');
    if(pageNameSplit[pageNameSplit.length - 1] == "popup.html") {
       return true;
    }
  }
  return false;
}

/**
 * To check if the current URL is subpage of already locked URLs
 */
function isHomepageLocked(lockedUrls, currentUrl) {

  for(var i = 0; i < lockedUrls.length; ++i) {
      var subPage = currentUrl.substr(0, lockedUrls[i].length);
      if(lockedUrls[i] == subPage){
        return true;
      }
  }
  return false;
}


/**
 * Listener for tab update
 */
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

  if(correctPasswordEntered){
    return;
  }

  if(isPasswordPrompt(tab.url)){
    return;
  }

  parentTab[tabId] = tab.url;
  chrome.storage.sync.get(['urlockData'], function (response) {
    if (changeInfo && changeInfo.status === 'loading') {
      if(response.hasOwnProperty('urlockData')) {
        if(isHomepageLocked(Object.keys(response['urlockData']['urls']), parentTab[tabId])){
          chrome.tabs.update({
            url: chrome.extension.getURL('popup.html')
          });
        }
      }
    }
  });
});

/**
 * Update the URL to open whenever tab is switched
 */
chrome.tabs.onActivated.addListener(function(tabInfo) {
    chrome.tabs.query({windowId: tabInfo.windowId, active: true}, function(activeTab){
        if(correctPasswordEntered && parentTab[tabInfo.tabId] != activeTab[0].url) {
          chrome.tabs.update({
            url: parentTab[tabInfo.tabId]
          });
        } else {
          console.log(activeTab[0].url);
          if(!isPasswordPrompt(activeTab[0].url)) {
            parentTab[tabInfo.tabId] = activeTab[0].url;
          }
        }
    });
});


/**
 * Check old password and change if correct
 */
function changePassword(oldPassword, newPassword, callback) {
  chrome.storage.sync.get(['urlockData'], function (response) {
    if(response[dataObjName]['password'] == oldPassword){
      response[dataObjName]['password'] = newPassword;
      chrome.storage.sync.set({ urlockData: response[dataObjName] }, function () {
        callback({
          status: true,
          info: "Password successfully changed"
        });
      });
    } else {
      callback({
        status: false,
        info: "Old password is wrong"
      })
    }
  });
}
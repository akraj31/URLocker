document.getElementById("lockAllBtn").addEventListener("click", lockAll);

document.getElementById("addWebsiteBtn").addEventListener("click", addWebsite);

document.getElementById("removeWebsiteBtn").addEventListener("click", removeWebsite);

document.getElementById("changePasswdBtn").addEventListener("click", changePassword);



function clicked() {
    this.style.opacity = 0.7;
    var self = this;
    setTimeout(function() {
        self.style.opacity = 1;
    }, 150);
}

function unclicked() {
    this.style.opacity = 1;
}

/**
 * Lock all websites, so that next time authentication is required
 * to open a locked website
 */
function lockAll() {
    clicked.call(this);
    chrome.runtime.sendMessage({type:'lock_all_websites'});
}

/**
 * add the current URL to list of locked website
 */
function addWebsite() {
    clicked.call(this);
    chrome.runtime.sendMessage({type:'add_website'});
}

/**
 * remove the current URL from list of locked website
 */
function removeWebsite() {
    clicked.call(this);
    chrome.runtime.sendMessage({type:'remove_website'});
}

/**
 * called when user opts to change password
 */
function changePassword(){
    var oldPasswd = document.getElementById('oldPasswd').value;
    var newPasswd = document.getElementById('newPasswd').value;
    var conformPasswd = document.getElementById('conformPasswd').value;
    var error = document.getElementById('error');

    if(newPasswd != conformPasswd) {
        error.innerHTML = "Password do not match"
    } else {
        chrome.runtime.getBackgroundPage(function(bgWindow) {
            bgWindow.changePassword(oldPasswd, newPasswd, changePasswordStatus);
        });
    }
}

/**
 * Callback after password change request
 * @param {*} msg {status: true/false, info: information about what happened}
 */
function changePasswordStatus(msg) {
    if(msg.status == true){
        error.style.color = 'Green'
        setTimeout(function(){
            error.innerHTML = "";
        }, 3000)
    } else {
        error.style.color = 'Red'
    }
    error.innerHTML = msg.info;
}

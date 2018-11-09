//document.getElementById("submitBtn").addEventListener("click", submit);

/**
 * Submit the password form if correct password entered
 */
document.forms[0].onsubmit = function(e) {
    e.preventDefault(); // Prevent submission
    var password = document.getElementById('passwd').value;

    chrome.runtime.getBackgroundPage(function(bgWindow) {
        bgWindow.checkPassword(password, passwordStatus);
    });
};

/**
 * Callback when password entered was wrong
 * @param {*} msg 
 */
function passwordStatus(msg) {
    if(msg.status == false) {
        document.getElementById('error').innerHTML = "wrong password";
    }
}

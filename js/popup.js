document.forms[0].onsubmit = function(e) {
    e.preventDefault(); // Prevent submission
    var password = document.getElementById('pass').value;

    if(password == "asdf"){// check if password is correct
        chrome.runtime.getBackgroundPage(function(bgWindow) {
            bgWindow.handleCorrectPassword();
        });
    } else {
        document.getElementById('error').innerHTML = "wrong password";
    }
};
//if (confirm('Open dialog for testing?'))
//chrome.runtime.sendMessage({type:'request_password', url: document.location.href});

    /*
// content.js
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if( request.message === "clicked_browser_action" ) {
        var firstHref = $("a[href^='http']").eq(0).attr("href");
  
        console.log(firstHref);

        chrome.runtime.sendMessage({"message": "open_new_tab", "url": firstHref});
      }
    }
  );
  */

function hidePage(){
  //$('body').append('<div id="over" st yle="position: absolute;top:0;left:0;width: 100%;height:100%;z-index:2;opacity:0.4;filter: alpha(opacity = 50)"></div>');
    //$('body').style.backgroundColor="red"
    //document.body.style.backgroundColor="red"
    //code: 'document.body.disabled=true'

  //document.body.append('<div id="over" st yle="position: absolute;top:0;left:0;width: 100%;height:100%;z-index:2;opacity:0.4;filter: alpha(opacity = 50)"></div>');
  //document.body.style.display = 'none'
  //console.log(window.URL)
}

hidePage();
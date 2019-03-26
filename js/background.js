const USER_AGENT = 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'
const ENABLE_ICON_PATH = "icon/enable.png"
const DISABLE_ICON_PATH = "icon/disable.png"
function mofifyUserAgent(details){
    let requestHeaders = details.requestHeaders
    let isHeaderModified = false
    for(let index = 0; index < requestHeaders.length; index++) {
        if( requestHeaders[index].name.toUpperCase() === 'USER-AGENT' ) {
            requestHeaders[index].value = USER_AGENT
            isHeaderModified = true
            break
        }
    }
    if(!isHeaderModified) {
        requestHeaders.push({name: 'User-Agent', value: USER_AGENT})
    }
    return {requestHeaders: requestHeaders}
}

function enable(){
    isEnable = true
    chrome.webRequest.onBeforeSendHeaders.addListener(mofifyUserAgent, {urls: [ "*://*.instagram.com/*" ]}, ['requestHeaders','blocking'])
    setIcon(ENABLE_ICON_PATH)
    reloadInstagramTab()
}

function disable(){
    isEnable = false
    chrome.webRequest.onBeforeSendHeaders.removeListener(mofifyUserAgent)
    setIcon(DISABLE_ICON_PATH)
    reloadInstagramTab()
}

let isEnable = true
chrome.browserAction.onClicked.addListener(function(tab) {
    if(isEnable) {
        disable()
    } else enable()
})

if(isEnable) enable()

function setIcon(path){
    chrome.browserAction.setIcon({
        path : path
    })
}

function reload(tab){
    chrome.tabs.reload(tab.id)
}

function reloadInstagramTab(){
    chrome.tabs.query({url: "https://www.instagram.com/*"}, function (tabs) {
        tabs.forEach(tab => {
            reload(tab)
        })
    })
}
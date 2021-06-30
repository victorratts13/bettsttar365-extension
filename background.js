/*
  Bettsttar v1.7
  copy bets for award
  author: victor ratts,
  build: 017,
  language: js
  enviroment: nodeJS.

  B-copy Company © 2021 - All rights reserved.
  
*/
chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.debugger.attach({ tabId: tab.id }, version,
    onAttach.bind(null, tab.id));
});
var version = '1.0';
function onAttach(tabId) {
  console.log(tabId)
  if (chrome.runtime.lastError) {
    alert(chrome.runtime.lastError.message);
    return;
  }
  console.log(tabId)
  chrome.windows.create(
    { url: 'headers.html?call=' + tabId, type: 'popup', width: 430, height: 720 });
}

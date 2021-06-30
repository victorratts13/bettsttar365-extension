/*
  Bettsttar v1.7
  copy bets for award
  author: victor ratts,
  build: 017,
  language: js
  enviroment: nodeJS.

  B-copy Company © 2021 - All rights reserved.

*/

var query = window.location.search.length;
var ct = window.location.search;
var splitArr = ct.split('=');
var guest = '';
splitArr = splitArr.map(n => {
  if(isNaN(Number(n)) !== true){
    if(n !== undefined){
      return Number(n);
    }
  }
})
for(var an of splitArr){
  if(an !== undefined){
    guest = an;
  }
}
console.log(guest);
var tabId = parseInt(guest);
console.log(tabId);
var ws = io('http://localhost:8001');
ws.emit('ident', {call: 'extension'})
ws.emit('event', {status: 'success', evento: 'teste'})
ws.on('test', test => {
  console.log(test)
})
console.log('start edbot system');
function response(params, id, dataRequest) {
  if (params.response.url.includes('placebet') == true || params.response.url.includes('closebet') == true) {
    chrome.debugger.sendCommand({
      tabId: id
    }, 'Network.getResponseBody', {
      'requestId': params.requestId
    }, function async(response) {
      var jsonObjectResponse = {
        id: params.requestId,
        headers: params.response.headers,
        url: params.response.url,
        body: response.body,
        methods: 'response'
      }
      var jsonObjectRequest = {
        id: dataRequest.requestId,
        headers: dataRequest.request.headers,
        url: dataRequest.request.url,
        body: dataRequest.request.postData,
        methods: 'request'
      }
      console.log({ 'req': jsonObjectRequest, 'res': jsonObjectResponse });
      ws.emit('ext', { 'req': jsonObjectRequest, 'res': jsonObjectResponse });
    })
  }
}

chrome.debugger.sendCommand({
  tabId: tabId
}, 'Network.enable');
var getData = {};
chrome.debugger.onEvent.addListener((debuggeeId, message, params) => {
  if (message == 'Network.requestWillBeSent') {
    getData = params;
    response(params, debuggeeId.tabId);
  }
  if (message == 'Network.responseReceived') {
    response(params, debuggeeId.tabId, getData);
  }
})

/*
    Bettsttar v2.0
    copy bets for award
    author: victor ratts,
    build: 257,
    language: js
    enviroment: nodeJS.

    B-copy Company © 2021 - All rights reserved.

*/
var query = window.location.search.length;
var ct = window.location.search;
var splitArr = ct.split('=');
var guest = '';
splitArr = splitArr.map(n => {
    if (isNaN(Number(n)) !== true) {
        if (n !== undefined) {
            return Number(n);
        }
    }
})
for (var an of splitArr) {
    if (an !== undefined) {
        guest = an;
    }
}
console.log(guest);
var tabId = parseInt(guest);
console.log(tabId);
var ws = io('http://localhost:8001');
ws.emit('ident', { call: 'extension' })
ws.emit('event', { status: 'success', evento: 'teste' })
ws.on('connection-status', test => {
    console.log(test)
    $('#statusConnection').removeClass('text-danger').addClass('text-success').html('Connected')
})
console.log('start edbot system');

function debuggerFrame(params, id, data) {
    return new Promise((resolve, reject) => {
        chrome.debugger.sendCommand({ tabId: id }, 'Network.getResponseBody', { 'requestId': params.requestId }, function async(response) {
            var jsonObjectResponse = {
                id: params.requestId,
                headers: params.response.headers,
                url: params.response.url,
                body: response.body,
                methods: 'response'
            }
            var jsonObjectRequest = {
                id: data.requestId,
                headers: data.request.headers,
                url: data.request.url,
                body: data.request.postData,
                methods: 'request'
            }
            return resolve({ 'req': jsonObjectRequest, 'res': jsonObjectResponse })
        })
    })
}

function moduleTable(rest) {
    var tbr = JSON.parse(rest.res.body);
    console.log(tbr)
    var tx = '', arr = [];
    tx = `
            <tr>
                <th scope="row">${tbr.br}</th>
                <td>${(tbr.la.map(mp => { return mp.fd || '--' })[0] || 'esportes virtuais | galgos | corrida')}</td>
                <td>R$ ${tbr.ts}</td>
                <td>${(tbr.la.map(mp => { return mp.ak || ' -- ' })[0] || 'ESPORTES')}</td>
                <td><span class="text-success">Recebido</span></td>
            </tr>
            `;
    arr.push(tx)
    console.log(arr)
    arr.map(ht => {
        $('#bodyTable').html(ht)
    })
}

async function response(params, id, dataGet) {
    if (params.response.url.includes('placebet') == true || params.response.url.includes('closebet') == true) {
        debuggerFrame(params, id, dataGet).then(rest => {
            console.log(rest);
            ws.emit('ext', rest);
            moduleTable(rest)
        }).catch(e => {
            console.log(e)
        })
    }
}

chrome.debugger.sendCommand({
    tabId: tabId
}, 'Network.enable');
var getData = {};
chrome.debugger.onEvent.addListener((debuggeeId, message, params) => {
    if (message == 'Network.webSocketFrameReceived') {
        ws.emit('frame-socket', params)
    }
    if (message == 'Network.requestWillBeSent') {
        getData = params
    }
    if (message == 'Network.responseReceived') {
        response(params, debuggeeId.tabId, getData);
    }
})
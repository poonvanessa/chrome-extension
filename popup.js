// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let page = document.getElementById('buttonDiv');

const kButtons = [
    {
        'text': 'Login as rpat03',
        'name': 'loginRpat03Local',
        'class': 'btn btn-warning block',
    },
    {
        'text': 'Check Lunch',
        'name': 'checkMenu',
        'class': 'btn btn-warning block',
    },
    {
      'text': 'Clear Cookies',
      'name': 'clearCookies',
      'class': 'btn btn-warning block',
    }
]
const rapMenuUrl = 'https://officerakuten.sharepoint.com/sites/GlobalPortal/SitePages/top.aspx';  // todo
const setBetUserUrl = 'https://local.bet.keiba.rakuten.co.jp/sample/samples/login'; // todo
const cookieName = 'Rz'; // todo
var redirectUrl = '';

function constructOptions(kButtons) {
    for (let item of kButtons) {
        let button = document.createElement('button');
        button.textContent = item.text;
        button.name = item.name;
        button.className = item.class;
        button.addEventListener('click', function () {
            switch (button.name) {
                case 'clearCookies':
                    clearCookies();
                    break;
                case 'checkMenu':
                    checkMenu();
                    break;
                default:
                    console.log('no such button');
                    break;
            }

        });
        page.appendChild(button);
    }
}

constructOptions(kButtons);

function loginRpat03Local() {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        var tab = tabs[0];
        var url = new URL(tab.url);
        // redirectUrl = url;
        redirectUrl = 'https://local.my.keiba.rakuten.co.jp/contribute/premium_exchange';

        chrome.tabs.executeScript(
            tab[0],
            {
                code: 'performance.getEntriesByType("resource").map(e => e.name)',
            }, data => {
                if (chrome.runtime.lastError || !data || !data[0]) return;
                const urls = data[0].map(url => url.split(/[#?]/)[0]);
                const uniqueUrls = [...new Set(urls).values()].filter(Boolean);
                Promise.all(
                    uniqueUrls.map(url =>
                        new Promise(resolve => {
                            chrome.cookies.getAll({url}, resolve);
                        })
                    )
                ).then(results => {
                    // convert the array of arrays into a deduplicated flat array of cookies
                    const cookies = [
                        ...new Map(
                            [].concat(...results)
                                .map(c => [JSON.stringify(c), c])
                        ).values()
                    ];

                    // do something with the cookies here
                    cookies.forEach(function (cookie) {
                        if (cookie.name === cookieName) {
                            chrome.cookies.remove({url: url.toString(), name: cookie.name});
                            // console.log(cookie, url.toString());
                        }
                    })
                    // console.log(uniqueUrls, cookies);
                });
            });

        chrome.tabs.executeScript(
            {code: 'window.location.href = "' + setBetUserUrl + '";'}
            // {code: 'window.location.href = "' + setBetUserUrl + '"; window.location.href = "' + redirectUrl + '";'}
        );
    });
}

function checkMenu() {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            {code: 'window.location.href = "' + rapMenuUrl + '";'}
        );
    });
}
function clearCookies() {
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    var tab = tabs[0];
    var url = new URL(tab.url);

    chrome.tabs.executeScript(
        tab[0],
        {
            code: 'performance.getEntriesByType("resource").map(e => e.name)',
        }, data => {
            if (chrome.runtime.lastError || !data || !data[0]) return;
            const urls = data[0].map(url => url.split(/[#?]/)[0]);
            const uniqueUrls = [...new Set(urls).values()].filter(Boolean);
            Promise.all(
                uniqueUrls.map(url =>
                    new Promise(resolve => {
                        chrome.cookies.getAll({url}, resolve);
                    })
                )
            ).then(results => {
                // convert the array of arrays into a deduplicated flat array of cookies
                const cookies = [
                    ...new Map(
                        [].concat(...results)
                            .map(c => [JSON.stringify(c), c])
                    ).values()
                ];

                // do something with the cookies here
                cookies.forEach(function (cookie) {
                    chrome.cookies.remove({url: url.toString(), name: cookie.name});
                })
                // console.log(uniqueUrls, cookies);
            });
        });
});
}
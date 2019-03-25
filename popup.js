// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let page = document.getElementById('buttonDiv');

const kButtons = [
  {
    'text' : 'Login on Local',
    'name' : 'clearCookies',
    'class' : 'btn btn-info block',
  },
  {
    'text' : 'Check Lunch',
    'name' : 'checkDinner',
    'class' : 'btn btn-info block',
  }
]
const rapMenuUrl = 'https://getbootstrap.com/docs/4.0/layout/grid/';  // todo
const setBetUserUrl = 'https://www.google.com'; // todo
const cookieName = '_ga'; // todo
var redirectUrl = '';

function constructOptions(kButtons) {
  for (let item of kButtons) {
    let button = document.createElement('button');
    button.textContent = item.text;
    button.name = item.name;
    button.className  = item.class;
    button.addEventListener('click', function() {
      switch (button.name) 
      {
        case 'clearCookies':
          clearCookies();
          break;
        case 'checkDinner':
          checkDinner();
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

function clearCookies() 
{
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var tab = tabs[0];
    var url = new URL(tab.url);
    redirectUrl = url;
    
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
              chrome.cookies.remove({url:url.toString(), name:cookie.name});
              // console.log(cookie, url.toString());
            }
          })
          // console.log(uniqueUrls, cookies);
        });
      });   

    chrome.tabs.executeScript({
      code: 'window.location.href = "' + setBetUserUrl + '"; window.location.href = "' + redirectUrl + '";'
    });
  });
}

function checkDinner() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var tab = tabs[0];
    var url = new URL(tab.url);
    redirectUrl = url;
    
    chrome.tabs.executeScript(
      tab[0],
      {code: 'window.location.href = "' + rapMenuUrl + '";'}
    );
  });
}
// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let page = document.getElementById('buttonDiv');

const kButtonColors = [document.body.style.backgroundColor, '#3aa757', '#e8453c', '#f9bb2d', '#4688f1'];
const kButtons = [
  {
    'text' : 'Clear Cookies',
    'name' : 'clearCookies',
  },
  {
    'text' : 'Home page',
    'name' : 'goHome',
  }
]
const redirectUrl = 'https://www.google.com';

function constructOptions(kButtons) {
  for (let item of kButtons) {
    let button = document.createElement('button');
    button.textContent = item.text;
    button.name = item.name;
    button.addEventListener('click', function() {
      
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var tab = tabs[0];
        var url = new URL(tab.url);
        var domain = url.hostname;

        chrome.cookies.getAll({domain: domain}, function (cookies){
          for(var i=0;i<cookies.length;i++){
            // console.log('url: '+ url, 'name: ' + cookies[i].name);
            chrome.cookies.remove({url:url.toString(), name:cookies[i].name});
          }
        });

        chrome.tabs.executeScript(
            tabs[0].id,
            {code: 'window.location.href = "' + redirectUrl + '";'}
          );
      });
    });
    page.appendChild(button);
  }
}

constructOptions(kButtons);

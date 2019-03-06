// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let page = document.getElementById('buttonDiv');

const kButtonColors = [document.body.style.backgroundColor, '#3aa757', '#e8453c', '#f9bb2d', '#4688f1'];
const kButtons = [
  {
    'text': 'Clear Cookies',
    'color': '#3aa757',
    'action': 'clearCookies()',
    'name': 'byeCookies',
  },
  // {
  //   'text': 'Bet rpat03',
  //   'color': '#e8453c',
  // },
  // {
  //   'text': 'Check Lunch Menu',
  //   'color': '#f9bb2d',
  // },
  // {
  //   'text': 'Clear Cookies',
  //   'color': '#4688f1',
  // }
]
function constructOptions(kButtons) {
  for (let item of kButtons) {
    let button = document.createElement('button');
    button.style.backgroundColor = item.color;
    button.text = item.text;
    button.name = item.name
    button.addEventListener('click', function() {
       chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            // {code: 'alert("'+button.text+'");'});  // ok
            {code: 'clearCookies();'});               // failed -,-
      });
    });
    page.appendChild(button);
  }
}

constructOptions(kButtons);

function clearCookies() {
  alert('hello');
  var cookies = document.cookie.split(";");

  for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }

  alert('You have no cookie now :D');
}

function checkLunch() {
  window.location.href = 'https://officerakuten.sharepoint.com/sites/GlobalPortal/SitePages/top.aspx';
}
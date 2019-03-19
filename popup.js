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
    'action': 'clearCookies',
    'name': 'byeCookies',
  },
  {
    'text': 'Greeting!',
    'color': '#e8453c',
    'action': 'sayHi',
    'name': 'greeting',
  },
  // {
  //   'text': 'Check Lunch Menu',
  //   'color': '#f9bb2d',
  // },
  {
    'text': 'Bake a new Cookie',
    'color': '#4688f1',
    'action': 'setCookie',
    'name': 'add cookies',
  }
]
const cookieName = 'taste';

function constructOptions(kButtons) {
  for (let item of kButtons) {
    let button = document.createElement('button');
    button.style.backgroundColor = item.color;
    button.text = item.text;
    button.name = item.name;
    button.addEventListener('click', function() {
       chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            // {code: 'alert("'+item.text+'");'});  // ok
            {code: 'var x = "' + item.action + '"; x'}, // taking x as arguments of the function call back
            function(functionName){   // todo: make it dynamic upon functions
              // console.log(functionName);  // -> ["clearCookies"] 
              
              switch(functionName[0]) {
                case 'clearCookies':
                  clearCookies();
                  break;
                case 'sayHi':
                  sayHi();
                  break;
                case 'setCookie': 
                  setCookie(cookieName, 'chocolate', 30); // the cookies is set but didn't show it in the console
                  break;
                default:
                  console.log('no such function, ' + functionName);
              }
            }
          );
      });
    });
    page.appendChild(button);
  }
}

constructOptions(kButtons);

function clearCookies() {
  var cookies = document.cookie.split(";");

  for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }

  console.log('You have no cookie now :D');
}

function checkLunch() {
  window.location.href = 'https://officerakuten.sharepoint.com/sites/GlobalPortal/SitePages/top.aspx';
}

function sayHi() {
  var cookie = getCookie(cookieName);
  alert('Hello World ' + cookie + '!');
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

// function checkCookie() {
//   var user = getCookie("username");
//   if (user != "") {
//     alert("Welcome again " + user);
//   } else {
//     user = prompt("Please enter your name:", "");
//     if (user != "" && user != null) {
//       setCookie("username", user, 365);
//     }
//   }
// }
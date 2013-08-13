/*
  This file is part of You Should Probably.
  Distributed under the terms of the MIT License.
  See README.md for more information.
*/


var pageMod = require('sdk/page-mod');
var self = require('sdk/self');
var simpleStorage = require('sdk/simple-storage');
var panel = require('sdk/panel');
var widget = require('sdk/widget');


if (!simpleStorage.storage.messages) {
  simpleStorage.storage.messages = [
    'You should probably read a book right now.',
    'You should probably go back to work.',
    'You should probably go outside and take a walk.',
    'You should probably clean your house right now.'
  ];
}


if (!simpleStorage.storage.websites) {
  simpleStorage.storage.websites = [
    '*.reddit.com',
    '*.news.ycombinator.com'
  ];
}


var messageMod = pageMod.PageMod({
  include: simpleStorage.storage.websites,
  contentScriptFile: self.data.url('content_script.js'),
  contentStyleFile: self.data.url('content_style.css'),
  contentScriptWhen: 'ready',
  onAttach: function(worker) {
    worker.port.on('wantMessage', function() {
      var messages = simpleStorage.storage.messages;
      var message = messages[Math.floor(Math.random() * messages.length)];
      worker.port.emit('haveMessage', message);
    });
  }
});


var prefsPanel = panel.Panel({
  width: 380,
  height: 400,
  contentURL: self.data.url('preferences.html'),
  contentScriptFile: self.data.url('preferences.js'),
  contentStyleFile: self.data.url('preferences.css')
});


var prefsWidget = widget.Widget({
  label: 'You Should Probably Preferences',
  id: 'ysp-preferences',
  contentURL: self.data.url('clock_32x32.png'),
  panel: prefsPanel
});


prefsPanel.on('show', function() {
  prefsPanel.port.emit('show', {
    messages: simpleStorage.storage.messages,
    websites: simpleStorage.storage.websites
  });
});


prefsPanel.port.on('save-prefs', function(prefs) {
  simpleStorage.storage.messages = prefs.messages;
  simpleStorage.storage.websites = prefs.websites;

  // First clear everything.
  var websitesLength = messageMod.include.length;
  for (var i = 0; i < websitesLength; i++) {
    console.log('removing ' + messageMod.include[0]);
    messageMod.include.remove(messageMod.include[0]);
  }

  // Then add it back.
  for (var i = 0; i < prefs.websites.length; i++) {
    messageMod.include.add(prefs.websites[i]);
  }
  
  prefsPanel.hide();
});


prefsPanel.port.on('cancel-prefs', function(prefs) {
  prefsPanel.hide();
});
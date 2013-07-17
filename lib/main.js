var pageMod = require('sdk/page-mod');
var self = require('sdk/self');
var simpleStorage = require('sdk/simple-storage');


if (!simpleStorage.storage.messages) {
  simpleStorage.storage.messages = [
    'You should probably read a book right now.',
    'You should probably go back to work.',
    'You should probably go outside and take a walk.',
    'You should probably clean your house right now.'
  ];
}


pageMod.PageMod({
  include: '*.com',
  contentScriptFile: self.data.url('content_script.js'),
  contentStyleFile: self.data.url('content_style.css'),
  onAttach: function(worker) {
    worker.port.on('wantMessage', function() {
      var messages = simpleStorage.storage.messages;
      var message = messages[Math.floor(Math.random() * messages.length)];
      worker.port.emit('haveMessage', message);
    });
  }
});
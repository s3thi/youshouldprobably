var savePreferences = function(messages, websites) {
  self.port.emit('save-prefs', {
    messages: messages.split('\n'),
    websites: websites.split('\n')
  });
};

self.port.on('show', function(prefs) {
  var messagesArea = document.getElementById('messages');
  var websitesArea = document.getElementById('websites');
  var saveButton = document.getElementById('save');
  var cancelButton = document.getElementById('cancel');

  messagesArea.value = prefs.messages.join('\n');
  websitesArea.value = prefs.websites.join('\n');

  saveButton.addEventListener('click', function() {
    savePreferences(messagesArea.value, websitesArea.value);
  });

  cancelButton.addEventListener('click', function() {
    self.port.emit('cancel-prefs');
  });
});
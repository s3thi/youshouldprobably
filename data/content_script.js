/*
  This file is part of You Should Probably.
  Distributed under the terms of the MIT License.
  See README.md for more information.
*/


(function() {

  function addMessageBox(message) {
    var msgDiv = document.createElement('div');
    msgDiv.id = 'youshouldprobably-msgdiv';
    msgDiv.className += 'youshouldprobably-msgdiv';
    msgDiv.innerHTML = '<div class="youshouldprobably-msg">' + message +
                       '  <span class="youshouldprobably-close" id="youshouldprobably-close">close</span>' +
                       '</div>';

    var body = document.getElementsByTagName('body')[0];
    body.insertBefore(msgDiv, body.childNodes[0]);
  
    var closeBtn = document.getElementById('youshouldprobably-close');
    closeBtn.addEventListener('click', function() {
      msgDiv.style.opacity = 0;

      msgDiv.addEventListener('transitionend', function() {
        msgDiv.style.visibility = 'hidden';
      });
    });
  }

  self.port.on('haveMessage', addMessageBox);
  self.port.emit('wantMessage');
})();
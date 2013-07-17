var pageMod = require('sdk/page-mod');
var self = require('sdk/self');

pageMod.PageMod({
  include: '*.com',
  contentScriptFile: self.data.url('content_script.js'),
  contentStyleFile: self.data.url('content_style.css')
});
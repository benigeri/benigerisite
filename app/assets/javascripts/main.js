$(document).ready(function() {
});

function openDialog(elId) {
  Avgrund.show(elId);
}

function closeDialog() {
  Avgrund.hide();
}

WebFontConfig = { fontdeck: { id: '27778' } };

(function() {
  var wf = document.createElement('script');
  wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
  '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
  wf.type = 'text/javascript';
  wf.async = 'true';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(wf, s);
})();

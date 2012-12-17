var joined = false;
var room = io.connect('/room');
var content = $('#room-content');
room.on('connect', function() {
  $('#room-form').css('display', 'block');
  content.append($('<p>').text('Connected'));
}); 
 
room.on('joined', function(msg) {
  content.append($('<p>').text(msg)
         .append($('<em>').text(' from server')));
});
 
room.on('message', function(msg) {
  content.append($('<p>').text(msg)
         .append($('<em>').text(' from server')));
});
 
$('#room-join').click(function(e) {
  joined = true;
  room.emit('join room', $('#room-select').val());
});
 
$('#room-form').submit(function(e) {
  var textObj = $('#room-text');
  var msg = textObj.val();
  textObj.val('');
  content.append($('<p>').text(msg)
         .append($('<em>').text(' from me')));
  room.emit('fromclient', msg);
});
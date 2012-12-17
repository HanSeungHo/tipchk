$(function() {
	var login = io.connect();

	$('#List').on('click', function() {
		login.emit('getUser');	
		login.on(('broadList', function(user) {
			alert('broad');
	  	$('#pan').append(user);
		}));
	}); 

	login.emit('getUser', function() {
		alert('user list');
		
	}); 

	login.on(('broadList', function(user) {
		alert('broad');
	  $('#pan').append(user);
	}));
	$('#pan').append('123123');
	$('#pan').append('123123');	
	// var room = io.connect('/game');

	// var content = $('#room-content');
	// room.on('connect', function() {
	//   $('#room-form').css('display', 'block');
	//   content.append($('<p>').text('Connected'));
	// }); 
	 
	// room.on('joined', function(msg) {
	//   content.append($('<p>').text(msg)
	//          .append($('<em>').text(' from server')));
	// });
	 
	// room.on('message', function(msg) {
	//   content.append($('<p>').text(msg)
	//          .append($('<em>').text(' from server')));
	// });
	 
	// $('#room-join').click(function(e) {
	//   joined = true;
	//   room.emit('join room', $('#room-select').val());
	// });

	// room.emit('test', '테스트입니다');

	// // room.on('test', function(data) {
	// // 	alert(data);
	// //   $('#pan').append('<p>').text(data);
	// // }); 

	// $('#room-form').submit(function(e) {
	//   var textObj = $('#room-text');
	//   var msg = textObj.val();
	//   textObj.val('');
	//   content.append($('<p>').text(msg)
	//          .append($('<em>').text(' from me')));
	//   room.emit('fromclient', msg);
	// });

	// $('#Login').on('click', function() {
	// 	login.emit('login', $('#name').val());  
	// });

});


	

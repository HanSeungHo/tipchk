$(function() {
	$.mobile.ajaxEnabled=false;
	
	var login = io.connect();

	login.on(('user', function(user) {
		alert('user');
		$('#user').val() = 'poer';  
	})); 

	$('#Login').on('click', function() {
		
		login.emit('login', $('#name').val());  
	});

});

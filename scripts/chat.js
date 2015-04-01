$(document).ready(function() {
		var socket = io.connect();
		var $nameForm = $('#set-name');
		var $nameError = $('#name-error');
		var $nameBox = $('#name');
		var $users = $('#users');
		var $messageForm = $('#send-message');
		var $messageBox = $('#message');
		var $chat = $('#chat');
		
		// Register Username
		$nameForm.submit(function(event) {
				event.preventDefault();
				socket.emit('New User', $nameBox.val(), function(data) {
						if (data) {
								$('#user-name').hide();
								$('#content').show();
						}
						else {
								$nameError.html('This username has already been taken');
						}
				});
				$nameBox.val('');
		});
		
		// Show a list of online users
		socket.on('usernames', function(data) {
				var namesList = '';
				for (var i = 0; i < data.length; i++) {
						namesList += data[i] + '<br/>'
				}
				$users.html(namesList);
		});
		
		// Send message to server
		$messageForm.submit(function(event) {
				event.preventDefault();
				socket.emit('Send Message', $messageBox.val());
				$messageBox.val('');
		});
		
		//Receive message in browser
		socket.on('New Message', function(data) {
				$chat.append('<b>' + data.username + ': </b>' + data.message + "<br/>");
		});
});
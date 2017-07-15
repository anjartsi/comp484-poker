var socket = io();

$(document).ready(function() {
	let pName = sessionStorage.getItem("playerName");

	$("#logOutBtn").click(function() {
		sessionStorage.clear();
		if(pName != "") {
			socket.emit('logout', {playerName: pName});
		}
		location.reload();
	}); // End logoutBtn.click()
	
	socket.on('hello', function() {
		socket.emit('login', {playerName: pName});
	})


 


}); // End document.ready()





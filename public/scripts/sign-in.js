$(document).ready(function() {
	// If no player has signed in, show the form
	$("#loginBtn").click(function() {
		let name = $("#playerName").val();
		if(name != "") {
			sessionStorage.setItem('playerName', name);
		}
	}); // End loginBtn.click()

	
})
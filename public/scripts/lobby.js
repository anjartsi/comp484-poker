$(document).ready(function() {

	let pName = sessionStorage.getItem("playerName");

	setChairLocations();
	$(window).resize(setChairLocations);

	// listen for fromServer message
	socket.on('fromServer', function(data) {
		if(data.message) {console.log(data.message);}
		if(data.lobbyArr) {
			writeLobbyUsers(data.lobbyArr);
			checkChairs(data.openChairs);
		}
	});

	socket.on("youCanSit", function(data) {
		console.log('sit on the ' + data.chair + ' chair');
		window.location.replace('/table');
	})



	// Button listeners for north/south/east/west chair
	$("#northChairBtn").click(function() {
		socket.emit('canIsit', {playerName: pName, chair: "north"})
	})
	$("#southChairBtn").click(function() {
		socket.emit('canIsit', {playerName: pName, chair: "south"})
	})
	$("#eastChairBtn").click(function() {
		socket.emit('canIsit', {playerName: pName, chair: "east"})
	})
	$("#westChairBtn").click(function() {
		socket.emit('canIsit', {playerName: pName, chair: "west"})
	})


});



function setChairLocations() {
	let table, btn, wt, wb, ht, hb;

	table = $("#table");
	table.parent().css("padding", "0px")

	wt = parseInt(table.css("width"));
	ht = 0.6 * wt;
	table.css("height", ht+"px");

	btn = $(".sitDownBtn");
	wb = parseInt(btn.css("width"));
	hb = parseInt(btn.css("height"));

	$("#northChairBtn").css("left", ((wt - wb) / 2) + "px" )
	$("#southChairBtn").css("left", ((wt - wb) / 2) + "px" )
	$("#eastChairBtn").css("left", (wt - wb) + "px" )

	$("#southChairBtn").css("top", (ht - hb) + "px")
	$("#eastChairBtn").css("top", ((ht - hb) / 2) + "px")
	$("#westChairBtn").css("top", ((ht - hb) / 2) + "px")
}

function writeLobbyUsers(arr) {
	$("#lobbyList").empty();
	for(let i = 0; i < arr.length; i++) {
		$("#lobbyList").append('<li>' + arr[i] + '</li>');
	}
}


function checkChairs(chairs) {
	if (chairs.north) $("#northChairBtn").removeClass('hidden');
	else $("#northChairBtn").addClass('hidden');

	if(chairs.south) $("#southChairBtn").removeClass('hidden');
	else $("#southChairBtn").addClass('hidden');

	if(chairs.east) $("#eastChairBtn").removeClass('hidden');
	else $("#eastChairBtn").addClass('hidden');

	if(chairs.west)$("#westChairBtn").removeClass('hidden');
	else $("#westChairBtn").addClass('hidden');

}
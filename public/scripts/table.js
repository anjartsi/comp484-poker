$(document).ready(function() {
	
	let pName = sessionStorage.getItem("playerName");
	var exchangingCards = false;
	var pHand;
	var exchange = [false, false, false, false, false];


	setHandLocations();
	$(window).resize(setHandLocations);


	$("#standUpBtn").click(function() {
		sessionStorage.clear();
		if(pName != "") {
			socket.emit('standup');
		}
		location.reload();
	}); // End logoutBtn.click()


	socket.emit("satDown", null);

	socket.on("fromTableServer", function(data) {
		if(data.playerCount != null) {
			$("#playerCount").html("" + data.playerCount);
		}
	});

	socket.on("cardDeal1", function(data) {
		pHand = "#" + data.chair + "Player";
		
		// Clicking on the cards highlights them and selects them to be exchanged
		$(pHand + " img").click(function(e) {
			if(exchangingCards){
				$(e.target).toggleClass('highlightCard');
				let index = $(e.target).index();
				exchange[index] = !exchange[index];
			}
		});

		let hand = $(pHand).children();
		for(let i = 0; i < data.cards.length; i++) {
			card = data.cards[i];
			cardImage = hand[i];
			revealCard(card, cardImage);
		}
		exchangingCards = true;

		$("#changeCardsBtn").removeClass('hidden');
		$("#changeCardsBtn").click(function() {
			socket.emit("endRound1", {exchangeCards: exchange});
			$(pHand + " img").removeClass('highlightCard');

		});
	})

	socket.on("cardDeal2", function(data) {
		exchange = [false, false, false, false, false];

		let hand = $(pHand).children();

		for(let i = 0; i < data.cards.length; i++) {
			card = data.cards[i];
			cardImage = hand[i];
			revealCard(card, cardImage);
		}


		$("#changeCardsBtn").html("End Round 2");
		$("#changeCardsBtn").click(function() {
			socket.emit("endRound2", {exchangeCards: exchange});
			$("#changeCardsBtn").addClass('hidden')
			exchangingCards = false;
			$(pHand + " img").removeClass('highlightCard');
		});
	})


	socket.on("yourScore", function(data) {
		$("#score").html(data.score);
	});

}) // End document.ready()

function setHandLocations() {
	let table, hand, tableWidth, handWidth, tableHeight, handHeight;

	table = $("#table");
	table.parent().css("padding", "0px");
	table.parent().parent().css("padding", "0px");

	tableWidth = parseInt(table.css("width"));
	tableHeight = tableWidth * 0.6;
	table.css("height", tableHeight + "px");

	hand = $(".playerHand");
	handWidth = tableWidth / 2;
	handHeight = handWidth * 3 / 2 / 5 ;

	$(".playerHand img").css("width", (handWidth/5)+"px");
	
	// hand.css({"width": handWidth+"px", "height": (handHeight+10)+"px"});
	// handHeight+=10;
	// Player 1 is south
	$("#southPlayer").css("top", (tableHeight - handHeight) + "px");
	$("#southPlayer").css("left", ((tableWidth - handWidth) / 2) + "px" );
	$("#southPlayer").css({"width": handWidth, "height": handHeight});

	// Player 2 is east
	$("#eastPlayer").css("left", ((tableWidth - handHeight)) + "px" )
	$("#eastPlayer").css("top", ((tableHeight - handWidth) / 2) + "px");
	$("#eastPlayer").css({"width": handHeight, "height": handWidth}); 
	$("#eastPlayer img").css("transform", "rotate(270deg)");
	// Player 3 is north
	$("#northPlayer").css("left", ((tableWidth - handWidth) / 2) + "px" );
	$("#northPlayer").css({"width": handWidth, "height": handHeight}); 
	$("#northPlayer img").css("transform", "rotate(180deg)");

	// Player 4 is west
	$("#westPlayer").css("top", ((tableHeight - handWidth) / 2) + "px");
	$("#westPlayer").css({"width": handHeight, "height": handWidth});
	$("#westPlayer img").css("transform", "rotate(90deg)");
	
	// adjust the rotated cards
	let cardHeight = handHeight;
	let cardWidth = handWidth / 5;
	for(let i = 0; i < 5; i++) {
		$($("#westPlayer img")[i]).css("top", -(i + 1) * cardHeight / 4 + "px");
		$($("#westPlayer img")[i]).css("left", cardWidth / 4 + "px");
		$($("#eastPlayer img")[i]).css("top", -(i + 1) * cardHeight / 4 + "px");
		$($("#eastPlayer img")[i]).css("left", cardWidth / 4 + "px");
	}

}


function revealCard(card, cardImage) {
	let cardFileName = "";
	if(card.value < 11) {cardFileName += card.value;}
	else {cardFileName += card.face;}
	cardFileName += "_of_";
	cardFileName += card.suit.name; 
	if(card.value > 10 && card.value < 14) {cardFileName += "2"}
	cardFileName += ".svg";

	cardFileName = cardFileName.toLowerCase();

	$(cardImage).attr("src", "/images/" + cardFileName);

}


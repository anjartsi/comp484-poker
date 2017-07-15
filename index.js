var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express = require('express');
var session = require("express-session")({
    secret: "my-secret",
    resave: true,
    saveUninitialized: true
  });

app.use(session);

// This allows socket.io to use the sessions
var sharedsession = require("express-socket.io-session");
io.use(sharedsession(session));

// I don't think I'm using this
var cookieParser = require('cookie-parser');
app.use(cookieParser());


// I think I used this once to get the player's name in the form
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer(); 
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(upload.array()); // for parsing multipart/form-data

// Helper functions - made by me
var helpers = require('./server-scripts/helper-functions.js');

// Views
app.set('view engine', 'pug');
app.set('views', './views');


// Define public (static) folders
app.use(express.static('public'));
app.use('/images', express.static('public'));
app.use('/scripts', express.static('public'));


// All the routes are handled in routes.js
var routes = require('./routes.js'); 
app.use('/', routes); 


// Poker-Related Variables
var pokerGame = require('./server-scripts/poker/pokerGame.js');

var pg = new pokerGame.PokerGame();

// List of people in the lobby
var lobby = [];
// Whether each of these chairs is avaliable
var openChairs = {"north": true, "south": true, "east":true, "west": true};
var maxScore = -1;
//Whenever someone connects this gets executed
io.on('connection', function(socket) {
	// Mostly lobby logic here --------------------------------------------------

	// join the socket into the room called 'lobby'
	socket.join('lobby'); 
	let pName = socket.handshake.session.playerName;
	
	if (!pName) {
		pName = "Anonymous" + Date.now() % 10000;
		socket.handshake.session.playerName = pName;
		socket.handshake.session.save();
	}

	// Upon making the socket connection, send a hello message
	socket.emit('hello');
	helpers.printMsg('Socket connected');


	socket.on('login', function(data) {
		let msg = helpers.prepareMsg(pName + " has signed in.");
		console.log(msg);

		// If the player's name is unique, add them to the lobby
		helpers.addToArr(lobby, pName);

		io.sockets.in('lobby').emit('fromServer', {
			"message": msg, 
			"lobbyArr": lobby, 
			"openChairs": openChairs});

	}); // End socket.on(login)


	socket.on('canIsit', function(data) {
		// If the chair is open
		if(openChairs[data.chair]) {
			// Close the chair
			openChairs[data.chair] = false;
			socket.handshake.session.chair = data.chair;
			socket.handshake.session.save();
			// Respond with a yes
			socket.emit("youCanSit", {"chair": data.chair});
			let msg = helpers.prepareMsg(data.playerName + " has been seated.");

			// Tell all users what has happened
			io.sockets.in('lobby').emit('fromServer', {
				"message": msg, 
				"lobbyArr": lobby, 
				"openChairs": openChairs});
		}
	});


	// When a player stands up
	socket.on('standup', function(data) {
		let chr = socket.handshake.session.chair;
		let msg = helpers.prepareMsg(pName + " has stood up from the " + chr + " chair");
		console.log(msg);

		// Their chair is available
		if(chr) {
			openChairs[chr] = true;
		}

		// Remove them from the poker game
		pg.removePlayer(pName);
		io.sockets.in('lobby').emit('fromTableServer', {"playerCount": pg.numPlayers});

		socket.handshake.session.chair = undefined;
		socket.handshake.session.save();
		io.sockets.in('lobby').emit('fromServer', {
			"message": msg,
			"lobbyArr": lobby, 
			"openChairs": openChairs
		});
	})

	// When a player logs out
	socket.on('logout', function(data) {
		let msg = helpers.prepareMsg(pName + " has signed out.");
		console.log(msg);
		let chr = socket.handshake.session.chair;
		
		// Their chair is available
		if(chr) {
			openChairs[chr] = true;
		}

		socket.handshake.session.playerName = undefined;
		socket.handshake.session.chair = undefined;
		socket.handshake.session.save();

		// Remove their name from the lobby
		helpers.removeFromArr(lobby, pName);

		// Remove them from the poker game
		pg.removePlayer(pName);
		io.sockets.in('lobby').emit('fromTableServer', {"playerCount": pg.numPlayers});

		io.sockets.in('lobby').emit('fromServer', {
			"message": msg, 
			"lobbyArr": lobby, 
			"openChairs": openChairs
		});

	}); // End socket.on(logout)

	// Ideally, I would have liked to do the same thing here as in 
	// 'logout' and 'standup' but this method gets called any time
	// the client window refreshes or the client is routed to anothe page

	socket.on('disconnect', function() {
		let msg = socket.handshake.session.playerName + ' has disconnected';

		helpers.removeFromArr(lobby, pName);
		helpers.printMsg(msg);
		io.sockets.in('lobby').emit('fromServer', {
			"message": msg, 
			"lobbyArr": lobby, 
			"openChairs": openChairs
		});
	})



	// Game-related logic below this line ---------------------------

	socket.on('satDown', function() {
		pg.addPlayer(pName);
		helpers.printMsg("Number of Players - " + pg.numPlayers + " " + pName);
		
		socket.emit('fromTableServer', {
			"playerCount": pg.numPlayers
		});

		if(pg.numPlayers > 1) {
			newRound(socket, pg, pName, 1);
		}
	})

	socket.on('endRound1', function(data) {
		// Exchange the cards the player asked for 
		for(let i = 0; i < data.exchangeCards.length; i++) {
			if(data.exchangeCards[i]) {
				pg.deck.cardsInDeck.push(pg.players[pName].hand[i]);
				pg.deck.shuffle();
				pg.players[pName].hand[i] = pg.deck.drawCard();
			}
		}
		pg.exchangeRounds = 1;
		newRound(socket, pg, pName, 2);
	})

	socket.on('endRound2', function(data) {
		// Exchange the cards the player asked for 
		for(let i = 0; i < data.exchangeCards.length; i++) {
			if(data.exchangeCards[i]) {
				pg.deck.cardsInDeck.push(pg.players[pName].hand[i]);
				pg.deck.shuffle();
				pg.players[pName].hand[i] = pg.deck.drawCard();
			}
		}
		let scr = pg.handStrength(pName);
		if(scr > maxScore) {maxScore = scr; console.log(maxScore);}
		socket.emit("yourScore", {"score": scr});
	})


});


http.listen(3000, function(){
  console.log('listening on *:3000');
});

function newRound(socket, pg, pName, round) {
	pg.dealHand();
	socket.emit("cardDeal"+round, {
		"cards": pg.players[pName].hand, 
		"chair": socket.handshake.session.chair
	});
	io.sockets.in("lobby").emit('fromTableServer', {
		"playerCount": pg.numPlayers
	});
}
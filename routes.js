var express = require('express');
var router = express.Router();


// (upload.array()); // for parsing multipart/form-data

// Helper functions - by me
var helpers = require('./server-scripts/helper-functions.js');

// Helper functions - by me
var helpers = require('./server-scripts/helper-functions.js');


router.post('/', function(req, res) {
	let pName = req.body.playerName;
	// If the playerName field  was filled in
	if(!pName || pName == "") {
		pName = "Anonymous" 
	}

	// Add 4 pseudorandom digits to their name
	pName += "" + (Date.now() % 10000);

	// save their name to the session
	req.session.playerName = pName;

	// send them to the lobby
	res.redirect('lobby');
});

router.get('/', function(req, res) {
	req.session.playerName = undefined;
	res.render('sign-in.pug');
});


router.get('/lobby', function(req, res) {
	let pName = req.session.playerName;
	// If they haven't signed in, send them back to the lobby
	if (!pName) {
		res.redirect('/');
	}
	else {
		res.render('lobby.pug', {"pName": pName});
	}
})

router.get('/table/', function(req, res) {
	let pName = req.session.playerName;
	let chair = req.session.chair;
	if(!pName) {
		res.redirect('/');
	}
	else if(!chair) {
		res.redirect('/lobby');
	}
	else {
		res.render('table.pug', {"pName": pName, "chair": chair});
	}
})

router.all('*', function(req, res) {
	res.send('Sorry, this is an invalid url')
})


module.exports = router;
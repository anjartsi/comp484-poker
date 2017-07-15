var deck = require('./deck.js');
var card = require('./card.js');
var player = require('./player.js');
var helpers = require('../helper-functions.js');

class PokerGame {
	constructor() {
		this.numPlayers = 0;
		this.players = [];
		this.deck = new deck.Deck();
		this.exchangeRounds = 2;
		this.deck.shuffle();
	}

	addPlayer(name) {
		let success = false;
		if(!this.players[name]) {
			let p = new player.Player(name);
			this.players[name] = p;
			this.numPlayers++;	
			success = true;
		}
		return success;
	}

	removePlayer(name) {
		let success = false;
		if(this.players[name]) {
			this.players[name] = undefined;
			delete this.players[name];
			this.numPlayers--;
			success = true;
		}
		if(this.numPlayers < 0) {
			this.numPlayers = 0;
		}
		return success;
	}

	dealHand(){
		this.deck.shuffle();
		this.exchangeRounds = 2;
		for (let i = 0; i < 5; i++) {
			for (let key in this.players) {

				this.players[key].takeCard(this.deck.drawCard());
			}
		}
	}

	findWinner() {
		let max = -1;
		let winner;
		for(let p in this.players) {
			if(this.handStrength(p) > max) {
				max = this.handStrength(p);
				winner = p
			}
		}
		return winner;
	}

	handStrength(pName) {
		let strength = 0;
		let flush, straight;
		let hand = this.players[pName].hand;
		let suits = [];
		let values = [];
		for(let i = 0; i < 5; i++) {
			suits.push(hand[i].suit.name);
			values.push(hand[i].value);
		}
		values = values.sort(function(a, b) {return a - b})

		// check for pair
		if(values[1] == values[0] || values[1] == values[2] || values[2] == values[3] || values[3] == values[4]) {
			strength = 1;
		}

		// Check for 2 pair
		if(values[0] == values[1]) {
			if(values[2] == values[3] || values[3] == values[4]) {
				strength = 2;
			}
		}
		else if(values[1] == values[2] && values[3] == values[4]) {
			strength = 2;
		}

		// Check for 3 of a kind
		if(values[2] == values[0] || values[2] == values[4] || values[1] == values[3]) {
			strength = 3
		}

		// Check for a straight 
		straight = true;
		for(let i = 5; i > 1; i--) {
			if(values[i] != values[i-1] + 1) {straight = false}
		}
		if(straight) {strength = 4}
		// Check for flush
		if(suits[0] == suits[1] == suits[2] == suits[3] == suits[4]) {
			strength = 5;
		}

		// Check for a full house
		if(values[0] == values[1] && values[3] == values[4]) {
			if(values[0] == values[2] || values[4] == values[2]) {
				strength = 6;
			}
		}

		// Check for 4 of a kind
		if(values[1] == values[2] == values[3]) {
			if(values[1] == values[0] || values[1] == values[4]) {
				strength = 7;
			}
		}

		// Check for a straight flush
		if(flush && straight) {
			strength = 8;
		}

		// Check for a royal flush
		if(flush && straight && values[4] == 14) {
			strength = 9;
		}

		return strength;
	}



}


module.exports.PokerGame = PokerGame;
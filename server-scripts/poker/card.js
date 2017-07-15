var sf = require('./suitface.js');

// var allSuits = ["Spades", "Hearts", "Clubs", "Diamonds"];
class Card {
	constructor(suitIndex, value) {
		this.suit = sf.Suit.fromInt(suitIndex);
		this.value = value;
		this.face = sf.faces[value];
	}

	display() {
		console.log(this.face + " of " + this.suit.name);
	}	

}


module.exports.Card = Card;
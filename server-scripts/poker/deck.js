var sf = require('./suitface.js');
var card = require('./card.js');

class Deck {
	constructor() {
		this.allCards = [];
		this.cardsInDeck = [];
		this.cardsOutOfDeck = [];

		this.next = 0;
		
		// For each suit
		for(let i = 0; i < sf.Suit.numberOfSuits; i++) {
			// For each value (2 - Ace)
			for(let val in sf.faces) {
				// put a new card in the deck
				this.allCards.push(new card.Card(i, val));
			} // End for(val)
		} // End for(i)

		this.cardsInDeck = this.allCards.slice(0);
	}
	
	shuffle() {
		this.cardsInDeck.sort(function(a, b){
			return Math.random() - 0.5
		});
	}

	// Better Shuffle function (stolen from: https://www.frankmitchell.org/2015/01/fisher-yates/)
	// shuffle () {
	// 	let j, temp;

	// 	for (let i = 0; i < this.cardsInDeck.length; i++) {
	// 		j = Math.floor(Math.random() * (i + 1))
	// 		temp = this.cardsInDeck[i]
	// 		this.cardsInDeck[i] = this.cardsInDeck[j]
	// 		this.cardsInDeck[j] = temp
	// 	}
	// }

	// Reorder all the cards
	reset() {
		this.cardsInDeck = this.allCards.slice(0);
		this.cardsOutOfDeck = [];
	}

	drawCard() {
		let topCard = this.cardsInDeck.shift();
		this.cardsOutOfDeck.push(topCard);
		return topCard;
	}
}

module.exports.Deck = Deck;
var card = require('./card.js');

class Player {
	constructor(name) {
		this.name = name;
		this.score = 0;
		this.cash = 1000;
		this.hand = [];
		this.chair = ""
	}

	winHand(pot) {
		this.cash += pot;
	}

	placeBet(amount) {
		if(this.cash >= amount) {
			this.cash -= amount;
		}
	}

	takeCard(card) {
		this.hand.push(card);
	}

	showHand() {
		for(let i = 0; i < this.hand.length; i++) {
			this.hand[i].display();
		}
	}

	clearHand() {
		this.hand = [];
	}

}


module.exports.Player = Player;
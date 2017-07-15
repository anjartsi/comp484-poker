class Suit {
	constructor(name) {
		this.name = name;

		if(name == "Spades" || name == "Clubs") {
			this.col = "black";
		}
		else if(name == "Hearts" || name == "Diamonds") {
			this.col = "red";
		}
		else this.col = "yellow";
	}

	static get numberOfSuits() {
		return 4;
	}

	static fromInt(i) {
		switch (i) {
			case 0:
			return new Suit("Spades");
			break;

			case 1:
			return new Suit("Hearts");
			break;

			case 2:
			return new Suit("Clubs");
			break

			case 3:
			return new Suit("Diamonds");
			break

			default:
			return new Suit("Joker");

		}
	}
}

var faces = {
	 14 : "Ace",
	 13 : "King",
	 12 : "Queen",
	 11 : "Jack",
	 10 : "Ten",
	 9  : "Nine",
	 8  : "Eight",
	 7  : "Seven",
	 6  : "Six",
	 5  : "Five",
	 4  : "Four",
	 3  : "Three",
	 2  : "Two"
}

module.exports.faces = faces;

module.exports.Suit = Suit;
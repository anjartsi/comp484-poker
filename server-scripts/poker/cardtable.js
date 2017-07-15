var card = require('./card.js');

class CardTable {
	constructor(canvas){
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d"); 
		this.canvasHeight = canvas.width;
		this.canvasWidth = canvas.height;

		this.allThings = [];
		this.controlPanel = [];
				
	}

	addCard(card) {
		this.allThings.push(card);
	}

	drawEverything() {
		this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
		for(let i = 0; i < this.allThings.length; i++) {
			this.allThings[i].draw(this.ctx);
		}
	}
}

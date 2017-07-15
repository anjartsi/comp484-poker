let d = new Deck();

let t = new CardTable(document.getElementById('myCanvas'));

let c1 = new Card(0, 3);
let c2 = new Card(1, 4);
t.addCard(c1);
t.addCard(c2);

t.drawEverything();
d.shuffle();

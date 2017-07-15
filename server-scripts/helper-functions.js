function prepareMsg(msg) {
	let t = new Date();

	str = ""
	if(t.getHours < 10) {str+= "0";}
	str += t.getHours();
	str += ":";
	if(t.getMinutes < 10) {str+= "0";}
	str += t.getMinutes();
	str += ":";
	if(t.getSeconds < 10) {str+= "0";}
	str += t.getSeconds();
	str += " -- ";
	
	str += msg;
	return str;
}

// Like console.log, but better
function printMsg(msg) {
	console.log(prepareMsg(msg));
}


function addToArr(arr, item) {
	let exists = false;
	for(let i = 0; i < arr.length; i++) {
		if(arr[i] == item) {exists = true;}
	}
	if(!exists) {arr.push(item);};
}

function removeFromArr(arr, item) {
	let index = -1;
	for(let i = 0; i < arr.length; i++) {
		if(arr[i] == item) {index = i}
	}
	arr.splice(index, 1);
	return index > -1;
}

module.exports.prepareMsg = prepareMsg;
module.exports.printMsg = printMsg;
module.exports.addToArr = addToArr;
module.exports.removeFromArr = removeFromArr;
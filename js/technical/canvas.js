var canvas;
var ctx;

window.addEventListener("resize", (_=>resizeCanvas()));

function retrieveCanvasData() {
	let treeCanv = document.getElementById("treeCanvas")
	let treeTab = document.getElementById("treeTab")
	if (treeCanv===undefined||treeCanv===null) return false;
	canvas = treeCanv;
	ctx = canvas.getContext("2d");
	return true;
}

function resizeCanvas() {
	if (!retrieveCanvasData()) return
	canvas.width = 0;
    canvas.height = 0;
	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight;
		drawTree();
}


var colors_theme

function drawTree() {
	if (!retrieveCanvasData()) return;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (layer in layers){
		if (tmp[layer].layerShown == true && tmp[layer].branches){
			for (branch in tmp[layer].branches)
				{
					drawTreeBranch(layer, tmp[layer].branches[branch])
				}
		}
		drawComponentBranches(layer, tmp[layer].upgrades, "upgrade-")
		drawComponentBranches(layer, tmp[layer].buyables, "buyable-")
		drawComponentBranches(layer, tmp[layer].clickables, "clickable-")

	}
}

function drawComponentBranches(layer, data, prefix) {
	for(id in data) {
		if (data[id].branches) {
			for (branch in data[id].branches)
			{
				drawTreeBranch(id, data[id].branches[branch], prefix + layer + "-")
			}

		}
	}

}

function drawTreeBranch(num1, data, prefix) { // taken from Antimatter Dimensions & adjusted slightly
	let num2 = data
	let color_id = 1
	let width = 15
	if (Array.isArray(data)){
		num2 = data[0]
		color_id = data[1]
		width = data[2] || width
	}

	if(typeof(color_id) == "number")
		color_id = colors_theme[color_id]
	if (prefix) {
		num1 = prefix + num1
		num2 = prefix + num2
	}
	if (document.getElementById(num1) == null || document.getElementById(num2) == null)
		return

		let start = document.getElementById(num1).getBoundingClientRect();
		let end = document.getElementById(num2).getBoundingClientRect();
		let x1 = start.left + (start.width / 2) + document.body.scrollLeft;
		let y1 = start.top + (start.height / 2) + document.body.scrollTop;
		let x2 = end.left + (end.width / 2) + document.body.scrollLeft;
		let y2 = end.top + (end.height / 2) + document.body.scrollTop;
		ctx.lineWidth = width;
	    Ketherpath()
		if(player.Hkm.unlocked) Hokmapath()
		ctx.strokeStyle = color_id;
		ctx.lineWidth = width;
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
		ctx.strokeStyle = 'gray';
		for (var i = 0; i <= 6; i++) {
			ctx.beginPath();
			ctx.moveTo((x1+(i/16+0.1*i-player.timePlayed%0.2)*(x2-x1)), (y1+(i/16+0.1*i-player.timePlayed%0.2)*(y2-y1)));
			ctx.lineTo((x1+((i+1)/16+0.1*i-player.timePlayed%0.2)*(x2-x1)), (y1+((i+1)/16+0.1*i-player.timePlayed%0.2)*(y2-y1)));
			ctx.stroke();
			ctx.closePath();
		}
}
function Ketherpath(){
	ctx.lineWidth = '3';
	ctx.strokeStyle = 'white';
	let s1 = document.getElementById('Ktr').getBoundingClientRect();
	let xk = s1.left + (s1.width / 2) + document.body.scrollLeft;
    let yk = s1.top + (s1.height / 2) + document.body.scrollTop;
	ctx.beginPath();
	ctx.moveTo(xk-200, yk);
	ctx.lineTo(xk, yk);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(xk-228,yk-28,5,0,2*Math.PI)
	ctx.moveTo(xk-225, yk-25);
	ctx.lineTo(xk-200, yk);
	ctx.stroke();
	ctx.strokeStyle = 'green';
	ctx.beginPath();
	ctx.moveTo(xk-Number(player.points.add(1).log(10).min(200)), yk);
	ctx.lineTo(xk, yk);
	if(player.points.gte(1e200)){
	    ctx.moveTo(xk-225, yk-25);
		ctx.lineTo(xk-200, yk);
		ctx.arc(xk-228,yk-28,5,0,2*Math.PI)
		ctx.stroke();
	}
	ctx.stroke();
}
function Hokmapath(){
	ctx.lineWidth = '3';
	ctx.strokeStyle = 'grey';
	let s1 = document.getElementById('Hkm').getBoundingClientRect();
	let xk = s1.left + (s1.width / 2) + document.body.scrollLeft;
    let yk = s1.top + (s1.height / 2) + document.body.scrollTop;
	ctx.beginPath();
	ctx.moveTo(xk-200, yk);
	ctx.lineTo(xk, yk);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(xk-228,yk-28,5,0,2*Math.PI)
	ctx.moveTo(xk-225, yk-25);
	ctx.lineTo(xk-200, yk);
	ctx.stroke();
	ctx.strokeStyle = 'green';
	ctx.beginPath();
	ctx.moveTo(xk-Number(n(50).add(player.points.add(1).log(10).sub(200).div(22.5).min(150))), yk);
	ctx.lineTo(xk, yk);
	ctx.stroke();
}
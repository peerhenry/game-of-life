var grid_rows = 45;
var grid_columns = 80;
var dataArray;
var isRunning = false;
const lifeless = "#222";
const alive = "aqua";

var stepTime = 1000;
var updater;

window.onload=function(){
	// init
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext("2d");
	
	initGame();

	// input
	document.addEventListener("keydown", keyPush);
	document.addEventListener("click", function(evt){ mouseClick(canvas, evt) });

	// game loop
	setInterval(function(){ draw(ctx) }, 1000/15);
	updater = setInterval(function(){updateData()}, 1000);
	setButtonText();
}

function setSpeedFactor(){
	var factor = document.getElementById("speed").value;
	if(isNaN(factor)) return;
	clearInterval(updater);
	stepTime = 1000/factor;
	updater = setInterval(function(){updateData()}, stepTime);
	setButtonText();
}

function clearGrid(){
	for(var i = 0; i < grid_rows; i++){
		for(var j = 0; j < grid_columns; j++){
			dataArray[i][j] = {state: lifeless, adjCount: 0};
		}
	}
}

function toggleRunning(){
	isRunning = !isRunning;
	console.log("game is running: " + isRunning);
	setButtonText();
}

function setButtonText(){
	var msg = "Run"
	if(isRunning) msg = "Pause"
	document.getElementById("toggle-button").innerHTML = msg;
}

function initGame(){
	// init data array
	dataArray = new Array(grid_rows);
	for(var i = 0; i<grid_rows; i++){
		dataArray[i] = new Array(grid_columns);
	}
	clearGrid();
}

function updateData(){
	if(!isRunning) return;
	var deaths = [];
	var births = [];
	for(var i = 0; i < grid_rows; i++){
		for(var j = 0; j < grid_columns; j++){
			var nextCell = dataArray[i][j];
			var adjCount = dataArray[i][j].adjCount;
			if(nextCell.state == alive){
				if(adjCount < 2 || adjCount > 3){
					deaths.push([i,j]);
				}
			}
			else{
				if(adjCount == 3) births.push([i,j]);
			}
		}
	}

	for(var b = 0; b<births.length; b++){
		beBorn(births[b][0], births[b][1]);
	}

	for(var d = 0; d<deaths.length; d++){
		die(deaths[d][0], deaths[d][1]);
	}
}

function draw(ctx){
	clear(ctx);
	
    //ctx.font = "30px Arial";
    //ctx.fillStyle = "white";
    //ctx.fillText("Yoyoyoyo", 10, 50);
	
	var cell_size = 20;
	for(var i = 0; i < grid_rows; i++){
		for(var j = 0; j < grid_columns; j++){
			ctx.fillStyle = dataArray[i][j].state;
			ctx.fillRect(j*cell_size+1, i*cell_size + 1, cell_size-2, cell_size-2);
		}
	}
}

function flip(i,j){
	if(dataArray[i][j].state == alive){
		die(i,j);
	}
	else beBorn(i,j);
}

function die(i,j){
	dataArray[i][j].state = lifeless;
	incrAdjacents(i,j,-1);
}

function beBorn(i,j){
	dataArray[i][j].state = alive;
	incrAdjacents(i,j,1);
}

function incrAdjacents(i,j,dLife){
	incrLifeCount(i+1,j+1,dLife);
	incrLifeCount(i+1,j,dLife);
	incrLifeCount(i+1,j-1,dLife);
	incrLifeCount(i,j+1,dLife);
	incrLifeCount(i,j-1,dLife);
	incrLifeCount(i-1,j+1,dLife);
	incrLifeCount(i-1,j,dLife);
	incrLifeCount(i-1,j-1,dLife);
}

function incrLifeCount(ui,uj,dLife){
	var i = iTrunk(ui);
	var j = jTrunk(uj);
	dataArray[i][j].adjCount = trunk(dataArray[i][j].adjCount + dLife);
}

function trunk(n){
	if (n<0) return 0;
	if(n>8) return 8;
	return n;
}

function iTrunk(i){
	return gridTrunk(i, grid_rows);
}

function jTrunk(j){
	return gridTrunk(j, grid_columns);
}

function gridTrunk(n, n_count){
	if(n<0) return gridTrunk(n_count+n, n_count);
	if(n>n_count-1) return gridTrunk(n - n_count, n_count);
	return n;
}

function clear(ctx){
	ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
}

function keyPush(evt){
	// any key
	isRunning = false;
}

function mouseClick(canvas, evt){
	var mousePos = getMousePos(canvas, evt);
	var m_i = Math.floor(mousePos.y/20);
	var m_j = Math.floor(mousePos.x/20);
	if(m_i >= 0 && m_i < grid_rows && m_j >= 0 && m_j < grid_columns){
		flip(m_i, m_j);
	}
	setSpeedFactor();
}

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
	  x: evt.clientX - rect.left,
	  y: evt.clientY - rect.top
	};
  }
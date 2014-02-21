var canvas, ctx;
var width, height;
var sky, land, bird, pipe, pipeUp, pipeDown, scoreBoard, ready, splash;
var dist, birdY, birdF, birdN, birdV;
var animation, death, deathAnim;
var pipes = [], pipeSt, pipeNumber;
var score;

var clearCanvas = function(){
	ctx.fillStyle = '#4EC0CA';
	ctx.fillRect(0, 0, width, height);
}

var loadImages = function(){
	var imgNumber = 9, imgComplete = 0;
	var onImgLoad = function(){
		imgComplete++;
		if(imgComplete == imgNumber){
			death = 1;
			dist = 0;
			birdY = (height - 112) / 2;
			birdF = 0;
			birdN = 0;
			birdV = 0;
			score = 0;
			pipeSt = 0;
			pipeNumber = 10;
			pipes = [];
			for(var i = 0; i < 10; ++i)
				pipes.push(Math.floor(Math.random() * (height - 300) + 10));
			drawCanvas();
		}
	}

	sky = new Image();
	sky.src = 'images/sky.png';
	sky.onload = onImgLoad;
	
	land = new Image();
	land.src = 'images/land.png';
	land.onload = onImgLoad;
	
	bird = new Image();
	bird.src = 'images/bird.png';
	bird.onload = onImgLoad;
	
	pipe = new Image();
	pipe.src = 'images/pipe.png';
	pipe.onload = onImgLoad;
	
	pipeUp = new Image();
	pipeUp.src = 'images/pipe-up.png';
	pipeUp.onload = onImgLoad;
	
	pipeDown = new Image();
	pipeDown.src = 'images/pipe-down.png';
	pipeDown.onload = onImgLoad;
	
	scoreBoard = new Image();
	scoreBoard.src = 'images/scoreBoard.png';
	scoreBoard.onload = onImgLoad;
	
	ready = new Image();
	ready.src = 'images/replay.png';
	ready.onload = onImgLoad;
	
	splash = new Image();
	splash.src = 'images/splash.png';
	splash.onload = onImgLoad;
}

var initCanvas = function(){
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext('2d');
	canvas.width = width = window.innerWidth;
	canvas.height = height = window.innerHeight;
	canvas.onclick = jump;
	window.onkeydown = jump;
	loadImages();
}

var deathAnimation = function(){
	if(splash){
		ctx.drawImage(splash, width / 2 - 94, height / 2 - 54);
		splash = undefined;
	}
	else
		ctx.drawImage(scoreBoard, width / 2 - 118, height / 2 - 54);
	ctx.drawImage(ready, width / 2 - 57, height / 2 + 10);
}

var drawSky = function(){
	var totWidth = 0;
	while(totWidth < width){
		ctx.drawImage(sky, totWidth, height - 221);
		totWidth += sky.width;
	}
}

var drawLand = function(){
	var totWidth = -dist;
	while(totWidth < width){
		ctx.drawImage(land, totWidth, height - 112);
		totWidth += land.width;
	}
	dist = dist + 2;
	if(dist >= width * 0.65 && Math.floor(dist - width * 0.65) % 220 == 0){
		score++;
	}
}

var drawPipe = function(x, y){
	ctx.drawImage(pipe, x, 0, pipe.width, y);
	ctx.drawImage(pipeDown, x, y);
	ctx.drawImage(pipe, x, y + 168, pipe.width, height - 112);
	ctx.drawImage(pipeUp, x, y + 144);
	if(x < width * 0.35 + 34 && x + 52 > width * 0.35 && (birdY < y + 24 || birdY + 24 > y + 144)){
		clearInterval(animation);
		death = 1;
	}
	else if(x + 40 < 0){
		pipeSt++;
		pipeNumber++;
		pipes.push(Math.floor(Math.random() * (height - 300) + 10));
	}
	
}

var drawBird = function(){
//	ctx.translate(width * 0.35 + 17, birdY + 12);
//	var deg = -Math.atan(birdV / 2) / 3.14159;
//	ctx.rotate(deg);
	ctx.drawImage(bird, 0, birdN * 24, bird.width, bird.height / 4, width * 0.35, birdY, bird.width, bird.height / 4);
//	ctx.rotate(-deg);
//	ctx.translate(-width * 0.35 - 17, -birdY - 12);
	birdF = (birdF + 1) % 6;
	if(birdF % 6 == 0)
		birdN = (birdN + 1) % 4;
	birdY -= birdV;
	birdV -= 0.5;
	if(birdY + 138 > height){
		clearInterval(animation);
		death = 1;
	}
	if(death)
		deathAnimation();
}

var drawScore = function(){
	ctx.font = '20px "Press Start 2P"';
	ctx.lineWidth = 5;
    ctx.strokeStyle = '#fff';
	ctx.fillStyle = '#000';
	var txt = "" + score;
	ctx.strokeText(txt, (width - ctx.measureText(txt).width) / 2, height * 0.15);
	ctx.fillText(txt, (width - ctx.measureText(txt).width) / 2, height * 0.15);
}

var drawCanvas = function(){
	clearCanvas();
	drawSky();
	for(var i = pipeSt; i < pipeNumber; ++i)
		drawPipe(width - dist + i * 220, pipes[i]);
	drawLand();
	drawBird();
	drawScore();
}

var anim = function(){
	animation = setInterval(drawCanvas, 1000 / 60);
}

var jump = function(){
	if(death){
		dist = 0;
		birdY = (height - 112) / 2;
		birdF = 0;
		birdN = 0;
		birdV = 0;
		death = 0;
		score = 0;
		pipeSt = 0;
		pipeNumber = 10;
		pipes = [];
		for(var i = 0; i < 10; ++i)
			pipes.push(Math.floor(Math.random() * (height - 300) + 10));
		anim();
	}
	birdV = 8;
}

window.onload = function(){
	initCanvas();
}
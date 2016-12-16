var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
// Start ball at random locations on canvas
var x = random(canvas.width / 4, canvas.width * 3 / 4);
var y = random(canvas.height / 2, canvas.height * 3 / 4);
// Set random initial direction
var dx = (Math.round(Math.random()) * 2 - 1) * 2; // In this case, 2 or -2
var dy = (Math.round(Math.random()) * 2 - 1) * 2;
var ballRadius = 10;
var paddleHeight = 10;
var paddleWidth = 80;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
var ballColor = "#DD0026";
var para = document.querySelector("p");

var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var bricks = [];
var score = 0;
var lives = 3;

for (c = 0; c < brickColumnCount; c++) { // Column as x or horizontal
  bricks[c] = [];
  for (r = 0; r < brickRowCount; r++) { // Row as y or vertical
    bricks[c][r] = {
      x: 0,
      y: 0,
      status: 1
    };
  }
}

function random(min, max) {
  var num = Math.floor(Math.random() * (max - min)) + min;
  return num;
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#004363";
  ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#004363";
  ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function drawBall(color) {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = color; // "#0095DD"
  ctx.fill();
  ctx.closePath();
}

function changeColor() {
  ballColor = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (c = 0; c < brickColumnCount; c++) { // Drawing columns first
    for (r = 0; r < brickRowCount; r++) { // Then the rows
      if (bricks[c][r].status === 1) {
        var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
        var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#DDB700";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function increaseSpeed() {
  if (Math.abs(dx) < 5) {
    if (dx < 0) {
      dx -= 0.25; // increase horizontal speed left
    } else if (dx > 0) {
      dx += 0.25; // increase horizontal speed right
    }
  }
  if (Math.abs(dy) < 5) {
    dy -= 0.25; // increase the vertical speed up
  }
}

function keyDownHandler(e) {
  if (e.keyCode === 37) {
    leftPressed = true;
  } else if (e.keyCode === 39) {
    rightPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode === 37) {
    leftPressed = false;
  } else if (e.keyCode === 39) {
    rightPressed = false;
  }
}

function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > (paddleWidth / 2) && relativeX < canvas.width - (paddleWidth / 2)) {
    paddleX = relativeX - paddleWidth / 2; // setting the left corner position of the paddle, with the mouse x position at relativeX, ie. middle of the paddle
  }
}

function collisionDetection() {
  for (c = 0; c < brickColumnCount; c++) {
    for (r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];
      if (b.status == 1) {
        if (x + ballRadius > b.x && x - ballRadius < b.x + brickWidth && y + ballRadius > b.y && y - ballRadius < b.y + brickHeight) {
          // making the edge of the ball hit the bricks and not the center of the ball
          dy = -dy;
          changeColor();
          b.status = 0;
          score++;
          if (score == brickRowCount * brickColumnCount) {
            alert("YOU WIN, CONGRATULATIONS!");
            document.location.reload();
          }
        }
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawScore();
  drawLives();
  drawBricks();
  drawBall(ballColor);
  drawPaddle();
  collisionDetection();

  if (x - ballRadius < 0 || x + ballRadius > canvas.width) { // Left || Right
    dx = -dx;
    changeColor();
  }

  if (y < ballRadius) { // Top
    dy = -dy;
    changeColor();
  } else if (y + ballRadius > canvas.height - paddleHeight && x > paddleX && x < paddleX + paddleWidth) {
    dy = -dy;
    increaseSpeed();
  } else if (y + ballRadius > canvas.height) { // Bottom
    lives--;
    if (!lives) {
      alert("GAME OVER");
      document.location.reload();
    } else {
      x = random(canvas.width / 4, canvas.width * 3 / 4);
      y = random(canvas.height / 2, canvas.height * 3 / 4);
      paddleX = (canvas.width - paddleWidth) / 2;
    }
  }

  x += dx;
  y += dy;

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 5; // random(5, 10)
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 5;
  }

  requestAnimationFrame(draw);
}

document.addEventListener("keydown", keyDownHandler, false); // target.addEventListener(type, listener[, useCapture]);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

draw();

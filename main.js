var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
// Start ball at random locations on canvas
var x = random(canvas.width / 4, canvas.width * 3 / 4);
var y = random(canvas.height / 2, canvas.height * 3 / 4);
// Set random initial direction
// See http://stackoverflow.com/questions/8611830/javascript-random-positive-or-negative-number
// To set it either 1 or -1
var dx = (Math.round(Math.random()) * 2 - 1) * 2; // In this case, 2 or -2
var dy = (Math.round(Math.random()) * 2 - 1) * 2;
var ballRadius = 10;
var paddleHeight = 10;
var paddleWidth = 80;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
var ballColor = "0095DD";
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

// To get a random floating point number within a certain range, first define the range by 'min' and 'max':
// min + (Math.random() * (max - min))
// See https://answers.yahoo.com/question/index?qid=20101101170531AA5KTeQ
function random(min, max) {
  var num = Math.floor(Math.random() * (max - min)) + min;
  return num;
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
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
        ctx.fillStyle = "#0095DD";
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
    paddleX = relativeX - paddleWidth / 2;
    // setting the left corner position of the paddle, with the mouse x position at relativeX, ie. middle of the paddle
  }
}

function collisionDetection() {
  for (c = 0; c < brickColumnCount; c++) {
    for (r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];
      if (b.status == 1) {
        if (x + ballRadius > b.x && x - ballRadius < b.x + brickWidth && y + ballRadius > b.y && y - ballRadius < b.y + brickHeight) {
          // CHANGE FROM if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          // ie. making the edge of the ball hit the bricks and not the center of the ball
          // May have to change the brickPadding to more than 20 to accommodate the whole ball inbetween bricks (diameter)
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
  // See https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/clearRect
  // The CanvasRenderingContext2D.clearRect() method of the Canvas 2D API sets all pixels in the rectangle defined by starting point (x, y) and size (width, height) to transparent black, erasing any previously drawn content.
  drawBricks();
  drawBall(ballColor);
  drawPaddle();
  collisionDetection();
  drawScore();
  drawLives();

  if (x - ballRadius < 0 || x + ballRadius > canvas.width) { // Left || Right
    // CHANGE FROM if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) { // Left || Right
    // At each redraw of frame, x of the ball is already determined, with an increase in distance dx for the next frame, at the bottom of this function in the previous frame, before it is drawn again with drawBall() just above. Therefore x in this frame is equal to x + dx in the last frame. x is the position of the ball at this moment in time when the code enters this if/else loop. There is no need to add the dx in the if else loop at all.
    // If position of center of ball and the next change in horizontal movement is smaller than the radius of the ball, that means the ball has hit the left side of the canvas. This also means that the ball must have been moving leftwards, ie. dx is -2. Therefore now set dx to be positive and move it rightwards.
    dx = -dx;
    changeColor();
  }

  if (y < ballRadius) { // Top
    // CHANGE FROM if (y + dy < ballRadius) { // Top
    // As explained above for x, there is no need to add dy to the current y
    // Likewise, if the position of the center of the ball and the change in vertical movement is greater than the height of canvas minus the ball radisu, it means that the ball has hit the bottom wall of the canvas, meaning it is moving downwards, ie. dy is positive. Therefore, now set dy to be negative and move it upwards.
    dy = -dy;
    changeColor();
  } else if (y + ballRadius > canvas.height - paddleHeight && x > paddleX && x < paddleX + paddleWidth) {
    // CHANGE FROM } else if ((y + dy > canvas.height - paddleHeight - ballRadius) && x > paddleX && x < paddleX + paddleWidth) {
    // Note: It cannot be x + ballRadius > paddleX or x - ballRadius > paddleX because the lowest point of the ball is also directly vertically below x. It must be the lowest point of the ball touching the paddle.
    // Checks that the x-position of ball is within the length of the paddle, but it still hits the wall, not the paddle.
    // Add check if ball is hitting top of paddle
    dy = -dy;
    increaseSpeed();
    para.innerHTML = "Horizontal speed dx is: " + dx + "<br>Vertical speed dy is now: " + dy;
    // Note para.textContent does not recognise escape characters \n and html tags <br>
  } else if (y + ballRadius > canvas.height) { // Bottom
    // CHANGE FROM } else if (y + dy > canvas.height - ballRadius) { // Bottom
    lives--;
    if (!lives) {
      alert("GAME OVER");
      document.location.reload();
    } else {
      x = random(canvas.width / 4, canvas.width * 3 / 4);
      y = random(canvas.height / 2, canvas.height * 3 / 4);
      // dx = (Math.round(Math.random()) * 2 - 1) * 2;
      // dy = (Math.round(Math.random()) * 2 - 1) * 2;
      // ie. dx and dy will remain at same speed
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

// For the center of the ball to be inside the brick, all four of the following statements need to be true:
// The x position of the ball is greater than the x position of the brick.
// The x position of the ball is less than the x position of the brick plus its width.
// The y position of the ball is greater than the y position of the brick.
// The y position of the ball is less than the y position of the brick plus its height.

document.addEventListener("keydown", keyDownHandler, false); // target.addEventListener(type, listener[, useCapture]);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
// See https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
// useCapture Optional
// A Boolean that indicates that events of this type will be dispatched to the registered listener before being dispatched to any EventTarget beneath it in the DOM tree. Events that are bubbling upward through the tree will not trigger a listener designated to use capture. Event bubbling and capturing are two ways of propagating events that occur in an element that is nested within another element, when both elements have registered a handle for that event. The event propagation mode determines the order in which elements receive the event. See DOM Level 3 Events and JavaScript Event order for a detailed explanation. If not specified, useCapture defaults to false.
// Note: For event listeners attached to the event target; the event is in the target phase, rather than capturing and bubbling phases. Events in the target phase will trigger all listeners on an element regardless of the useCapture parameter.
// Note: useCapture became optional only in more recent versions of the major browsers; for example, it was not optional before Firefox 6. You should provide this parameter for broadest compatibility.

// setInterval(draw, 10);
// Or use window.requestAnimationFrame(); The window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser call a specified function to update an animation before the next repaint. The method takes as an argument a callback to be invoked before the repaint.
draw();

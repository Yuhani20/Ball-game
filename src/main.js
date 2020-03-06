// 设定画布
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// 设定画布长宽
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

//Reference of p
const score = document.querySelector('p');



//      Var--------------

//Initial scorePoint
let scorePoint = 25;




//      function-------------


// 生成随机数的函数
function random(min,max) {
    return Math.floor(Math.random()*(max-min)) + min;
}

// 生成随机颜色的函数
function randomColor() {
    return 'rgb(' +
        random(0, 255) + ', ' +
        random(0, 255) + ', ' +
        random(0, 255) + ')';
}


//Constructor Shape
function Shape(x, y, velX, velY, boolean) {
    this.x=x;
    this.y=y;

    if (velX === 0) {
        velX = 3;
    }
    if (velY === 0) {
        velY = 3;
    }
    this.velX = velX;
    this.velY = velY;

    this.exists = boolean;
}


//Constructor Ball
function Ball(x, y, velX, VelY, boolean, color, size) {
    Shape.call(this, x, y, velX, VelY, boolean);

    this.color = color;
    this.size = size;
}

Ball.prototype = Object.create(Shape.prototype);


//constructor PlayerCircle
function PlayerCircle(x, y, boolean) {
    Shape.call(this, x, y, 20, 20, boolean);

    this.color = '#111';
    this.size = 10;
}

PlayerCircle.prototype = Object.create(Shape.prototype);



//Methods

//Draw player
PlayerCircle.prototype.draw = function() {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
};


//checkBounce player
PlayerCircle.prototype.checkBounce = function() {

    //Make player bounce
    if (this.x > width) {
        this.x = width - this.size;
    }

    if (this.x <= 0) {
        this.x = this.size;
    }

    if (this.y >= height) {
        this.y = height - this.size;
    }

    if (this.y <= 0) {
        this.y = this.size;
    }
};


//Control player
PlayerCircle.prototype.setControl = function() {
    let _this = this;
    window.onkeydown = function(e) {
        if (e.key === 'a') {
            _this.x -= _this.velX;
        } else if (e.key === 'd') {
            _this.x += _this.velX;
        } else if (e.key === 'w') {
            _this.y -= _this.velY;
        } else if (e.key === 's') {
            _this.y += _this.velY;
        }
    }
};


//if collision player
PlayerCircle.prototype.collisionDetect = function() {

    for (let i = 0; i < balls.length; i++) {
        if (balls[i].exists) {

            let dx = this.x - balls[i].x;
            let dy = this.y - balls[i].y;

            let distance = Math.sqrt(dx * dx + dy * dy);
            let distanceCollision = this.size + balls[i].size;

            if (distance <= distanceCollision) {
                balls[i].exists = false;
                scorePoint--;
            }

        }
    }
};



//Draw balls
Ball.prototype.draw = function () {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
};


//Update balls
Ball.prototype.movement = function () {

    //Move balls
    this.x += this.velX;
    this.y += this.velY;


    //Make balls bounce
    if ((this.x + this.size) >= width) {
        this.velX *=-1;
    }

    if ((this.x - this.size) <= 0) {
        this.velX *= -1;
    }

    if ((this.y + this.size) >= height) {
        this.velY *= -1;
    }

    if ((this.y - this.size) <= 0) {
        this.velY *= -1;
    }

};


//if collision
Ball.prototype.collisionDetect = function() {

    for (let i = 0; i < balls.length; i++) {
        if ( this !== balls[i]) {
            let dx = this.x - balls[i].x;
            let dy = this.y - balls[i].y;

            let distance = Math.sqrt(dx * dx + dy * dy);
            let distanceCollision = this.size + balls[i].size;

            if (distance <= distanceCollision) {
                this.color = balls[i].color;
            }

        }
    }
};





//All balls
let balls = [];

//Create player
let player = new PlayerCircle(random(0, width), random(0, height), true);


//Game loop
function loop() {

    //Refresh background
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillRect(0, 0, width, height);





    //Create new ball
    while (balls.length < 25) {

        let ball = new Ball(random(0, width), random(0, height), random(-5, 5), random(-5,5), true, randomColor(), random(10, 20));

        balls.push(ball);
    }


    //Update all balls
    for (let i = 0; i < balls.length; i++) {

        //check if the ball exists
        if (balls[i].exists) {
            balls[i].draw();
            balls[i].movement();
            balls[i].collisionDetect();
        }

    }



    //Set player
    player.draw();
    player.setControl();
    player.checkBounce();
    player.collisionDetect();


    //Update score
    score.textContent = `Ball count: ${scorePoint}`;


    requestAnimationFrame(loop);
}

loop();
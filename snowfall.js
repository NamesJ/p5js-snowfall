const Snow = {
  radius: {
    min: 5, // minimum snowflake radius
    max: 10, // maximum snowflake radius
    range: null // max-min (function)
  },
  fallSpeed: {
    min: 0.01, // minimum fall speed
    max: 0.05, // maximum fall speed
    range: null // max-min (function)
  },
  flakes: [],
  rate: null, // snowflakes per second,
  interval: null, // seconds per snowflake (function)
  generate: null // generate new snowflake (function)
};

Snow.radius.range = () => Snow.radius.max - Snow.radius.min;
Snow.fallSpeed.range = () => Snow.fallSpeed.max - Snow.fallSpeed.min;

Snow.rate = () => mouseY;
Snow.interval = () => 1.0 / Snow.rate();

Snow.generate = () => {
  let radius = random(Snow.radius.range()) + Snow.radius.min;
  let radiusRatio = radius / Snow.radius.max;
  //let parallaxScalar = min(radiusRatio*2.0, 1.0);
  let parallaxScalar = (1.0 + radiusRatio);
  //let fallSpeed = random(Snow.fallSpeed.range()) + Snow.fallSpeed.min;
  //let fallSpeed = (random(Snow.fallSpeed.range()) + Snow.fallSpeed.min) * parallaxScalar;
  let fallSpeed = Snow.fallSpeed.max * radiusRatio;
  let dt = windowHeight / fallSpeed;
  let pos = createVector(random(-Wind.speed*dt, windowWidth+Wind.speed*dt), -20);
  
  Snow.flakes.push({
    pos: pos,
    radius: radius,
    fallSpeed: fallSpeed
  });
};


const Wind = {
  minSpeed: -2,
  maxSpeed: 2,
  speed: 0
};

var flakes = [];
var tNextFlake = 0;

var tNextPrint = 0;
var printInterval = 1000;

var bg;

function setup() {
  bg = loadImage('timothy-eberly-LHm2nLdtC9g-unsplash.jpg');
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  //background(0);
  background(bg);
  tNextPrint -= deltaTime;
  
  Wind.speed += 0.00005*sin(millis()/10000);
  
  tNextFlake -= deltaTime;
  if (tNextFlake < 0) {
    tNextFlake = Snow.interval() * 1000;
    console.log(tNextFlake);
    Snow.generate();
  }
  
  // draw, update, remove off-screen snowflakes
  for (let i=0; i<Snow.flakes.length; i++) {
    strokeWeight(0);
    fill(245);
    circle(Snow.flakes[i].pos.x, Snow.flakes[i].pos.y, Snow.flakes[i].radius);
    
    Snow.flakes[i].pos.x += Wind.speed * deltaTime;
    Snow.flakes[i].pos.y += Snow.flakes[i].fallSpeed * deltaTime;
    
    if (Snow.flakes[i].y > windowHeight) {
      Snow.flakes.splice(i, 1);
    }
  }
  
  if (tNextPrint < 0) {
    //console.log(Snow.flakes);
    tNextPrint = printInterval;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

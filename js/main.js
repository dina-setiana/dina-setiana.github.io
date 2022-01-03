"use strict";
import Helper from './helper.js';

function loadImage(id, targetId) {
  var el = document.getElementById(id);
  var targetEl = targetId ? document.getElementById(targetId) : el;
  var imageToLoad;
  if (el.dataset.image) {
    imageToLoad = el.dataset.image;
  } else if (typeof el.currentSrc === 'undefined') {
    imageToLoad = el.src;
  } else {
    imageToLoad = el.currentSrc;
  }
  if (imageToLoad) {
    var img = new Image();
    img.src = imageToLoad;
    img.onload = function () {
      targetEl.classList.add('is-loaded');
    };
  }
}

document.addEventListener('DOMContentLoaded', function () {
  loadImage('pictureImage', 'picture');
});

const particle = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  r: 0,
  rChange: 0.015,
  color: "#ffffff",

  create: function (x, y, speed, direction, r) {
    const obj = Object.create(this);
    obj.x = x;
    obj.y = y;
    obj.vx = Math.cos(direction) * speed;
    obj.vy = Math.sin(direction) * speed;
    obj.r = r || 0;
    obj.color = this.randomColor();
    return obj;
  },

  getSpeed: function () {
    return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
  },

  setSpeed: function (speed) {
    var heading = this.getHeading();
    this.vx = Math.cos(heading) * speed;
    this.vy = Math.sin(heading) * speed;
  },

  getHeading: function () {
    return Math.atan2(this.vy, this.vx);
  },

  setHeading: function (heading) {
    var speed = this.getSpeed();
    this.vx = Math.cos(heading) * speed;
    this.vy = Math.sin(heading) * speed;
  },

  randomColor: function () {
    const arrColors = ["ffffff", "ffecd3", "bfcfff", "00cec9"];
    return "#" + arrColors[Helper.randomInt(arrColors.length - 1, 1)];
  },

  update: function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.r > MAX_STAR_RADIUS + 0.3 || this.r < .8) {
      this.rChange = - this.rChange;
    }
    this.r += this.rChange;
  }
}

function createStars(spacing) {
  for (let x = 0; x < C_WIDTH; x += spacing) {
    for (let y = 0; y < C_HEIGHT; y += spacing) {
      const star = particle.create(x + Helper.randomInt(spacing), y + Helper.randomInt(spacing), 0, 0, Math.random() * MAX_STAR_RADIUS + .25);
      stars.push(star);
    }
  }
}

function drawStar(star) {
  ctx.beginPath();
  ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2, false);
  ctx.shadowBlur = 8;
  ctx.shadowColor = "white";
  ctx.fillStyle = star.color;
  ctx.fill();
}

function createShootingStar() {
  const shootingStarSpeed = {
    min: 15,
    max: 20
  },
    starsAngle = 145;
  const shootingStar = particle.create(
    Helper.randomInt(C_WIDTH, C_WIDTH / 2),
    Helper.randomInt(C_HEIGHT / 2),
    0, 0, 0
  )
  shootingStar.setSpeed(Helper.randomInt(shootingStarSpeed.max, shootingStarSpeed.min));
  shootingStar.opacity = 0;
  shootingStar.trailLengthDelta = 0;
  shootingStar.isSpawning = true;
  shootingStar.isDying = false;
  shootingStar.setHeading(Helper.degreesToRads(starsAngle));

  shootingStars.push(shootingStar);
  return shootingStars;
}

function drawShootingStar(p) {
  const { x, y, opacity } = p;
  const currentTrailLength = (MAX_TRAIL_LEN * p.trailLengthDelta),
    pos = lineToAngle(x, y, -currentTrailLength, p.getHeading());

  ctx.fillStyle = "rgba(255, 255, 255, " + opacity + ")";
  const starLength = 5;
  ctx.beginPath();
  ctx.moveTo(x - 1, y + 1);

  ctx.lineTo(x, y + starLength);
  ctx.lineTo(x + 1, y + 1);

  ctx.lineTo(x + starLength, y);
  ctx.lineTo(x + 1, y - 1);

  ctx.lineTo(x, y + 1);
  ctx.lineTo(x, y - starLength);

  ctx.lineTo(x - 1, y - 1);
  ctx.lineTo(x - starLength, y);

  ctx.lineTo(x - 1, y + 1);
  ctx.lineTo(x - starLength, y);

  ctx.closePath();
  ctx.fill();

  //trail
  ctx.fillStyle = "rgba(0, 206, 201, " + opacity + ")";
  ctx.beginPath();
  ctx.moveTo(x - 1, y - 1);
  ctx.lineTo(pos.x, pos.y);
  ctx.lineTo(x + 1, y + 1);
  ctx.closePath();
  ctx.fill();
}

function lineToAngle(x1, y1, length, radians) {
  var x2 = x1 + length * Math.cos(radians),
    y2 = y1 + length * Math.sin(radians);
  return { x: x2, y: y2 };
}

const canvas = document.querySelector("#bg-canvas");
const ctx = canvas.getContext("2d");

const C_WIDTH = canvas.width = window.innerWidth;
const C_HEIGHT = canvas.height = window.innerHeight;

const MAX_STAR_RADIUS = 1,
  MAX_TRAIL_LEN = 300,
  TRAIL_LENGTH_DELTA = 0.01,
  OPACITY_DELTA = 0.01;

const stars = [];
const shootingStars = [];

function animate() {
  ctx.clearRect(0, 0, C_WIDTH, C_HEIGHT);

  stars.forEach(star => {
    star.update();
    drawStar(star);
  });

  shootingStars.forEach((shootingStar, i) => {
    if (shootingStar.isSpawning) {
      shootingStar.opacity += OPACITY_DELTA;
      if (shootingStar.opacity >= 1.0) {
        shootingStar.isSpawning = false;
        shootingStar.isDying = true;
      }
    }
    if (shootingStar.isDying) {
      shootingStar.opacity -= OPACITY_DELTA;
      if (shootingStar.opacity <= 0.0) {
        shootingStar.isDying = false;
        shootingStar.isDead = true;
      }
    }
    shootingStar.trailLengthDelta += TRAIL_LENGTH_DELTA;
    shootingStar.x += shootingStar.vx;
    shootingStar.y += shootingStar.vy;
    if (shootingStar.opacity > 0.0) {
      drawShootingStar(shootingStar);
    }
    if (shootingStar.isDead) {
      shootingStars.splice(i, 1);
    }
  });
  requestAnimationFrame(animate);
}

window.addEventListener('blur', () => {
  paused = true;
});
window.addEventListener('focus', () => {
  paused = false;
});

let paused = false;
createStars(45);
setInterval(() => {
  if (paused) return;
  createShootingStar();
}, 2000);
animate();
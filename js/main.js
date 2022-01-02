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

// Background
const MAX_STAR_RADIUS = 1.5;
const backgroundColor = "#202833"
const background = document.querySelector("#starry-canvas");
const ctx = background.getContext("2d");
const width = window.innerWidth;
const height = window.innerHeight;

background.width = width;
background.height = height

function createStars(spacing) {
  const startArr = [];

  for (let x = 0; x < width; x += spacing) {
    for (let y = 0; y < height; y += spacing) {
      const star = {
        x: x + Helper.randomInt(spacing),
        y: y + Helper.randomInt(spacing),
        r: Math.random() * MAX_STAR_RADIUS,
      };
      startArr.push(star);
    }
  }
  return startArr;
}

function fillCircle(x, y, r, fillStyle) {
  ctx.beginPath();
  ctx.fillStyle = fillStyle;
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function render(timestamp) {
  now = timestamp;
  elapsed = now - then;

  // if enough time has elapsed, draw the next frame
  if (elapsed > fpsInterval) {
    // Get ready for next frame by setting then=now, but...
    // Also, adjust for fpsInterval not being multiple of 16.67
    then = now - (elapsed % fpsInterval);

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
    stars.forEach((star, i) => {
      const factor = counter * i;
      let opacity = 1;
      if (i % skipFlickerN) {
        opacity = Helper.getOpacity(factor);
      }
      // console.log("opacity", opacity);

      // factor will be a different number for every star
      const { x, y, r } = star;
      fillCircle(x, y, r, `rgba(255, 255, 255, ${opacity}`);
    });
    counter++;
  }
  requestAnimationFrame(render);
}

let counter = 0;
let fpsInterval = 1000 / 2.5;
let then = window.performance.now();
let now, elapsed = null;
const skipFlickerN = Helper.randomInt(4, 8);
const stars = createStars(30);
render();
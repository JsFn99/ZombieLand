let hero;
let men = [];
let zombies = [];
let obstacles = [];
let snakeMode = false;
let bgImage;
let zombieImage;
let manImage;
let heroImage;
let rockImage;

function preload() {
  bgImage = loadImage('assets/desert.png');
  zombieImage = loadImage('assets/zombie.png');
  manImage = loadImage('assets/man.png');
  heroImage = loadImage('assets/hero.png');
  rockImage = loadImage('assets/rock.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  hero = new Hero(mouseX, mouseY);

  for (let i = 0; i < 5; i++) {
    zombies.push(new Zombie(random(width), random(height)));
  }

  obstacles.push(new Obstacle(width / 2, height / 2, 100, "green"));
}

function draw() {
  background(0);
  image(bgImage, 0, 0, width, height);

  obstacles.forEach((obstacle) => obstacle.show());

  hero.update(mouseX, mouseY, obstacles);
  hero.show();

  let leader = hero.pos;
  if (snakeMode) {
    men.forEach((man, index) => {
      leader = index === 0 ? hero.pos : men[index - 1].pos;
      man.update(leader, obstacles);
      man.show();
    });
  } else {
    men.forEach((man) => {
      man.update(hero.pos, obstacles);
      man.show();
    });
  }

  zombies.forEach((zombie) => {
    zombie.update(obstacles);
    zombie.show();
  });
}

function mousePressed() {
  obstacles.push(new Obstacle(mouseX, mouseY, random(20, 80), "green"));
}

function keyPressed() {
  console.log(key);
  if (key === 'm') {
    men.push(new Man(random(width), random(height)));
  }
  if (key === 's') {
    snakeMode = !snakeMode;
  }
  if (key === 'z') {
    zombies.push(new Zombie(random(width), random(height)));
  }
}
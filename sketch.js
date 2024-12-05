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
let sliderVitesseMaxZombies;
let sliderVitesseMaxMen;
let sliderVitesseMaxHero;

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

  // Création des sliders
  createMonSlider("Vitesse Zombies", 1, 10, 3, 0.1, 20, 0, "white", "maxSpeed", zombies);
  createMonSlider("Vitesse Men", 1, 10, 5, 0.1, 20, 40, "white", "maxSpeed", men);
  createMonSlider("Vitesse Hero", 1, 10, 5, 0.1, 20, 80, "white", "maxSpeed", [hero]);
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
  if (key === 'o') {
    obstacles.push(new Obstacle(mouseX, mouseY, random(20, 80), "green"));
  }
}

function createMonSlider(label, min, max, val, step, x, y, color, prop, targetArray) {
  // On crée un slider pour régler la vitesse max
  // des véhicules
  // slider les paramètres : Min, Max, Valeur, Pas
  let slider = createSlider(min, max, val, step);
  // on positionne le slider en haut à gauche du canvas
  slider.position(100, y + 17);
  // Label à gauche du slider "maxSpeed"
  let labelHTML = createP(label);
  // label en blanc
  labelHTML.style('color', 'white');
  // on le positionne en x=10 y = 10
  labelHTML.position(x, y);
  //on affiche la valeur du slider à droite du slider
  let labelValue = createP(slider.value());
  labelValue.style('color', color);
  labelValue.position(250, y);
  // on veut que la valeur soit mise à jour quand on déplace
  // le slider
  slider.input(() => {
    labelValue.html(slider.value());
    // On change la propriété de tous les characters
    targetArray.forEach(item => {
      item[prop] = slider.value();
    });
  });
}


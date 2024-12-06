let hero;
let men = [];
let zombies = [];
let obstacles = [];
let bullets = [];
let snakeMode = false;
let bgImage;
let zombieImage;
let manImage;
let heroImage;
let rockImage;
let bulletImage;
let backgroundImage;
let sliderVitesseMaxZombies;
let sliderVitesseMaxMen;
let sliderVitesseMaxHero;
let zombieCountP;
let menCountP;

function preload() {
  bgImage = loadImage('assets/desert.png');
  zombieImage = loadImage('assets/zombie.png');
  manImage = loadImage('assets/man.png');
  heroImage = loadImage('assets/hero.png');
  rockImage = loadImage('assets/rock.png');
  bulletImage = loadImage('assets/bullet.png');
  backgroundImage = loadImage('assets/background.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  hero = new Hero(mouseX, mouseY);

  // Création des zombies et des hommes
  for (let i = 0; i < 10; i++) {
    zombies.push(new Zombie(random(width), random(height)));
  }

  for (let i = 0; i < 5; i++) {
    men.push(new Man(random(width), random(height)));
  }
  
  obstacles.push(new Obstacle(width / 2, height / 2, 100, "green"));

  // Création des sliders
  createMonSlider("Vitesse Zombies", 1, 10, 3, 0.1, 20, 0, "white", "maxSpeed", zombies);
  createMonSlider("Vitesse Men", 1, 10, 5, 0.1, 20, 40, "white", "maxSpeed", men);
  createMonSlider("Vitesse Hero", 1, 10, 5, 0.1, 20, 80, "white", "maxSpeed", [hero]);

  // affiche le nombre de zombies
  zombieCountP = createP(`Nombre de zombies: ${zombies.length}`);
  zombieCountP.style('color', 'white');
  zombieCountP.position(20, 120);

  // affiche le nombre d'hommes
  menCountP = createP(`Nombre d\'hommes: ${men.length}`);
  menCountP.style('color', 'white');
  menCountP.position(20, 150);
}

function draw() {
  background(backgroundImage);
  image(bgImage, 0, 0, width, height);
  // affiche les obstacles
  obstacles.forEach((obstacle) => obstacle.show());

  // Mise à jour et affichage du héros
  hero.applyBehaviors(mouseX, mouseY, obstacles, men);
  hero.update();
  hero.show();

  // Mise à jour et affichage des hommes
  let leader = hero.pos;
  if (snakeMode) {
    men.forEach((man, index) => {
      leader = index === 0 ? hero.pos : men[index - 1].pos;
      man.applyBehaviors(leader, obstacles, men);
      man.update();
      man.show();
    });
  } else {
    men.forEach((man) => {
      man.applyBehaviors(hero.pos, obstacles, men);
      man.update();
      man.show();
    });
  }

  // Mise à jour et affichage des missiles
  bullets.forEach((bullet, bIndex) => {
    if (zombies.length > 0) {
      bullet.applyBehaviors(zombies[0].pos); // Cible le premier zombie
    }
    bullet.update();
    bullet.show();

    // Vérifiez la collision entre la balle et les zombies
    zombies.forEach((zombie, zIndex) => {
      if (p5.Vector.dist(bullet.pos, zombie.pos) < bullet.r + zombie.size / 2) {
        // Supprimez le zombie et la balle
        zombies.splice(zIndex, 1);
        bullets.splice(bIndex, 1);
      }
    });
  });

  // Mise à jour et affichage des zombies
  zombies.forEach((zombie) => {
    zombie.applyBehaviors(obstacles);
    zombie.update();
    zombie.show();
  });

  // Mise à jour du nombre de zombies
  zombieCountP.html(`Nombre de zombies : ${zombies.length}`);

  // Mise à jour du nombre d'hommes
  menCountP.html(`Nombre d\'hommes : ${men.length}`);
}

function keyPressed() {
  console.log(key);
  // Ajout d'un homme
  if (key === 'm') {
    men.push(new Man(random(width), random(height)));
  }
  // Men en mode serpent activé/désactivé
  if (key === 's') {
    snakeMode = !snakeMode;
  }
  // Ajout d'un zombie 
  if (key === 'z') {
    zombies.push(new Zombie(random(width), random(height)));
  }
  // Ajout d'un obstacle à la position de la souris
  if (key === 'o') {
    obstacles.push(new Obstacle(mouseX, mouseY, random(20, 80), "green"));
  }
  // tir de missiles limité au nombre de zombies sur la map
  if (key === 'b' ) {
    if(zombies.length > 0 && bullets.length < zombies.length)
      bullets.push(new Bullet(hero.pos.x, hero.pos.y));
  }
  if(key === 'd') {
    Character.debug = !Character.debug;
    Obstacle.debug = !Obstacle.debug;
    Bullet.debug = !Bullet.debug;
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
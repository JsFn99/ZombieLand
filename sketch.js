let hero;
let dogs = [];
let zombies = [];
let obstacles = [];
let bullets = [];
let snakeMode = true;
let bgImage;
let zombieImage;
let manImage;
let heroImage;
let rockImage;
let bulletImage;
let backgroundImage;
let lifeImage;
let deathImage;
let sliderVitesseMaxZombies;
let sliderVitesseMaxDogd;
let sliderVitesseMaxHero;
let zombieCountP;
let dogsCountP;
let lives = 3;
let Score = 1000;

function preload() {
  bgImage = loadImage('assets/image/desert.png');
  zombieImage = loadImage('assets/image/zombie.png');
  dogImage = loadImage('assets/image/dog.png');
  heroImage = loadImage('assets/image/hero.png');
  rockImage = loadImage('assets/image/rock.png');
  bulletImage = loadImage('assets/image/bullet.png');
  backgroundImage = loadImage('assets/image/background.png');
  lifeImage = loadImage('assets/image/life.png');
  deathImage = loadImage('assets/image/death.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  hero = new Hero(mouseX, mouseY);

  // Création des zombies et des chiens
  for (let i = 0; i < 10; i++) {
    zombies.push(new Zombie(random(width), random(height)));
  }

  for (let i = 0; i < 5; i++) {
    dogs.push(new Dog(random(width), random(height)));
  }

  obstacles.push(new Obstacle(width / 2, height / 2, 100, "green"));

  // Création des sliders
  createMonSlider("Vitesse Zombies", 1, 10, 3, 0.1, 20, 0, "white", "maxSpeed", zombies);
  createMonSlider("Vitesse Dogs", 1, 10, 5, 0.1, 20, 40, "white", "maxSpeed", dogs);
  createMonSlider("Vitesse Hero", 1, 10, 5, 0.1, 20, 80, "white", "maxSpeed", [hero]);

  // affiche le nombre de zombies
  zombieCountP = createP(`Nombre de zombies: ${zombies.length}`);
  zombieCountP.style('color', 'white');
  zombieCountP.position(20, 120);

  // affiche le nombre de chiens
  dogsCountP = createP(`Nombre de chiens: ${dogs.length}`);
  dogsCountP.style('color', 'white');
  dogsCountP.position(20, 150);

  /// affiche le score
  scoreP = createP(`Score: ${Score}`);
  scoreP.style('color', 'white');
  scoreP.position(20, 180);
}

function draw() {
  background(backgroundImage);
  image(bgImage, 0, 0, width, height);
  // affiche les obstacles
  obstacles.forEach((obstacle) => obstacle.show());

  // Mise à jour et affichage du héros
  hero.applyBehaviors(mouseX, mouseY, obstacles, dogs);
  hero.update();
  hero.show();

  // Mise à jour et affichage des chiens
  let leader = hero.pos;
  if (snakeMode) {
    dogs.forEach((dog, index) => {
      leader = index === 0 ? hero.pos : dogs[index - 1].pos;
      dog.applyBehaviors(leader, obstacles, dogs);
      dog.update();
      dog.show();
    });
  } else {
    dogs.forEach((dog) => {
      dog.applyBehaviors(hero.pos, obstacles, dogs);
      dog.update();
      dog.show();
    });
  }

  // Vérifiez les collisions entre les chiens et les zombies
  for (let i = dogs.length - 1; i >= 0; i--) {
    if (dogs[i].checkCollision(zombies)) {
      new Audio('assets/audio/bark.m4a').play();
      dogs.splice(i, 1); // Supprimez le chien touché
      Score -= 100;
      // Ajouter zombie 
      zombies.push(new Zombie(random(width), random(height)));
    }
  }

  // Vérifiez les collisions entre les zombies et le hero
if (hero.checkCollision(zombies)) {
  new Audio('assets/audio/dead.m4a').play();
  Score -= 200;
  // supprimez tout les zombies
  zombies = [];
  // recréer des zombies
  for (let i = 0; i < 10; i++) {
    zombies.push(new Zombie(random(width), random(height)));
  }
  // perdre vie
  lives--;
  if (lives === 0) {
    noLoop();
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Game Over", width / 2, height / 2);
  }
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
        Score += 100;
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

  // Mise à jour du nombre de chiens
  dogsCountP.html(`Nombre de chiens : ${dogs.length}`);

  // Affiche les vies
  for (let i = 0; i < lives; i++) {
    image(lifeImage, width - (i + 1) * 40, 20, 30, 30);
  }

  // Mise à jour du score
  scoreP.html(`Score : ${Score}`);
}

function keyPressed() {
  console.log(key);
  // Ajout d'un chien
  if (key === 'm') {
    dogs.push(new Dog(random(width), random(height)));
  }
  // Dogs en mode serpent activé/désactivé
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
  if (key === 'b') {
    if (zombies.length > 0 && bullets.length < zombies.length){
      // effet de tir assets/rocket.mp3
      bullets.push(new Bullet(hero.pos.x, hero.pos.y));
      new Audio('assets/audio/rocket.m4a').play();
    }
  }
  if (key === 'd') {
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
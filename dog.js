class Dog extends Character {
    constructor(x, y) {
      super(x, y);
      this.size = 40;
      this.color = "yellow";
      this.maxSpeed = 5;
      this.maxForce = 0.2;
      this.vel = p5.Vector.random2D();
      this.vel.setMag(random(2, 4));
      this.acc = createVector();
      this.rayonZoneDeFreinage = 180;
      // poids pour les comportements
      this.arriveWeight = 1;
      this.avoidWeight = 3;
      this.separateWeight = 1;  
      // Nouveau poids pour éviter le héros
      this.avoidHeroWeight = 5; 
  
      this.distanceSeparation = this.r/2;
    }
  
    applyBehaviors(leader, obstacles, dogs) {
      let arriveForce = this.arrive(leader, this.r);
      let avoidForce = this.avoid(obstacles);
      let separateForce = this.separate(dogs);
      // petit racourcis pour reutiliser la fonction avoid 
      // qui prend en paramètre un tableau d'obstacles
      let h = [];
      h.push(hero);
      let avoidHeroForce = this.avoid(h);
  
      arriveForce.mult(this.arriveWeight);
      avoidForce.mult(this.avoidWeight);
      separateForce.mult(this.separateWeight);
      avoidHeroForce.mult(this.avoidHeroWeight);
  
      this.applyForce(arriveForce);
      this.applyForce(avoidForce);
      this.applyForce(separateForce);
      this.applyForce(avoidHeroForce);
  
      super.update();
    }
  
    checkCollision(zombies) {
      for (let i = 0; i < zombies.length; i++) {
        let d = p5.Vector.dist(this.pos, zombies[i].pos);
        if (d < this.size / 2 + zombies[i].size / 2) {
          return true;
        }
      }
      return false;
    }
  
  
      show() {
          image(dogImage, this.pos.x - this.size/2, this.pos.y - this.size/2, this.size, this.size);
          // this.drawPath();
        /* fill(this.color);
        noStroke();
        ellipse(this.pos.x, this.pos.y, this.size); */
      }
    }
    
class Bullet {
    static debug = false;
    constructor(x, y) {
      this.pos = createVector(x, y);
      this.vel = createVector(0, 0);
      this.acc = createVector(0, 0);
      this.maxSpeed = 10;
      this.maxForce = 0.25;
      this.r = 25; // Rayon de la balle
    }
  
    applyBehaviors(target) {
      let force = this.seek(target);
      this.applyForce(force);
    }
  
    seek(target) {
      let desired = p5.Vector.sub(target, this.pos);
      desired.setMag(this.maxSpeed);
      let steer = p5.Vector.sub(desired, this.vel);
      steer.limit(this.maxForce);
      return steer;
    }
  
    applyForce(force) {
      this.acc.add(force);
    }
  
    update() {
      this.vel.add(this.acc);
      this.vel.limit(this.maxSpeed);
      this.pos.add(this.vel);
      this.acc.set(0, 0);
    }
  
    show() {
      push();
      translate(this.pos.x, this.pos.y);
      rotate(this.vel.heading());
      image(bulletImage, -this.r, -this.r, this.r * 2, this.r * 2);
      pop();
      if (Bullet.debug) {
        this.drawVelocityVector();
    }
    }

    drawVelocityVector() {
        push();
        // Dessin du vecteur vitesse
        // Il part du centre du véhicule et va dans la direction du vecteur vitesse
        strokeWeight(3);
        stroke("red");
        line(this.pos.x, this.pos.y, this.pos.x + this.vel.x * 10, this.pos.y + this.vel.y * 10);
        // dessine une petite fleche au bout du vecteur vitesse
        let arrowSize = 5;
        translate(this.pos.x + this.vel.x * 10, this.pos.y + this.vel.y * 10);
        rotate(this.vel.heading());
        translate(-arrowSize / 2, 0);
        triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
        pop();
      }
  
    edges() {
      if (this.pos.x > width + this.r) {
        this.pos.x = -this.r;
      } else if (this.pos.x < -this.r) {
        this.pos.x = width + this.r;
      }
      if (this.pos.y > height + this.r) {
        this.pos.y = -this.r;
      } else if (this.pos.y < -this.r) {
        this.pos.y = height + this.r;
      }
    }
  }

  // l'appelation bullet est en effet bizarre.
  // j'ai fini par prendre un missile pour le sprite
  // puisque le bullet a plus un comportement de missile
  // que de balle, il ne rate jamais sa cible !!
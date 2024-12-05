class Zombie extends Character {
  constructor(x, y) {
    super(x, y);
    this.size = 60;
    this.color = "red";
    this.maxSpeed = 3;
    this.maxForce = 0.2;
    this.vel = p5.Vector.random2D();
    this.vel.setMag(random(2, 4));
    this.acc = createVector();
  }

  update(obstacles) {
    let wander = p5.Vector.random2D();
    wander.setMag(this.maxForce);

    let avoidForce = this.avoid(obstacles);

    this.applyForce(wander);
    this.applyForce(avoidForce);

    let boundariesForce = this.boundaries(0, 0, width, height, 40);
    this.applyForce(boundariesForce);

    super.update();
  }

  boundaries(bx, by, bw, bh, d) {
    let vitesseDesiree = null;

    const xBordGauche = bx + d;
    const xBordDroite = bx + bw - d;
    const yBordHaut = by + d;
    const yBordBas = by + bh - d;

    if (this.pos.x < xBordGauche) {
      vitesseDesiree = createVector(this.maxSpeed, this.vel.y);
    } else if (this.pos.x > xBordDroite) {
      vitesseDesiree = createVector(-this.maxSpeed, this.vel.y);
    }

    if (this.pos.y < yBordHaut) {
      vitesseDesiree = createVector(this.vel.x, this.maxSpeed);
    } else if (this.pos.y > yBordBas) {
      vitesseDesiree = createVector(this.vel.x, -this.maxSpeed);
    }

    if (vitesseDesiree !== null) {
      vitesseDesiree.setMag(this.maxSpeed);
      const force = p5.Vector.sub(vitesseDesiree, this.vel);
      force.limit(this.maxForce);
      return force;
    }

    return createVector(0, 0);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  show() {
    image(zombieImage, this.pos.x - this.size / 2, this.pos.y - this.size / 2, this.size, this.size);
    /* fill(this.color);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.size); */
  }
  }

  
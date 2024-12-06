class Zombie extends Character {
  constructor(x, y) {
    super(x, y);
    this.size = 70;
    this.color = "red";
    this.maxSpeed = 3;
    this.maxForce = 0.2;
    this.vel = p5.Vector.random2D();
    this.vel.setMag(random(2, 4));
    this.acc = createVector();
  }

  applyBehaviors(obstacles) {
    let wander = p5.Vector.random2D();
    wander.setMag(this.maxForce);

    let avoidForce = this.avoid(obstacles);

    this.applyForce(wander);
    this.applyForce(avoidForce);

    let boundariesForce = this.boundaries(0, 0, width, height, 40);
    this.applyForce(boundariesForce);

  }

  b
  show() {
    image(zombieImage, this.pos.x - this.size / 2, this.pos.y - this.size / 2, this.size, this.size);
    /* fill(this.color);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.size); */
  }
  }

  
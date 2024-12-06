class Character {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-2, 2), random(-2, 2));
    this.acc = createVector(0, 0);
    this.maxSpeed = 3;
    this.maxForce = 0.2;
    this.size = 20;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  avoid(obstacles) {
    let steer = createVector(0, 0);
    obstacles.forEach((obstacle) => {
      let d = p5.Vector.dist(this.pos, obstacle.pos);
      if (d < obstacle.radius + this.size) {
        let flee = p5.Vector.sub(this.pos, obstacle.pos);
        flee.setMag(this.maxSpeed);
        steer.add(flee);
      }
    });
    return steer;
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
    this.edges();
  }

  edges() {
    if (this.pos.x > width) {
      this.pos.x = 0;
    } else if (this.pos.x < 0) {
      this.pos.x = width;
    }
    if (this.pos.y > height) {
      this.pos.y = 0;
    } else if (this.pos.y < 0) {
      this.pos.y = height;
    }
  }

  show() {
      
    fill(255);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.size);
  }
}
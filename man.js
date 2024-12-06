class Man extends Character {
  constructor(x, y) {
    super(x, y);
    this.size = 40;
    this.color = "yellow";
    this.maxSpeed = 5;
    this.maxForce = 0.2;
    this.vel = p5.Vector.random2D();
    this.vel.setMag(random(2, 4));
    this.acc = createVector();
    this.rayonZoneDeFreinage = 100;
  }

  update(leader, obstacles) {
    let arriveForce = this.arrive(leader, this.size);
    let avoidForce = this.avoid(obstacles);

    this.applyForce(arriveForce);
    this.applyForce(avoidForce);

    super.update();
  }

  arrive(target, d = 0) {
    return this.seek(target, true, d);
  }

  seek(target, arrival, d = 0) {
    let desiredSpeed = p5.Vector.sub(target, this.pos);
    let desiredSpeedMagnitude = this.maxSpeed;

    if (arrival) {
      const dist = p5.Vector.dist(this.pos, target);
      if (dist < this.rayonZoneDeFreinage) {
        desiredSpeedMagnitude = map(dist, d, this.rayonZoneDeFreinage, 0, this.maxSpeed);
      }
    }

    desiredSpeed.setMag(desiredSpeedMagnitude);
    let force = p5.Vector.sub(desiredSpeed, this.vel);
    force.limit(this.maxForce);
    return force;
  }

  applyForce(force) {
    this.acc.add(force);
  }
  
    show() {
        image(manImage, this.pos.x - this.size/2, this.pos.y - this.size/2, this.size, this.size);
      /* fill(this.color);
      noStroke();
      ellipse(this.pos.x, this.pos.y, this.size); */
    }
  }
  
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
    this.distanceSeparation = this.size * 2; // Distance de séparation
  }

  update(leader, obstacles, men) {
    let arriveForce = this.arrive(leader, this.size);
    let avoidForce = this.avoid(obstacles);
    let separateForce = this.separate(men);

    this.applyForce(arriveForce);
    this.applyForce(avoidForce);
    this.applyForce(separateForce);

    super.update();
  }

  separate(men) {
    let desiredSeparation = this.distanceSeparation;
    let steer = createVector(0, 0);
    let count = 0;

    men.forEach((other) => {
      let d = p5.Vector.dist(this.pos, other.pos);
      if ((d > 0) && (d < desiredSeparation)) {
        let diff = p5.Vector.sub(this.pos, other.pos);
        diff.normalize();
        diff.div(d);
        steer.add(diff);
        count++;
      }
    });

    if (count > 0) {
      steer.div(count);
    }

    if (steer.mag() > 0) {
      steer.setMag(this.maxSpeed);
      steer.sub(this.vel);
      steer.limit(this.maxForce);
    }

    return steer;
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
  
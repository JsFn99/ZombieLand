class Hero extends Character {
  constructor(x, y) {
    super(x, y);
    this.size = 100;
    this.color = "blue";
    this.maxSpeed = 5;
    this.maxForce = 0.2;
  }

  update(mouseX, mouseY, obstacles) {
    let mousePos = createVector(mouseX, mouseY);
    let arriveForce = this.arrive(mousePos);
    let avoidForce = this.avoid(obstacles);

    this.applyForce(arriveForce);
    this.applyForce(avoidForce);

    super.update();
  }

  arrive(target) {
    return this.seek(target, true);
  }

  seek(target, arrival = false) {
    let desired = p5.Vector.sub(target, this.pos);
    let d = desired.mag();
    let speed = this.maxSpeed;
    if (arrival && d < this.rayonZoneDeFreinage) {
      speed = map(d, 0, this.rayonZoneDeFreinage, 0, this.maxSpeed);
    }
    desired.setMag(speed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
  }
  
    show() {
        image(heroImage, this.pos.x - this.size/2, this.pos.y - this.size/2, this.size, this.size);
      /* fill(this.color);
      noStroke();
      ellipse(this.pos.x, this.pos.y, this.size); */
    }
  }
  
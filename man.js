class Man extends Character {
    constructor(x, y) {
      super(x, y);
      this.size = 60;
      this.color = "yellow";
    }
  
    update(leader, obstacles) {
      let desired = p5.Vector.sub(leader, this.pos);
      desired.setMag(this.maxSpeed);
      let steer = p5.Vector.sub(desired, this.vel);
      steer.limit(this.maxForce);
  
      let avoidForce = this.avoid(obstacles);
  
      this.applyForce(steer);
      this.applyForce(avoidForce);
  
      super.update();
    }
  
    show() {
        image(manImage, this.pos.x - this.size/2, this.pos.y - this.size/2, this.size, this.size);
      /* fill(this.color);
      noStroke();
      ellipse(this.pos.x, this.pos.y, this.size); */
    }
  }
  
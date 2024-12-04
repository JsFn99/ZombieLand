class Zombie extends Character {
    constructor(x, y) {
      super(x, y);
      this.size = 60;
      this.color = "red";
    }
  
    update(obstacles) {
      let wander = p5.Vector.random2D();
      wander.setMag(this.maxForce);
  
      let avoidForce = this.avoid(obstacles);
  
      this.applyForce(wander);
      this.applyForce(avoidForce);
  
      super.update();
    }
  
    show() {
        image(zombieImage, this.pos.x - this.size/2, this.pos.y - this.size/2, this.size, this.size);
      /* fill(this.color);
      noStroke();
      ellipse(this.pos.x, this.pos.y, this.size); */
    }
  }
  
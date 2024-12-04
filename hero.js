class Hero extends Character {
    constructor(x, y) {
      super(x, y);
      this.size = 100;
      this.color = "blue";
    }
  
    update(mouseX, mouseY, obstacles) {
      this.pos.set(mouseX, mouseY);
  
      let avoidForce = this.avoid(obstacles);
      this.applyForce(avoidForce);
  
      super.update();
    }
  
    show() {
        image(heroImage, this.pos.x - this.size/2, this.pos.y - this.size/2, this.size, this.size);
      /* fill(this.color);
      noStroke();
      ellipse(this.pos.x, this.pos.y, this.size); */
    }
  }
  
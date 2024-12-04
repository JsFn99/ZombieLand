class Obstacle {
  constructor(x, y, radius, color) {
    this.pos = createVector(x, y);
    this.radius = radius;
    this.color = color;
  }

  show() {
    image(rockImage, this.pos.x - this.radius, this.pos.y - this.radius, this.radius * 2, this.radius * 2);
    /* fill(this.color);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.radius * 2); */
  }
}

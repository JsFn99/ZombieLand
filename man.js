class Man extends Character {
  constructor(x, y) {
    super(x, y);
    this.size = 40;
    this.color = "yellow";
    this.maxSpeed = 5;
    this.maxForce = 0.4;
    this.vel = p5.Vector.random2D();
    this.vel.setMag(random(2, 4));
    this.acc = createVector();
    this.rayonZoneDeFreinage = 180;

    // poids pour les comportements
    this.arriveWeight = 1;
    this.avoidWeight = 3;
    this.separateWeight = 1;  

    this.distanceSeparation = this.r/2;
  }

  applyBehaviors(leader, obstacles, men) {
    let arriveForce = this.arrive(leader, this.r);
    let avoidForce = this.avoid(obstacles);
    let separateForce = this.separate(men);

    arriveForce.mult(this.arriveWeight);
    avoidForce.mult(this.avoidWeight);
    separateForce.mult(this.separateWeight);

    this.applyForce(arriveForce);
    this.applyForce(avoidForce);
    this.applyForce(separateForce);

    super.update();
  }


    show() {
        image(manImage, this.pos.x - this.size/2, this.pos.y - this.size/2, this.size, this.size);
        // this.drawPath();
      /* fill(this.color);
      noStroke();
      ellipse(this.pos.x, this.pos.y, this.size); */
    }
  }
  
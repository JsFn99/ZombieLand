class Character {
  static debug = false;

  constructor(x, y) {
    // position du véhicule
    this.pos = createVector(x, y);
    // vitesse du véhicule
    this.vel = createVector(0, 0);
    // accélération du véhicule
    this.acc = createVector(0, 0);
    // vitesse maximale du véhicule
    this.maxSpeed = 6;
    // force maximale appliquée au véhicule
    this.maxForce = 0.25;
    this.color = "white";
    // à peu près en secondes
    this.dureeDeVie = 5;

    this.r_pourDessin = 16;
    // rayon du véhicule pour l'évitement
    this.r = this.r_pourDessin * 3;

    // Pour évitement d'obstacle
    this.distanceAhead = 50;
    this.largeurZoneEvitementDevantVaisseau = this.r / 2;

    // chemin derrière vaisseaux
    this.path = [];
    this.pathMaxLength = 30;

    // Paramètres pour separate (on pourra ajouter un curseur)
    this.distanceSeparation = this.r;

    // pour arrive
    this.rayonZoneDeFreinage = 100;

  }

  avoid(obstacles, considereVehiculesCommeObstacles = false) {
    // On calcule un point devant le character courant
    // on l'appelle ahead
    let ahead = this.vel.copy();
    ahead.mult(this.distanceAhead);
    // On calcule ahead2 à mi-distance
    let ahead2 = this.vel.copy();
    ahead2.mult(this.distanceAhead / 2);

    if (Character.debug) {
      // on dessine le vecteur vitesse en jaune
      this.drawVector(this.pos, ahead, "yellow");
      this.drawVector(this.pos, ahead2, "lightblue");
    }
    // Pour le dessiner, il faut lui ajouter la position du character
    ahead.add(this.pos);
    ahead2.add(this.pos);

    if (Character.debug) {
      // on le dessine en rouge
      fill("red");
      circle(ahead.x, ahead.y, 10);
      fill("green");
      circle(ahead2.x, ahead2.y, 10);
    }
    // On cherche l'obstacle le plus proche
    let obstacleLePlusProche = this.getObstacleLePlusProche(obstacles);

    // on considère aussi les autres véhicules comme des obstacles potentiels
    let vehiculeLePlusProche, distance4 = 100000000;

    if (considereVehiculesCommeObstacles) {
      vehiculeLePlusProche = this.getVehiculeLePlusProche(characters);
      // on considère aussi le véhicule le plus proche
      if (vehiculeLePlusProche !== undefined) {
        distance4 = this.pos.dist(vehiculeLePlusProche.pos)
      }
    }

    // On calcule la distance entre la position de l'obstacle le plus proche
    // et le point ahead
    let distance = ahead.dist(obstacleLePlusProche.pos);
    let distance2 = ahead2.dist(obstacleLePlusProche.pos);
    // on prend aussi le vaisseau lui-même
    let distance3 = this.pos.dist(obstacleLePlusProche.pos)


    // distance = la plus petite des deux
    distance = min(distance, distance2);
    distance = min(distance, distance3);
    distance = min(distance, distance4);

    if (distance === distance4) {
      obstacleLePlusProche = vehiculeLePlusProche;
    }


    // si distance < rayon de l'obstacle + rayon du véhicule
    // Alors il y a collision possible, on calcule la force d'évitement
    if (distance < obstacleLePlusProche.r + this.r / 2) {
      // collision possible, on calcule le vecteur qui va 
      // du centre de l'obstacle jusqu'au point ahead, il représente
      // la direction dans laquelle on doit aller pour éviter l'obstacle
      // c'est la force ou la vitesse désirée ?
      let desiredSpeed;

      if (distance === distance2) {
        // c'est le point ahead2 le plus proche
        // c'est le point au bout, ahead, le plus proche
        desiredSpeed = p5.Vector.sub(ahead2, obstacleLePlusProche.pos);
      } else if (distance === distance3) {
        // c'est le vaisseau le plus proche
        desiredSpeed = p5.Vector.sub(this.pos, obstacleLePlusProche.pos);
      } else if (distance === distance4) {
        // l'obstacle le plus proche est un véhicule
        desiredSpeed = p5.Vector.sub(this.pos, obstacleLePlusProche.pos);
      } else {
        // c'est le point au bout, ahead, le plus proche
        desiredSpeed = p5.Vector.sub(ahead, obstacleLePlusProche.pos);
      }

      if (Character.debug) {
        this.drawVector(obstacleLePlusProche.pos, desiredSpeed, "pink");
      }

      // on calcule la force
      // 1 - on la met au maximum
      desiredSpeed.setMag(this.maxSpeed);
      // 2 - formule magique : force = vitesse desiree - vitesse actuelle
      let force = p5.Vector.sub(desiredSpeed, this.vel);

      // on la limite
      force.limit(this.maxForce);

      // et on la renvoie
      return force;
    }

    return createVector(0, 0);

  }

  // Exerce une force renvoyant vers le centre du canvas si le véhicule s'approche
  // des bords du canvas
  boundaries() {
    const d = 25;

    let desired = null;

    // si le véhicule est trop à gauche ou trop à droite
    if (this.pos.x < d) {
      desired = createVector(this.maxSpeed, this.vel.y);
    } else if (this.pos.x > width - d) {
      desired = createVector(-this.maxSpeed, this.vel.y);
    }

    // si le véhicule est trop en haut ou trop en bas
    if (this.pos.y < d) {
      desired = createVector(this.vel.x, this.maxSpeed);
    } else if (this.pos.y > height - d) {
      desired = createVector(this.vel.x, -this.maxSpeed);
    }

    /// si le véhicule est trop à gauche ou trop à droite
    if (desired !== null) {
      desired.normalize();
      desired.mult(this.maxSpeed);
      const steer = p5.Vector.sub(desired, this.vel);
      steer.limit(this.maxForce);
      return steer;
    }
    return createVector(0, 0);
  }

  getObstacleLePlusProche(obstacles) {
    let plusPetiteDistance = 100000000;
    let obstacleLePlusProche = undefined;

    obstacles.forEach(o => {
      // Je calcule la distance entre le character et l'obstacle
      const distance = this.pos.dist(o.pos);

      if (distance < plusPetiteDistance) {
        plusPetiteDistance = distance;
        obstacleLePlusProche = o;
      }
    });

    return obstacleLePlusProche;
  }

  getVehiculeLePlusProche(vehicules) {
    let plusPetiteDistance = Infinity;
    let vehiculeLePlusProche;

    vehicules.forEach(v => {
      if (v != this) {
        // Je calcule la distance entre le vaisseau et le vehicule
        const distance = this.pos.dist(v.pos);
        if (distance < plusPetiteDistance) {
          plusPetiteDistance = distance;
          vehiculeLePlusProche = v;
        }
      }
    });

    return vehiculeLePlusProche;
  }

  arrive(target, d = 0) {
    // 2nd argument true enables the arrival behavior
    // 3rd argumlent d is the distance behind the target
    // for "snake" behavior
    return this.seek(target, true, d);
  }

  seek(target, arrival, d = 0) {
    let desiredSpeed = p5.Vector.sub(target, this.pos);
    let desiredSpeedMagnitude = this.maxSpeed;

    if (arrival) {
      // on dessine un cercle de rayon 100 
      // centré sur le point d'arrivée

      if (Character.debug) {
        noFill();
        stroke("white")
        circle(target.x, target.y, this.rayonZoneDeFreinage)
      }

      // on calcule la distance du véhicule
      // par rapport au centre du cercle
      const dist = p5.Vector.dist(this.pos, target);

      if (dist < this.rayonZoneDeFreinage) {
        // on va diminuer de manière proportionnelle à
        // la distance, la vitesse
        // on va utiliser la fonction map(...) de P5
        // qui permet de modifier une valeur dans un 
        // intervalle initial, vers la même valeur dans un
        // autre intervalle
        // newVal = map(value, start1, stop1, start2, stop2, [withinBounds])
        desiredSpeedMagnitude = map(dist, d, this.rayonZoneDeFreinage, 0, this.maxSpeed)
      }
    }

    // equation force = vitesseDesiree - vitesseActuelle
    desiredSpeed.setMag(desiredSpeedMagnitude);
    let force = p5.Vector.sub(desiredSpeed, this.vel);
    // et on limite la force
    force.limit(this.maxForce);
    return force;
  }

  // Comportement Separation : on garde ses distances par rapport aux voisins
  separate(boids) {
    let desiredseparation = this.distanceSeparation;
    let steer = createVector(0, 0, 0);
    let count = 0;
    // On examine les autres boids pour voir s'ils sont trop près
    for (let i = 0; i < boids.length; i++) {
      let other = boids[i];
      let d = p5.Vector.dist(this.pos, other.pos);
      // Si la distance est supérieure à 0 et inférieure à une valeur arbitraire (0 quand on est soi-même)
      if (d > 0 && d < desiredseparation) {
        // Calculate vector pointing away from neighbor
        let diff = p5.Vector.sub(this.pos, other.pos);
        diff.normalize();
        diff.div(d); // poids en fonction de la distance. Plus le voisin est proche, plus le poids est grand
        steer.add(diff);
        count++; // On compte le nombre de voisins
      }
    }
    // On moyenne le vecteur steer en fonction du nombre de voisins
    if (count > 0) {
      steer.div(count);
    }

    // si la force de répulsion est supérieure à 0
    if (steer.mag() > 0) {
      // On implemente : Steering = Desired - Velocity
      steer.normalize();
      steer.mult(this.maxspeed);
      steer.sub(this.velocity);
      steer.limit(this.maxforce);
    }
    return steer;
  }

  // applyForce est une méthode qui permet d'appliquer une force au character
  // en fait on additionne le vecteur force au vecteur accélération
  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    // on ajoute l'accélération à la vitesse. L'accélération est un incrément de vitesse
    // (accélératiion = dérivée de la vitesse)
    this.vel.add(this.acc);
    // on contraint la vitesse à la valeur maxSpeed
    this.vel.limit(this.maxSpeed);
    // on ajoute la vitesse à la position. La vitesse est un incrément de position, 
    // (la vitesse est la dérivée de la position)
    this.pos.add(this.vel);

    // on remet l'accélération à zéro
    this.acc.set(0, 0);

    // mise à jour du path (la trainée derrière)
    this.ajoutePosAuPath();

    // durée de vie
    this.dureeDeVie -= 0.01;
  }

  ajoutePosAuPath() {
    // on rajoute la position courante dans le tableau
    this.path.push(this.pos.copy());

    // si le tableau a plus de 50 éléments, on vire le plus ancien
    if (this.path.length > this.pathMaxLength) {
      this.path.shift();
    }
  }

  drawVector(pos, v, color) {
    push();
    // Dessin du vecteur vitesse
    // Il part du centre du véhicule et va dans la direction du vecteur vitesse
    strokeWeight(3);
    stroke(color);
    line(pos.x, pos.y, pos.x + v.x, pos.y + v.y);
    // dessine une petite fleche au bout du vecteur vitesse
    let arrowSize = 5;
    translate(pos.x + v.x, pos.y + v.y);
    rotate(v.heading());
    translate(-arrowSize / 2, 0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    pop();
  }

  // détecter les collisions avec les bords de l'écran
  edges() {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
  }
}

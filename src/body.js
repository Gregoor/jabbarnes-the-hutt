import Vector from './vector';

const G = 15;

const G_BOD = {'pos': new Vector(0, 0), 'mass': -100};

class Body {

	constructor(pos, mass, vel, force) {
		this.pos = new Vector(pos);
		this.mass = mass || 1;
		this.vel = vel || Vector.zero();
		this.force = force || Vector.zero();
	}

	step(dt) {
		//this.addForce(G_BOD);
		this.force = this.force.add(this.force.norm().neg().mul(10 * G * dt * dt));

		this.vel = this.vel.add(this.force.mul(dt * dt));
		this.pos = this.pos.add(this.vel.mul(dt));
		this.force = Vector.zero();
	}

	addForce(b) {
		if (this.pos.equals(b.pos)) return;
		let mass = this.mass;
		let totalMass = G * mass * b.mass;
		let tween = this.pos.sub(b.pos);
		this.force = this.force.add(tween.mul(totalMass / Math.pow(tween.mag(), 2)));
	}

	recenter(body) {
		this.pos = this.pos.add(body.pos.mul(body.mass)).div(this.mass);
		this.mass = this.mass + body.mass;
	}

}

export default Body;
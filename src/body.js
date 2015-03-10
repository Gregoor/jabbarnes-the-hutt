import Vector from './vector';

const G = -10;

class Body {

	constructor(pos, mass, vel, force) {
		this.pos = new Vector(pos);
		this.mass = mass || 1;
		this.vel = vel || Vector.zero();
		this.force = force || Vector.zero();
	}

	step(dt) {
		let mass = this.mass;
		let gravPull = this.pos.norm().neg().mul(100 * dt);
		let vel = this.vel.add(this.force.add(gravPull)
			.div(mass).mul(dt)).mul(Math.pow(.9, dt)).max(20);
		let pos = this.pos.add(vel.mul(dt));
		return new Body(pos, mass, vel);
	}

	addForce(b) {
		if (this.pos.equals(b.pos)) return this;
		let pos = this.pos, mass = this.mass;
		let totalMass = G * mass * b.mass;
		let tween = b.pos.sub(pos);
		return new Body(
			pos, mass, this.vel,
			this.force.add(tween.mul(totalMass / Math.pow(tween.mag(), 2)))
		);
	}

	recenter(body) {
		return new Body(
			this.pos.add(body.pos.mul(body.mass)).div(this.mass),
			this.mass + body.mass
		);
	}

}

export default Body;
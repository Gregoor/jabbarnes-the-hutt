import Vector from './vector';
import Body from './body';

class JabbarnesTree {

	constructor(theta) {
		this.root = new Quad(Number.MAX_VALUE);
		this.theta = theta;
	}

	insert(body, ...bodies) {
		let commonParent = this.root, subdivide, quad;
		let oldBody = body instanceof Body ? body : new Body(body);

		do {
			quad = commonParent;
			body = oldBody;
			oldBody = undefined;
			do {
				subdivide = false;

				quad = quad.getQuadFor(body.pos);
				quad.massCenterBody = quad.massCenterBody.recenter(body);

				if (quad.body) {
					oldBody = quad.body;
					quad.body = undefined;
					commonParent = quad;
					subdivide = true;
				}
			} while (subdivide || quad.isInternal());
			quad.body = body;
		} while (oldBody);

		bodies.forEach((b) => this.insert(b));
	}

	iterate(fn) {
		let quads = [], quad = this.root, firstLoop = true;

		do {
			if (!firstLoop || (firstLoop = false)) quad = quads.pop();
			if (!quad) continue;
			if (fn(quad) !== false) quads.push(...quad.quads);

		} while (quads.length);
	}

	getBodies() {
		let bodies = [];

		this.iterate((n) => {if (n.body) bodies.push(n.body)});

		return bodies;
	}

	step(dt) {
		let bodies = this.getBodies().map((b) => {
			b = this.addForcesTo(b);
			return b.step(dt);
		});
		this.root = new Quad(this.root.halfRad);

		this.insert(...bodies);
	}

	addForcesTo(body) {
		let theta = this.theta;
		this.iterate((quad) => {
			let dist = quad.massCenterBody.pos.dist(body.pos);
			if (quad.body || (2 * quad.halfRad) / dist > theta) {
				body = body.addForce(quad.massCenterBody);
				return false;
			}
		});
		return body;
	}

}

class Quad {

	constructor(halfRad, center, body) {
		this.halfRad = halfRad;
		this.center = center ? new Vector(center) : Vector.zero();
		this.body = body;
		this.massCenterBody = body || new Body(Vector.zero(), 0);
		this.quads = [];
	}

	getQuadFor(p) {
		let c = this.center, hr = this.halfRad / 2;
		let isNorth = p.y > c.y, isEast = p.x > c.x;
		let index = (isNorth ? 0 : 2) + (isEast ? 0 : 1);

		let quad = this.quads[index];
		if (!quad) {
			let newCenter = c.add((isEast ? 1 : -1) * hr, (isNorth ? 1 : -1) * hr);
			quad = this.quads[index] = new Quad(hr, newCenter);
		}
		return quad;
	}

	isInternal() {
		return this.quads.length != 0;
	}

}

export default JabbarnesTree;
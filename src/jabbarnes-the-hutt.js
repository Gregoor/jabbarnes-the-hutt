import Vector from './vector';
import Body from './body';
import Node from './node';

class JabbarnesTree {

	constructor(theta) {
		this.root = new Quad(Number.MAX_VALUE / 2);
		this.theta = theta;
	}

	insert(node, ...nodes) {
		let commonParent = this.root, subdivide, quad;
		let oldNode = node instanceof Node ? node : new Node(node);

		do {
			quad = commonParent;
			node = oldNode;
			oldNode = undefined;
			do {
				subdivide = false;

				quad = quad.getQuadFor(node.pos);
				quad.massCenterBody.recenter(node.body);

				if (quad.node) {
					oldNode = quad.node;
					quad.node = undefined;
					commonParent = quad;
					subdivide = true;
				}
			} while (subdivide || quad.isInternal());
			quad.node = node;
		} while (oldNode);

		nodes.forEach((node) => this.insert(node));
	}

	iterate(fn) {
		let quads = [], quad = this.root, firstLoop = true;

		do {
			if (!firstLoop || (firstLoop = false)) quad = quads.pop();
			if (!quad) continue;
			if (fn(quad) !== false) quads.push(...quad.quads);

		} while (quads.length);
	}

	getNodes() {
		let nodes = [];

		this.iterate((quad) => {if (quad.node) nodes.push(quad.node)});

		return nodes;
	}

	step(dt) {
		let nodes = this.getNodes().map((node) => {
			this.addForcesTo(node.body);
			return node.step(dt);
		});
		this.root = new Quad(this.root.halfRad);

		this.insert(...nodes);
	}

	addForcesTo(body) {
		let theta = this.theta;
		this.iterate((quad) => {
			let dist = quad.massCenterBody.pos.dist(body.pos);
			if (quad.body || (2 * quad.halfRad) / dist < theta) {
				body.addForce(quad.massCenterBody);
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

//var trees = [];
//
//var points = [];
//function rnd() { return Math.round((Math.random() > .5 ? 1 : -1) * Math.random() * 90); }
//for (var i = 0; i < 5; i++) {
//	points.push({'body': {'x':rnd(), 'y':rnd()}});
//}
//
//var tr = trees[0] = new JabbarnesTree();
//tr.insert(...points);
//var pfn = (bods) => bods.map((b) => b.pos);
//console.log(pfn(tr.getNodes()));
//tr.step(10);
//console.log(pfn(tr.getNodes()));
//tr.step(10);
//console.log(pfn(tr.getNodes()));



export default JabbarnesTree;
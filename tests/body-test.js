import Vector from '../src/vector';
import Body from '../src/body';
let assert = require('assert');

describe('Body', () => {
	let pos = new Vector(23, 42);
	let mass = 37;
	let vel = new Vector(22, 9);
	let force = new Vector(15, 12);

	describe('#constructor', () => {
		it('saves the parameters correctly', () => {
			let b = new Body(pos, mass, vel, force);
			assert(b.pos.equals(pos));
		});
	});

});
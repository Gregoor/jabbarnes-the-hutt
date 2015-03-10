import Vector from '../src/vector';
let assert = require('assert');

describe('Vector', () => {
	let v1 = new Vector(18, 42), v2 = new Vector(23, 39);

	describe('#zero', () => {
		it('creates a zero vector', () => {
			let v = Vector.zero();
			assert.deepEqual(v, {'x': 0, 'y': 0});
		});
	});

	describe('#constructor', () => {
		it('creates an arbitrary vector', () => {
			let bigRnd = () => Math.random() * Number.MAX_VALUE;
			let x = bigRnd(), y = bigRnd();
			let v = new Vector({x, y});

			assert.deepEqual(v, {x, y});
		});
	});

	describe('#add', () => {
		it('adds single numbers', () => {
			let v = Vector.zero();
			assert.equal(v.add(3).x, 3);
		});

		it('adds whole vectors', () => {
			assert.deepEqual(v1.add(v2), {'x': 41, 'y': 81});
		});
	});

	describe('#sub', () => {
		it('subtracts vectors', () => {
			assert.deepEqual(v1.sub(v2), {'x': -5, 'y': 3});
		});
	});

	describe('#neg', () => {
		it('reverses the vector', () => {
			assert.deepEqual(v1.neg(), {'x': -18, 'y': -42});
		});
	});

	describe('#mul', () => {
		it('scales the vector up', () => {
			assert.deepEqual(v1.mul(5), {'x': 90, 'y': 210});
		});
	});

	describe('#div', () => {
		it('scales the vector down', () => {
			assert.deepEqual(v1.div(3), {'x': 6, 'y': 14});
		});
	});

	describe('#equals', () => {
		it('is false when vectors are unequal', () => {
			assert(!v1.equals(v2));
		});

		it('is true when vectors are equal', () => {
			assert(v1.equals(new Vector(18, 42)));
		});
	});

	describe('#mag', () => {
		it('gives the magnitude of a vector', () => {
			assert.equal((new Vector(3, 4)).mag(), 5);
		});
	});

	describe('#dist', () => {
		it('gives the distance between vectors', () => {
			let v1 = new Vector(3, 0), v2 = new Vector(0, 4);

			assert.equal(v1.dist(v2), 5);
		});
	});

});
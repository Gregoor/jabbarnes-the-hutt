class Vector {

	static zero() {
		return new Vector(0, 0);
	}

	constructor(x, y) {
		var o = x instanceof Object ? x : {x, y};
		this.x = o.x;
		this.y = o.y;
	}

	add(nx, ny) {
		if (nx instanceof Vector) {
			let v = nx;
			nx = v.x;
			ny = v.y;
		} else if (!ny) ny = nx;

		return new Vector(this.x + nx, this.y + ny);
	}

	sub(v) {
		return new Vector(this.x - v.x, this.y - v.y);
	}

	neg() {
		return new Vector(-this.x, -this.y);
	}

	mul(n) {
		return new Vector(this.x * n, this.y * n);
	}

	div(n) {
		return new Vector(this.x / n, this.y / n);
	}

	equals(v) {
		return this.x == v.x && this.y == v.y;
	}

	mag() {
		return this._mag ||
			(this._mag = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2)));
	}

	dist(v) {
		return this.sub(v).mag();
	}

	norm() {
		return this.div(this.mag());
	}

	max(n) {
		return this.mag() <= n ? this : this.norm().mul(n);
	}

	toString() {
		return `(${this.x}/${this.y})`
	}

}

export default Vector;
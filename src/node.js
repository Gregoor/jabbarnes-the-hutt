import Body from './body';

class Node {

	constructor(opts) {
		this.id = opts.id;
		let {x, y} = opts.body;
		this.body = new Body({x, y}, opts.body.mass);
		this.edges = opts.edges;
		this.data = opts.data;
	}

	get pos(){
		return this.body.pos;
	}

	step(dt) {
		this.body.step(dt);

		return this;
	}

}

export default Node;
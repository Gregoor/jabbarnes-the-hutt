(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Vector = _interopRequire(require("./vector"));

var Body = _interopRequire(require("./body"));

var JabbarnesTree = (function () {
	function JabbarnesTree(center, rad, theta) {
		_classCallCheck(this, JabbarnesTree);

		this.center = new Vector(center);
		this.halfRad = rad / 2;
		this.quads = [];
		this.massCenterBody = new Body(Vector.zero(), 0);
		this.theta = theta || 0.5;
	}

	_createClass(JabbarnesTree, {
		insert: {
			value: function insert(body) {
				var _this = this;

				for (var _len = arguments.length, bodies = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
					bodies[_key - 1] = arguments[_key];
				}

				var c = this.center,
				    hr = this.halfRad,
				    p = body.pos;

				this.massCenterBody = this.massCenterBody.recenter(body);

				var isNorth = p.y > c.y,
				    isEast = p.x > c.x;
				var index = (isNorth ? 0 : 2) + (isEast ? 0 : 1);

				var quads = this.quads,
				    subTree = quads[index];

				if (!subTree) {
					quads[index] = body;
					return;
				}

				if (!(subTree instanceof JabbarnesTree)) {
					var oldPoint = subTree;
					var quadCenter = c.add(new Vector((isEast ? 1 : -1) * hr, (isNorth ? 1 : -1) * hr));
					subTree = quads[index] = new JabbarnesTree(quadCenter, hr / 2, this.theta);

					subTree.insert(oldPoint);
				}

				subTree.insert(body);

				bodies.forEach(function (b) {
					return _this.insert(b);
				});
			}
		},
		getBodies: {
			value: function getBodies() {
				return this.quads.reduce(function (bodies, quad) {
					if (quad instanceof JabbarnesTree) bodies = bodies.concat(quad.getBodies());else if (quad instanceof Body) bodies.push(quad);
					return bodies;
				}, []);
			}
		},
		step: {
			value: function step(dt) {
				var _this = this;

				return this.getBodies().map(function (b) {
					return _this.addForcesTo(b).step(dt);
				});
			}
		},
		addForcesTo: {
			value: function addForcesTo(body) {
				var dist = this.massCenterBody.pos.dist(body.pos);
				if (2 * this.halfRad / dist > this.theta) {
					body = body.addForce(this.massCenterBody);
				} else this.quads.forEach(function (quad) {
					if (quad instanceof JabbarnesTree) {
						body = subTree.addForcesTo(body);
					} else if (quad instanceof Body && quad != body) {
						body = body.addForce(quad);
					}
				});

				return body;
			}
		}
	});

	return JabbarnesTree;
})();

module.exports = JabbarnesTree;

},{"./body":2,"./vector":3}],2:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Vector = _interopRequire(require("./vector"));

var G = 9;

var Body = (function () {
	function Body(pos, mass, vel, force) {
		_classCallCheck(this, Body);

		this.pos = pos;
		this.mass = mass || 1;
		this.vel = vel || Vector.zero();
		this.force = force || Vector.zero();
	}

	_createClass(Body, {
		step: {
			value: function step(dt) {
				var mass = this.mass;
				var vel = this.vel.add(this.force.div(mass).mul(dt));
				var pos = this.pos.add(vel.mul(dt));
				return new Body(pos, mass, vel);
			}
		},
		addForce: {
			value: function addForce(b) {
				if (this.pos == b.pos) {
					return this;
				}var totalMass = G * this.mass * b.mass;
				return new Body(this.pos, this.mass, this.vel, this.force.add(totalMass / Math.pow(this.pos.dist(b.pos), 2)));
			}
		},
		recenter: {
			value: function recenter(body) {
				return new Body(this.pos.add(body.pos.mul(body.mass)).div(this.mass), this.mass + body.mass);
			}
		}
	});

	return Body;
})();

module.exports = Body;

},{"./vector":3}],3:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Vector = (function () {
	function Vector(x, y) {
		_classCallCheck(this, Vector);

		var o = x instanceof Object ? x : { x: x, y: y };
		this.x = o.x;
		this.y = o.y;
	}

	_createClass(Vector, {
		add: {
			value: function add(nx, ny) {
				if (nx instanceof Vector) {
					var v = nx;
					nx = v.x;
					ny = v.y;
				} else if (!ny) ny = nx;

				return new Vector(this.x + nx, this.y + ny);
			}
		},
		sub: {
			value: function sub(v) {
				return new Vector(this.x - v.x, this.y - v.y);
			}
		},
		neg: {
			value: function neg() {
				return new Vector(-this.x, -this.y);
			}
		},
		mul: {
			value: function mul(n) {
				return new Vector(this.x * n, this.y * n);
			}
		},
		div: {
			value: function div(n) {
				return new Vector(this.x / n, this.y / n);
			}
		},
		equals: {
			value: function equals(v) {
				return this.x == v.x && this.y == v.y;
			}
		},
		dist: {
			value: function dist(v) {
				return this.sub(v).mag();
			}
		},
		mag: {
			value: function mag() {
				return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
			}
		},
		toString: {
			value: function toString() {
				return "(" + this.x + "/" + this.y + ")";
			}
		}
	}, {
		zero: {
			value: function zero() {
				return new Vector(0, 0);
			}
		}
	});

	return Vector;
})();

module.exports = Vector;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9ncmVnb3IvY29kZS9zY2htYXJuZXMtc2NobXV0L3NyYy9qYWJiYXJuZXMtdGhlLWh1dHQuanMiLCIvaG9tZS9ncmVnb3IvY29kZS9zY2htYXJuZXMtc2NobXV0L3NyYy9ib2R5LmpzIiwiL2hvbWUvZ3JlZ29yL2NvZGUvc2NobWFybmVzLXNjaG11dC9zcmMvdmVjdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7SUNBTyxNQUFNLDJCQUFNLFVBQVU7O0lBQ3RCLElBQUksMkJBQU0sUUFBUTs7SUFFbkIsYUFBYTtBQUVQLFVBRk4sYUFBYSxDQUVOLE1BQU0sRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFO3dCQUYzQixhQUFhOztBQUdqQixNQUFJLENBQUMsTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2pDLE1BQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUN2QixNQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUNoQixNQUFJLENBQUMsY0FBYyxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNqRCxNQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssSUFBSSxHQUFFLENBQUM7RUFDekI7O2NBUkksYUFBYTtBQVVsQixRQUFNO1VBQUEsZ0JBQUMsSUFBSSxFQUFhOzs7c0NBQVIsTUFBTTtBQUFOLFdBQU07OztBQUNyQixRQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTTtRQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTztRQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDOztBQUVyRCxRQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxD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V0FBTyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3RDOztBQUVELE1BQUk7VUFBQSxjQUFDLENBQUMsRUFBRTtBQUNQLFdBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUN6Qjs7QUFFRCxLQUFHO1VBQUEsZUFBRztBQUNMLFdBQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUQ7O0FBRUQsVUFBUTtVQUFBLG9CQUFHO0FBQ1YsaUJBQVcsSUFBSSxDQUFDLENBQUMsU0FBSSxJQUFJLENBQUMsQ0FBQyxPQUFHO0lBQzlCOzs7QUFsRE0sTUFBSTtVQUFBLGdCQUFHO0FBQ2IsV0FBTyxJQUFJLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDeEI7Ozs7UUFKSSxNQUFNOzs7aUJBd0RHLE1BQU0iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFZlY3RvciBmcm9tICcuL3ZlY3Rvcic7XG5pbXBvcnQgQm9keSBmcm9tICcuL2JvZHknO1xuXG5jbGFzcyBKYWJiYXJuZXNUcmVlIHtcblxuXHRjb25zdHJ1Y3RvcihjZW50ZXIsIHJhZCwgdGhldGEpIHtcblx0XHR0aGlzLmNlbnRlciA9IG5ldyBWZWN0b3IoY2VudGVyKTtcblx0XHR0aGlzLmhhbGZSYWQgPSByYWQgLyAyO1xuXHRcdHRoaXMucXVhZHMgPSBbXTtcblx0XHR0aGlzLm1hc3NDZW50ZXJCb2R5ID0gbmV3IEJvZHkoVmVjdG9yLnplcm8oKSwgMCk7XG5cdFx0dGhpcy50aGV0YSA9IHRoZXRhIHx8IC41O1xuXHR9XG5cblx0aW5zZXJ0KGJvZHksIC4uLmJvZGllcykge1xuXHRcdGxldCBjID0gdGhpcy5jZW50ZXIsIGhyID0gdGhpcy5oYWxmUmFkLCBwID0gYm9keS5wb3M7XG5cblx0XHR0aGlzLm1hc3NDZW50ZXJCb2R5ID0gdGhpcy5tYXNzQ2VudGVyQm9keS5yZWNlbnRlcihib2R5KTtcblxuXHRcdGxldCBpc05vcnRoID0gcC55ID4gYy55LCBpc0Vhc3QgPSBwLnggPiBjLng7XG5cdFx0bGV0IGluZGV4ID0gKGlzTm9ydGggPyAwIDogMikgKyAoaXNFYXN0ID8gMCA6IDEpO1xuXG5cdFx0bGV0IHF1YWRzID0gdGhpcy5xdWFkcywgc3ViVHJlZSA9IHF1YWRzW2luZGV4XTtcblxuXHRcdGlmICghc3ViVHJlZSkge1xuXHRcdFx0cXVhZHNbaW5kZXhdID0gYm9keTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoIShzdWJUcmVlIGluc3RhbmNlb2YgSmFiYmFybmVzVHJlZSkpIHtcblx0XHRcdGxldCBvbGRQb2ludCA9IHN1YlRyZWU7XG5cdFx0XHRsZXQgcXVhZENlbnRlciA9IGMuYWRkKFxuXHRcdFx0XHRuZXcgVmVjdG9yKChpc0Vhc3QgPyAxIDogLTEpICogaHIsIChpc05vcnRoID8gMSA6IC0xKSAqIGhyKVxuXHRcdFx0KTtcblx0XHRcdHN1YlRyZWUgPSBxdWFkc1tpbmRleF0gPSBuZXcgSmFiYmFybmVzVHJlZShxdWFkQ2VudGVyLCBociAvIDIsIHRoaXMudGhldGEpO1xuXG5cdFx0XHRzdWJUcmVlLmluc2VydChvbGRQb2ludCk7XG5cdFx0fVxuXG5cdFx0c3ViVHJlZS5pbnNlcnQoYm9keSk7XG5cblx0XHRib2RpZXMuZm9yRWFjaCgoYikgPT4gdGhpcy5pbnNlcnQoYikpO1xuXHR9XG5cblx0Z2V0Qm9kaWVzKCkge1xuXHRcdHJldHVybiB0aGlzLnF1YWRzLnJlZHVjZSgoYm9kaWVzLCBxdWFkKSA9PiB7XG5cdFx0XHRpZiAocXVhZCBpbnN0YW5jZW9mIEphYmJhcm5lc1RyZWUpIGJvZGllcyA9IGJvZGllcy5jb25jYXQocXVhZC5nZXRCb2RpZXMoKSk7XG5cdFx0XHRlbHNlIGlmIChxdWFkIGluc3RhbmNlb2YgQm9keSkgYm9kaWVzLnB1c2gocXVhZCk7XG5cdFx0XHRyZXR1cm4gYm9kaWVzO1xuXHRcdH0sIFtdKTtcblx0fVxuXG5cdHN0ZXAoZHQpIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRCb2RpZXMoKS5tYXAoKGIpID0+IHRoaXMuYWRkRm9yY2VzVG8oYikuc3RlcChkdCkpO1xuXHR9XG5cblx0YWRkRm9yY2VzVG8oYm9keSkge1xuXHRcdGxldCBkaXN0ID0gdGhpcy5tYXNzQ2VudGVyQm9keS5wb3MuZGlzdChib2R5LnBvcyk7XG5cdFx0aWYgKCgyICogdGhpcy5oYWxmUmFkKSAvIGRpc3QgPiB0aGlzLnRoZXRhKSB7XG5cdFx0XHRib2R5ID0gYm9keS5hZGRGb3JjZSh0aGlzLm1hc3NDZW50ZXJCb2R5KTtcblx0XHR9IGVsc2UgdGhpcy5xdWFkcy5mb3JFYWNoKChxdWFkKSA9PiB7XG5cdFx0XHRpZiAocXVhZCBpbnN0YW5jZW9mIEphYmJhcm5lc1RyZWUpIHtcblx0XHRcdFx0Ym9keSA9IHN1YlRyZWUuYWRkRm9yY2VzVG8oYm9keSk7XG5cdFx0XHR9IGVsc2UgaWYgKHF1YWQgaW5zdGFuY2VvZiBCb2R5ICYmIHF1YWQgIT0gYm9keSkge1xuXHRcdFx0XHRib2R5ID0gYm9keS5hZGRGb3JjZShxdWFkKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHJldHVybiBib2R5O1xuXHR9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgSmFiYmFybmVzVHJlZTsiLCJpbXBvcnQgVmVjdG9yIGZyb20gJy4vdmVjdG9yJztcblxuY29uc3QgRyA9IDk7XG5cbmNsYXNzIEJvZHkge1xuXG5cdGNvbnN0cnVjdG9yKHBvcywgbWFzcywgdmVsLCBmb3JjZSkge1xuXHRcdHRoaXMucG9zID0gcG9zO1xuXHRcdHRoaXMubWFzcyA9IG1hc3MgfHwgMTtcblx0XHR0aGlzLnZlbCA9IHZlbCB8fCBWZWN0b3IuemVybygpO1xuXHRcdHRoaXMuZm9yY2UgPSBmb3JjZSB8fCBWZWN0b3IuemVybygpO1xuXHR9XG5cblx0c3RlcChkdCkge1xuXHRcdGxldCBtYXNzID0gdGhpcy5tYXNzO1xuXHRcdGxldCB2ZWwgPSB0aGlzLnZlbC5hZGQodGhpcy5mb3JjZS5kaXYobWFzcykubXVsKGR0KSk7XG5cdFx0bGV0IHBvcyA9IHRoaXMucG9zLmFkZCh2ZWwubXVsKGR0KSk7XG5cdFx0cmV0dXJuIG5ldyBCb2R5KHBvcywgbWFzcywgdmVsKTtcblx0fVxuXG5cdGFkZEZvcmNlKGIpIHtcblx0XHRpZiAodGhpcy5wb3MgPT0gYi5wb3MpIHJldHVybiB0aGlzO1xuXHRcdGxldCB0b3RhbE1hc3MgPSBHICogdGhpcy5tYXNzICogYi5tYXNzO1xuXHRcdHJldHVybiBuZXcgQm9keShcblx0XHRcdHRoaXMucG9zLCB0aGlzLm1hc3MsIHRoaXMudmVsLFxuXHRcdFx0dGhpcy5mb3JjZS5hZGQodG90YWxNYXNzIC8gTWF0aC5wb3codGhpcy5wb3MuZGlzdChiLnBvcyksIDIpKVxuXHRcdCk7XG5cdH1cblxuXHRyZWNlbnRlcihib2R5KSB7XG5cdFx0cmV0dXJuIG5ldyBCb2R5KFxuXHRcdFx0dGhpcy5wb3MuYWRkKGJvZHkucG9zLm11bChib2R5Lm1hc3MpKS5kaXYodGhpcy5tYXNzKSxcblx0XHRcdHRoaXMubWFzcyArIGJvZHkubWFzc1xuXHRcdCk7XG5cdH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBCb2R5OyIsImNsYXNzIFZlY3RvciB7XG5cblx0c3RhdGljIHplcm8oKSB7XG5cdFx0cmV0dXJuIG5ldyBWZWN0b3IoMCwgMCk7XG5cdH1cblxuXHRjb25zdHJ1Y3Rvcih4LCB5KSB7XG5cdFx0dmFyIG8gPSB4IGluc3RhbmNlb2YgT2JqZWN0ID8geCA6IHt4LCB5fTtcblx0XHR0aGlzLnggPSBvLng7XG5cdFx0dGhpcy55ID0gby55O1xuXHR9XG5cblx0YWRkKG54LCBueSkge1xuXHRcdGlmIChueCBpbnN0YW5jZW9mIFZlY3Rvcikge1xuXHRcdFx0bGV0IHYgPSBueDtcblx0XHRcdG54ID0gdi54O1xuXHRcdFx0bnkgPSB2Lnk7XG5cdFx0fSBlbHNlIGlmICghbnkpIG55ID0gbng7XG5cblx0XHRyZXR1cm4gbmV3IFZlY3Rvcih0aGlzLnggKyBueCwgdGhpcy55ICsgbnkpO1xuXHR9XG5cblx0c3ViKHYpIHtcblx0XHRyZXR1cm4gbmV3IFZlY3Rvcih0aGlzLnggLSB2LngsIHRoaXMueSAtIHYueSk7XG5cdH1cblxuXHRuZWcoKSB7XG5cdFx0cmV0dXJuIG5ldyBWZWN0b3IoLXRoaXMueCwgLXRoaXMueSk7XG5cdH1cblxuXHRtdWwobikge1xuXHRcdHJldHVybiBuZXcgVmVjdG9yKHRoaXMueCAqIG4sIHRoaXMueSAqIG4pO1xuXHR9XG5cblx0ZGl2KG4pIHtcblx0XHRyZXR1cm4gbmV3IFZlY3Rvcih0aGlzLnggLyBuLCB0aGlzLnkgLyBuKTtcblx0fVxuXG5cdGVxdWFscyh2KSB7XG5cdFx0cmV0dXJuIHRoaXMueCA9PSB2LnggJiYgdGhpcy55ID09IHYueTtcblx0fVxuXG5cdGRpc3Qodikge1xuXHRcdHJldHVybiB0aGlzLnN1Yih2KS5tYWcoKTtcblx0fVxuXG5cdG1hZygpIHtcblx0XHRyZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KHRoaXMueCwgMikgKyBNYXRoLnBvdyh0aGlzLnksIDIpKTtcblx0fVxuXG5cdHRvU3RyaW5nKCkge1xuXHRcdHJldHVybiBgKCR7dGhpcy54fS8ke3RoaXMueX0pYFxuXHR9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgVmVjdG9yOyJdfQ==

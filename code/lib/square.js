import { Transform } from './transform.js';

export class Square {
	// A new class to render squares. It takes the left upper point and then calculates the other vertices, creates two triangles to form one square.
	constructor(left_corner, a, color) {
		this.vertexPositions = new Float32Array([
			left_corner[0], left_corner[1], 0.0,
			left_corner[0] + a, left_corner[1], 0.0,
			left_corner[0], left_corner[1] + a, 0.0,
			left_corner[0], left_corner[1] + a, 0.0,
			left_corner[0] + a, left_corner[1] + a, 0.0,
			left_corner[0] + a, left_corner[1], 0.0,
		]);
		this.type = "square";
		this.color = color;
		this.transform = new Transform();
	}
}
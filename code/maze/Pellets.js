import { Transform } from "../lib/threeD.js";

export class Pellets {
	constructor(tile_size = 40) {
		this.tile_size = tile_size;
		this.vertexPositions = [];
		this.transform = new Transform();
		this.type = "render_normal";
		this.color = [0, 1, 0, 1]
		this.pointsFlag = true;
		this.pointSize = 3.0;
	}
	add(point) {
		//adding points accessed by pacman.
		let tempArray = [...this.vertexPositions]
		if (point !== undefined) {
			tempArray = [...tempArray, ...point.map(x => x * this.tile_size + this.tile_size / 2)]
			tempArray.push(0);
		}
		this.vertexPositions = new Float32Array(tempArray);
	}
}
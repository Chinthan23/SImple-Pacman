import { Transform } from "../lib/threeD.js";

export class PowerPellets {
	constructor(gridPoints, tile_size = 40) {
		let tempArray = [];
		for (var i = 0; i < gridPoints.length; i += 2) {
			tempArray.push(gridPoints[i] * tile_size + tile_size / 2)
			tempArray.push(gridPoints[i + 1] * tile_size + tile_size / 2)
			tempArray.push(0)
		}
		this.vertexPositions = new Float32Array(tempArray);
		this.transform = new Transform();
		this.type = "render_normal";
		this.color = [0, 1, 0, 1];
		this.pointsFlag = true;
		this.pointSize = 12.0;
	}
}
import { Transform } from "../lib/threeD.js";
export class Grid {
	constructor(width, height, tile_size = 40) {
		this.tile_size = tile_size;
		this.gridPointsList = [];
		this.gridWidth = width;
		this.gridHeight = height;
		//Getting points for each grid cell.
		for (var i = 0; i < this.gridWidth; i += this.tile_size) {
			for (var j = 0; j < this.gridHeight; j += this.tile_size) {
				this.gridPointsList.push(i + this.tile_size / 2, j + this.tile_size / 2, 0.0);
			}
		}
		this.transform = new Transform();
		this.gridPointsList = new Float32Array(this.gridPointsList)
		this.type = "GridPoints";
		this.color = [255 / 255, 165 / 255, 0, 1.0]
	}
	render(shader, resolution) {
		// a render function as it consists of primitives, aka points.
		shader.bindArrayBuffer(shader.vertexAttributesBuffer, this.gridPointsList);
		shader.setUniform3f("u_resolution", resolution);
		shader.fillAttributeData("aPosition",
			this.gridPointsList,
			3,
			0,
			0);
		shader.setUniform4f("uColor", this.color);
		shader.setUniformMatrix4fv("uModelMatrix", this.transform.modelTransformMatrix);
		shader.drawArrays(this.gridPointsList.length / 3, "L");
	}
}
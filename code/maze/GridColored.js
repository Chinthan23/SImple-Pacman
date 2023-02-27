import { Square, Transform } from "../lib/threeD.js";

export class GridColored {
	constructor(width, height, mazeConfig, tile_size = 40) {
		this.tile_size = tile_size;
		this.squareList = [];
		this.gridWidth = width;
		this.gridHeight = height;
		//Getting the squares which have to be colored grid cells in the maze based on the given maze configuration.
		//If the cell is 0 a square is placed on that grid cell.
		for (var i = 0; i < this.gridWidth; i += this.tile_size) {
			for (var j = 0; j < this.gridHeight; j += this.tile_size) {
				if (mazeConfig[j / this.tile_size >> 0][i / this.tile_size >> 0] === 0) this.squareList.push(new Square([i, j], this.tile_size, [120 / 255, 16 / 255, 255 / 255, 0.75]));
			}
		}
		this.transform = new Transform();
		this.type = "Grid";
	}
	render(shader, resolution) {
		//Since it consists of a list of square a render function to render them.
		this.squareList.forEach(function (square) {
			shader.bindArrayBuffer(shader.vertexAttributesBuffer, square.vertexPositions);
			shader.setUniform3f("u_resolution", resolution);
			shader.fillAttributeData("aPosition",
				square.vertexPositions,
				3,
				3 * square.vertexPositions.BYTES_PER_ELEMENT,
				0);
			shader.setUniform4f("uColor", square.color);
			shader.setUniformMatrix4fv("uModelMatrix", square.transform.modelTransformMatrix);
			shader.drawArrays(square.vertexPositions.length / 3);
		})
	}
}
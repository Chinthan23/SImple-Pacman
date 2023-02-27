import { Ghost } from "./Ghost.js";

export class Ghosts {
	constructor(gridWidth, gridLength, tileSize, positions = [4, 18, 19, 19, 23, 5, 13, 14]) {
		//stores a list of ghosts and changes their color accordingly based on power pellet grid cell accessed or not.
		this.color = [
		[255 / 255, 0, 0, 1],
		[255 / 255, 184 / 255, 255 / 255, 1],
		[255 / 255, 184 / 255, 82 / 255, 1],
		[0, 255 / 255, 255 / 255, 1]]
		this.positions = positions
		this.ghostList = [
			new Ghost(this.positions[0], this.positions[1], tileSize, this.color[0], gridWidth, gridLength),
			new Ghost(this.positions[2], this.positions[3], tileSize, this.color[1], gridWidth, gridLength),
			new Ghost(this.positions[4], this.positions[5], tileSize, this.color[2], gridWidth, gridLength),
			new Ghost(this.positions[6], this.positions[7], tileSize, this.color[3], gridWidth, gridLength)
		];
		this.type = "Ghost"
	}
	setColor(color) {
		if (color === 0) {// If the power pellet is not accessed.
			color = this.color;
			this.ghostList.forEach((ghost, index) => ghost.color = color[index])
		}
		else {
			this.ghostList.forEach((ghost) => { ghost.color = color; })
		}
	}
	render(shader, resolution) { 
		// a render function as it has a list of primitives.
		this.ghostList.forEach(function (monster) {
			shader.bindArrayBuffer(shader.vertexAttributesBuffer, monster.vertexPositions);
			shader.setUniform3f("u_resolution", resolution);
			shader.fillAttributeData("aPosition",
				monster.vertexPositions,
				3,
				3 * monster.vertexPositions.BYTES_PER_ELEMENT,
				0);
			shader.setUniform4f("uColor", monster.color);
			shader.setUniformMatrix4fv("uModelMatrix", monster.transform.modelTransformMatrix);
			shader.drawArrays(monster.vertexPositions.length / 3);
		})
	}
}
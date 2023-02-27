import { Triangle } from "../lib/triangle.js";

export class Ghost extends Triangle {
	//Ghosts are rendered as triangles. I take the grid points and make a triangle around that point.
	constructor(centerX, centerY, tileSize, color, gridWidth, gridLength) {
		//As it extends triagnle I send the vertex positions calculated to the super class.
		super(
		[centerX * tileSize + tileSize / 2, centerY * tileSize + tileSize / 2 - (tileSize / 2 - 5)],
		[centerX * tileSize + tileSize / 2 - (tileSize / 2 - 5), centerY * tileSize + tileSize / 2 + tileSize / 2 - 5],
		[centerX * tileSize + tileSize / 2 + tileSize / 2 - 5, centerY * tileSize + tileSize / 2 + tileSize / 2 - 5], 
		color);
		this.gridWidth = gridWidth;
		this.gridLength = gridLength;
		this.centerX = centerX;
		this.centerY = centerY;
		this.tileSize = tileSize;
		this.canvasX = this.centerX * this.tileSize + this.tileSize / 2;
		this.canvasY = this.centerY * this.tileSize + this.tileSize / 2;
		this.presentX = this.centerX * this.tileSize + this.tileSize / 2;
		this.presentY = this.centerY * this.tileSize + this.tileSize / 2;

		this.centers = [centerX, centerY, this.gridLength - centerY, centerX, this.gridWidth - centerX, this.gridLength - centerY, centerY, this.gridWidth - centerX]
	}

	updateCenter(direction) {
		//This updates center of the ghost as the direction changes.
		//Not used to perform any operations.
		this.centerX = this.centers[2 * direction]
		this.centerY = this.centers[2 * direction + 1]
		this.presentX = this.centerX * this.tileSize + this.tileSize / 2;
		this.presentY = this.centerY * this.tileSize + this.tileSize / 2;
	}
}